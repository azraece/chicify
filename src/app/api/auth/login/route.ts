import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'E-posta ve şifre gerekli' },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        
        // Kullanıcıyı e-posta ile bul
        const user = await db.collection('users').findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: 'Geçersiz e-posta veya şifre' },
                { status: 401 }
            );
        }

        // Şifre kontrolü (eğer şifreler hashlenmiş değilse basit karşılaştırma)
        let isPasswordValid = false;
        
        if (user.password) {
            try {
                // Bcrypt ile hashlenmişse
                isPasswordValid = await bcrypt.compare(password, user.password);
            } catch (error) {
                // Hash değilse direkt karşılaştır (demo için)
                isPasswordValid = password === user.password;
            }
        } else {
            // Demo kullanıcıları için varsayılan şifre
            isPasswordValid = password === 'demo123';
        }

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Geçersiz e-posta veya şifre' },
                { status: 401 }
            );
        }

        // JWT token oluştur
        const token = jwt.sign(
            { 
                userId: user._id.toString(),
                email: user.email,
                username: user.username 
            },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '7d' }
        );

        // Cookie'ye token'ı kaydet
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 // 7 gün
        });

        return NextResponse.json({
            success: true,
            message: 'Giriş başarılı',
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                followersCount: user.followersCount || 0,
                followingCount: user.followingCount || 0
            }
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
} 
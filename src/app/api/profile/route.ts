import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) {
            return NextResponse.json({ error: 'Token bulunamadı' }, { status: 401 });
        }

        // JWT token'ı doğrula
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        } catch (jwtError) {
            return NextResponse.json({ error: 'Geçersiz token' }, { status: 401 });
        }

        const { db } = await connectToDatabase();
        
        // MongoDB ObjectId dönüşümü
        let userObjectId;
        try {
            userObjectId = new ObjectId(decoded.userId);
        } catch (error) {
            return NextResponse.json({ error: 'Geçersiz kullanıcı ID' }, { status: 400 });
        }

        const user = await db.collection('users').findOne(
            { _id: userObjectId },
            { 
                projection: { 
                    name: 1, 
                    username: 1, 
                    email: 1,
                    bio: 1,
                    location: 1,
                    website: 1,
                    followersCount: 1,
                    followingCount: 1,
                    profileImage: 1,
                    createdAt: 1,
                    updatedAt: 1
                } 
            }
        );

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio || null,
                location: user.location || null,
                website: user.website || null,
                followersCount: user.followersCount || 0,
                followingCount: user.followingCount || 0,
                profileImage: user.profileImage || null,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt || null
            }
        });

    } catch (error) {
        console.error('Profile API Error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
} 
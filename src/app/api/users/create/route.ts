import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const { name, username, email, bio, location, website } = await request.json();

        if (!name || !username || !email) {
            return NextResponse.json(
                { error: 'Ad, kullanıcı adı ve e-posta gerekli' },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        
        // Email ve username unique kontrolü
        const existingUser = await db.collection('users').findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'Bu e-posta veya kullanıcı adı zaten kullanılıyor' },
                { status: 400 }
            );
        }

        // Yeni kullanıcı oluştur
        const newUser = {
            name,
            username,
            email,
            bio: bio || null,
            location: location || null,
            website: website || null,
            followersCount: Math.floor(Math.random() * 1000), // Random follower count
            followingCount: Math.floor(Math.random() * 500),  // Random following count
            profileImage: null,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('users').insertOne(newUser);

        return NextResponse.json({
            success: true,
            message: 'Kullanıcı başarıyla oluşturuldu',
            user: {
                _id: result.insertedId,
                ...newUser
            }
        });

    } catch (error) {
        console.error('User creation error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
} 
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
    try {
        const { db } = await connectToDatabase();
        
        // Tüm kullanıcıları getir (şifre gibi hassas bilgiler hariç)
        const users = await db.collection('users').find(
            {},
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
        ).sort({ createdAt: -1 }).toArray();

        return NextResponse.json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error('User list error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
} 
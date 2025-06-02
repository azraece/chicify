import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

export async function PUT(request: NextRequest) {
    try {
        const { userId, name, username, email, bio, location, website } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID gerekli' },
                { status: 400 }
            );
        }

        const { db } = await connectToDatabase();
        
        // MongoDB ObjectId dönüşümü
        let userObjectId;
        try {
            userObjectId = new ObjectId(userId);
        } catch (error) {
            return NextResponse.json({ error: 'Geçersiz kullanıcı ID' }, { status: 400 });
        }

        // Kullanıcı verilerini güncelle
        const updateData: any = {
            updatedAt: new Date()
        };

        if (name) updateData.name = name;
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (bio) updateData.bio = bio;
        if (location) updateData.location = location;
        if (website) updateData.website = website;

        const result = await db.collection('users').updateOne(
            { _id: userObjectId },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // Güncellenmiş kullanıcı verilerini getir
        const updatedUser = await db.collection('users').findOne({ _id: userObjectId });

        return NextResponse.json({
            success: true,
            message: 'Kullanıcı başarıyla güncellendi',
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                username: updatedUser.username,
                email: updatedUser.email,
                bio: updatedUser.bio || null,
                location: updatedUser.location || null,
                website: updatedUser.website || null,
                followersCount: updatedUser.followersCount || 0,
                followingCount: updatedUser.followingCount || 0,
                profileImage: updatedUser.profileImage || null,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt
            }
        });

    } catch (error) {
        console.error('User update error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
} 
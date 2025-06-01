import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  let client;
  try {
    const { email, password } = await request.json();
    
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB bağlantı bilgisi eksik');
    }

    client = await MongoClient.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 30000,
      family: 4,
      directConnection: true
    });

    const db = client.db();
    const user = await db.collection('users').findOne({ email });
    console.log('Bulunan kullanıcı:', user);

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Geçersiz şifre' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      redirect: '/profile/avatar',
      user: {
        id: user._id,
        email: user.email,
        name: user.name || user.firstName
      }
    });
  } catch (error: any) {
    console.error('Giriş hatası detayı:', error);
    return NextResponse.json(
      { error: 'Giriş işlemi başarısız: ' + error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
} 
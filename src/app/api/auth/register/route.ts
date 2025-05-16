import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db();
    
    // Email kontrolü
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      await client.close();
      return NextResponse.json({ error: 'Bu email zaten kayıtlı' }, { status: 400 });
    }

    // Şifre hashleme
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Kullanıcı kaydetme
    await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date()
    });

    await client.close();
    return NextResponse.json({ message: 'Kayıt başarılı' });
  } catch (error) {
    return NextResponse.json({ error: 'Kayıt işlemi başarısız' }, { status: 500 });
  }
} 
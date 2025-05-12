import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { firstName, lastName, username, phone, email, password } = await req.json();

    const { db } = await connectToDatabase();

    // E-posta ve kullanıcı adı kontrolü
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta veya kullanıcı adı zaten kullanılıyor' },
        { status: 400 }
      );
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const user = await User.create({
      firstName,
      lastName,
      username,
      phone,
      email,
      password: hashedPassword
    });

    return NextResponse.json(
      { message: 'Kullanıcı başarıyla oluşturuldu', userId: user._id },
      { status: 201 }
    );

  } catch (error) {
    console.error('Kayıt hatası:', error);
    return NextResponse.json(
      { error: 'Kayıt işlemi sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
} 
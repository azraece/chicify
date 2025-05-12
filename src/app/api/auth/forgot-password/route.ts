import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';
import { sendSMS } from '@/lib/sms';

export async function POST(req: Request) {
  try {
    const { method, email, phone } = await req.json();

    if (!method || (method === 'email' && !email) || (method === 'phone' && !phone)) {
      return NextResponse.json(
        { error: 'Geçerli bir e-posta veya telefon numarası gerekli' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const query = method === 'email' ? { email } : { phone };
    const user = await db.collection('users').findOne(query);

    if (!user) {
      return NextResponse.json(
        { error: 'Bu bilgilerle kayıtlı kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    // Şifre sıfırlama token'ı oluştur
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 saat geçerli

    // Token'ı veritabanına kaydet
    await db.collection('users').updateOne(
      query,
      {
        $set: {
          resetToken,
          resetTokenExpiry,
        },
      }
    );

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    if (method === 'email') {
      // E-posta gönder
      await sendEmail({
        to: email,
        subject: 'Chicify - Şifre Sıfırlama',
        html: `
          <p>Merhaba,</p>
          <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>Bu bağlantı 1 saat süreyle geçerlidir.</p>
          <p>Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        `,
      });
    } else {
      // SMS gönder
      await sendSMS({
        to: phone,
        message: `Chicify şifre sıfırlama bağlantınız: ${resetUrl} (1 saat geçerlidir)`,
      });
    }

    return NextResponse.json(
      { message: 'Şifre sıfırlama bağlantısı gönderildi' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Şifre sıfırlama hatası:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu' },
      { status: 500 }
    );
  }
} 
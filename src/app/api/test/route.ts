import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    await client.close();
    return NextResponse.json({ status: 'success', message: 'MongoDB bağlantısı başarılı' });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: 'MongoDB bağlantı hatası' }, { status: 500 });
  }
} 
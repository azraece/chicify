import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        
        // Token cookie'sini sil
        cookieStore.delete('token');
        
        // Form submission'dan geliyorsa redirect yap
        const contentType = request.headers.get('content-type');
        if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
            redirect('/login');
        }
        
        return NextResponse.json({
            success: true,
            message: 'Çıkış başarılı'
        });

    } catch (error) {
        console.error('Logout API Error:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası' },
            { status: 500 }
        );
    }
} 
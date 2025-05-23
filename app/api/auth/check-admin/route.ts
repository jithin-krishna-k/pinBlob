import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = cookies();
    const adminAuth = (await cookieStore).get('admin-auth');
    
    return NextResponse.json({
        isAdmin: adminAuth?.value === 'true'
    });
} 
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;


    if (email === adminEmail && password === adminPassword) {
        const response = NextResponse.json({ message: 'Login successful' });
        response.cookies.set('admin-auth', 'true', {
            path: '/',
        })
        return response;
    }

    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
}

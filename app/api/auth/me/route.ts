import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

let users: any[] = [];

export async function GET() {
  try {
    const token = cookies().get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return NextResponse.json({ user: null });
    }

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
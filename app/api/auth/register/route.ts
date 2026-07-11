// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Generate hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await query(
      `INSERT INTO users (id, name, email, password, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, NOW())
       RETURNING id, name, email`,
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, name: user.name, email: user.email },
      token 
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
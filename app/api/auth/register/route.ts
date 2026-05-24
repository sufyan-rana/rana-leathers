import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// In-memory user storage (for demo - use a real database in production)
// This will reset when server restarts
let users: any[] = [];

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    // Create JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Set cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    // Return user info (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ user: userWithoutPassword, token });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
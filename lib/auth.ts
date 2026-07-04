// lib/auth.ts
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { getUserById } from './db-utils';

export async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) return null;
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await getUserById(decoded.id);
    return user;
  } catch (error) {
    return null;
  }
}

export function generateToken(userId: string) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Environment Variables Test',
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing',
    nextAuthUrl: process.env.NEXTAUTH_URL || 'Not set',
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
    timestamp: new Date().toISOString(),
  });
} 
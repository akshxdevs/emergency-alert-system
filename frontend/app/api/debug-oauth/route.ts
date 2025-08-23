import { NextResponse } from 'next/server';

export async function GET() {
  // Check all environment variables
  const envCheck = {
    GOOGLE_CLIENT_ID: {
      exists: !!process.env.GOOGLE_CLIENT_ID,
      value: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...` : 'Not set',
      valid: process.env.GOOGLE_CLIENT_ID?.includes('googleusercontent.com') || false
    },
    GOOGLE_CLIENT_SECRET: {
      exists: !!process.env.GOOGLE_CLIENT_SECRET,
      value: process.env.GOOGLE_CLIENT_SECRET ? `${process.env.GOOGLE_CLIENT_SECRET.substring(0, 10)}...` : 'Not set',
      valid: process.env.GOOGLE_CLIENT_SECRET?.startsWith('GOCSPX') || false
    },
    NEXTAUTH_URL: {
      exists: !!process.env.NEXTAUTH_URL,
      value: process.env.NEXTAUTH_URL || 'Not set',
      valid: process.env.NEXTAUTH_URL === 'https://alertsystem.akshxdevs.com'
    },
    NEXTAUTH_SECRET: {
      exists: !!process.env.NEXTAUTH_SECRET,
      value: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
      valid: !!process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET !== 'akshxsceret@@#@#'
    }
  };

  // Check for common issues
  const issues = [];
  if (!envCheck.GOOGLE_CLIENT_ID.exists) issues.push('GOOGLE_CLIENT_ID is missing');
  if (!envCheck.GOOGLE_CLIENT_SECRET.exists) issues.push('GOOGLE_CLIENT_SECRET is missing');
  if (!envCheck.NEXTAUTH_URL.exists) issues.push('NEXTAUTH_URL is missing');
  if (!envCheck.NEXTAUTH_SECRET.valid) issues.push('NEXTAUTH_SECRET is not properly set');
  if (!envCheck.GOOGLE_CLIENT_ID.valid) issues.push('GOOGLE_CLIENT_ID format appears invalid');
  if (!envCheck.GOOGLE_CLIENT_SECRET.valid) issues.push('GOOGLE_CLIENT_SECRET format appears invalid');

  return NextResponse.json({
    message: 'OAuth Debug Information',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    envCheck,
    issues,
    recommendations: [
      'Make sure all environment variables are set in Vercel',
      'Verify Google Cloud Console redirect URI: https://alertsystem.akshxdevs.com/api/auth/callback/google',
      'Check that Google+ API and Google Identity API are enabled',
      'Ensure your Google OAuth client is configured for web application',
      'Verify the client ID and secret match your Google Cloud Console'
    ]
  });
} 
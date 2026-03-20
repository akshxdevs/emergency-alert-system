import { NextResponse } from 'next/server';

export async function GET() {
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;

  const envCheck = {
    GOOGLE_CLIENT_ID: {
      exists: !!googleClientId,
      value: googleClientId ? `${googleClientId.substring(0, 10)}...` : 'Not set',
      valid: googleClientId?.includes('googleusercontent.com') || false
    },
    GOOGLE_CLIENT_SECRET: {
      exists: !!googleClientSecret,
      value: googleClientSecret ? `${googleClientSecret.substring(0, 10)}...` : 'Not set',
      valid: Boolean(googleClientSecret && googleClientSecret.length >= 20)
    },
    NEXTAUTH_URL: {
      exists: !!nextAuthUrl,
      value: nextAuthUrl || 'Not set',
      valid: Boolean(nextAuthUrl?.startsWith('http'))
    },
    NEXTAUTH_SECRET: {
      exists: !!nextAuthSecret,
      value: nextAuthSecret ? 'Set' : 'Not set',
      valid: Boolean(nextAuthSecret && nextAuthSecret.length >= 16)
    }
  };

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
      'Make sure all required environment variables are set in your deployment platform',
      `Verify Google Cloud Console redirect URI: ${nextAuthUrl || '<NEXTAUTH_URL>'}/api/auth/callback/google`,
      'Check that Google+ API and Google Identity API are enabled',
      'Ensure your Google OAuth client is configured for web application',
      'Verify the client ID and secret match your Google Cloud Console'
    ]
  });
} 

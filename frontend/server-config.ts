import "server-only";

function requireServerEnv(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required server environment variable: ${key}`);
  }

  return value;
}

export const NEXTAUTH_URL = requireServerEnv("NEXTAUTH_URL");
export const NEXTAUTH_SECRET = requireServerEnv("NEXTAUTH_SECRET");
export const GOOGLE_CLIENT_ID = requireServerEnv("GOOGLE_CLIENT_ID");
export const GOOGLE_CLIENT_SECRET = requireServerEnv("GOOGLE_CLIENT_SECRET");

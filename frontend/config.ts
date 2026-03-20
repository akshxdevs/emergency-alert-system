function requirePublicEnv(key: string): string {
  const value = process.env[key]?.trim();
  if (!value) {
    throw new Error(`Missing required public environment variable: ${key}`);
  }

  return value;
}

export const BACKEND_URL = requirePublicEnv("NEXT_PUBLIC_BACKEND_URL");
export const WS_URL = requirePublicEnv("NEXT_PUBLIC_WS_URL");

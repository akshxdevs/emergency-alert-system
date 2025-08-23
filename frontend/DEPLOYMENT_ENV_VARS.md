# Deployment Environment Variables

## Required Environment Variables for https://alertsystem.akshxdevs.com

Set these environment variables in your deployment platform (Vercel, Netlify, etc.):

### Google OAuth Configuration
```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### NextAuth Configuration
```env
NEXTAUTH_URL=https://alertsystem.akshxdevs.com
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### Backend URLs
```env
BACKEND_URL=https://emergency-alert-system-bffp.onrender.com/api/v1
WS_URL=wss://emergency-alert-system-bffp.onrender.com
```

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add this redirect URI:
   ```
   https://alertsystem.akshxdevs.com/api/auth/callback/google
   ```

## How to Set Environment Variables

### Vercel
1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" > "Environment Variables"
4. Add each variable with the values above
5. Redeploy your application

### Netlify
1. Go to your Netlify dashboard
2. Select your site
3. Go to "Site Settings" > "Environment Variables"
4. Add each variable with the values above
5. Redeploy your application

## Testing
After setting the environment variables:
1. Redeploy your application
2. Visit https://alertsystem.akshxdevs.com/login
3. Try the Google sign-in button
4. Check the browser console for any errors

## Important Notes
- Make sure to use `https://` (not `http://`)
- Don't include trailing slashes in URLs
- The `NEXTAUTH_SECRET` should be a strong, random string
- Never commit these secrets to version control 
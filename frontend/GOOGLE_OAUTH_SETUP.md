# Google OAuth Setup Guide for Production

## Environment Variables Required

You need to set these environment variables in your production deployment (Vercel, Netlify, etc.):

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret_here

# Backend URLs
BACKEND_URL=https://emergency-alert-system-bffp.onrender.com/api/v1
WS_URL=wss://emergency-alert-system-bffp.onrender.com
```

## Google Cloud Console Setup

### 1. Create/Configure OAuth 2.0 Client

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client IDs"
5. Choose "Web application" as the application type

### 2. Configure Authorized Redirect URIs

Add these URIs to your Google OAuth client:

**For Development:**
```
http://localhost:3000/api/auth/callback/google
```

**For Production:**
```
https://your-domain.com/api/auth/callback/google
```

**For Vercel (if using Vercel):**
```
https://your-app-name.vercel.app/api/auth/callback/google
```

### 3. Enable Required APIs

Make sure these APIs are enabled in your Google Cloud project:
- Google+ API
- Google Identity API

## Common Issues and Solutions

### Issue 1: "redirect_uri_mismatch" Error
**Solution:** Make sure your production domain is added to the authorized redirect URIs in Google Cloud Console.

### Issue 2: "invalid_client" Error
**Solution:** Check that your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct and match your Google Cloud Console configuration.

### Issue 3: "access_denied" Error
**Solution:** Ensure your Google Cloud project has the necessary APIs enabled and is not in testing mode.

### Issue 4: Environment Variables Not Loading
**Solution:** 
- For Vercel: Add environment variables in the Vercel dashboard under Project Settings > Environment Variables
- For Netlify: Add environment variables in the Netlify dashboard under Site Settings > Environment Variables
- For other platforms: Check their documentation for environment variable configuration

## Testing the Setup

1. **Development Testing:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000/login` and try Google sign-in

2. **Production Testing:**
   - Deploy your changes
   - Visit your production URL and try Google sign-in
   - Check the browser console and server logs for any errors

## Debugging

If Google OAuth is still not working:

1. **Check Environment Variables:**
   ```javascript
   console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
   console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
   ```

2. **Enable NextAuth Debug Mode:**
   Set `NODE_ENV=development` temporarily to see detailed logs

3. **Check Network Tab:**
   Look for failed requests to Google OAuth endpoints

4. **Verify Redirect URIs:**
   Make sure the exact URL (including protocol and port) is in your Google Cloud Console

## Security Notes

- Never commit your `GOOGLE_CLIENT_SECRET` to version control
- Use strong, unique secrets for `NEXTAUTH_SECRET`
- Regularly rotate your secrets
- Use HTTPS in production (required by Google OAuth)

## Example .env.local (Development)

```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_development_secret_here
BACKEND_URL=https://emergency-alert-system-bffp.onrender.com/api/v1
WS_URL=wss://emergency-alert-system-bffp.onrender.com
``` 
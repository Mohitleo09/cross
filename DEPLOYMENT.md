# Deployment Guide for Vercel

Follow these steps to deploy your Crossposting application to Vercel (recommended) or any other hosting provider.

## 1. Prerequisites

- **GitHub Repository**: Ensure your code is pushed to a GitHub repository.
- **Vercel Account**: Sign up at [vercel.com](https://vercel.com).
- **Environment Variables**: Have your API keys ready (Instagram, YouTube, Twitter, MongoDB).

## 2. Prepare the Codebase

1. **Delete Custom Server Files**:
   Since Vercel handles HTTPS automatically, delete these files:
   - `server.js`
   - `certificates/` folder (if it exists)

2. **Verify `package.json`**:
   Ensure your scripts are standard Next.js (we already updated this for you):
   ```json
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "next start",
     "lint": "next lint"
   }
   ```

## 3. Deploy to Vercel

1. **Import Project**:
   - Go to your Vercel Dashboard.
   - Click **"Add New..."** -> **"Project"**.
   - Select your GitHub repository.

2. **Configure Environment Variables**:
   Add the following variables in the **"Environment Variables"** section. Use the values from your local `.env`.

   | Variable Name | Value Description |
   |--------------|-------------------|
   | `MONGODB_URI` | Your MongoDB connection string |
   | `JWT_SECRET` | A secure random string (at least 32 chars) |
   | `ENCRYPTION_KEY` | Any random string (will be hashed automatically) |
   | `NEXT_PUBLIC_BASE_URL` | Your production URL (e.g., `https://your-app.vercel.app`) |
   | `INSTAGRAM_CLIENT_ID` | Your Meta App ID |
   | `INSTAGRAM_CLIENT_SECRET` | Your Meta App Secret |
   | `INSTAGRAM_REDIRECT_URI` | `https://your-app.vercel.app/api/oauth/instagram/callback` |
   | `YOUTUBE_CLIENT_ID` | Your Google Client ID |
   | `YOUTUBE_CLIENT_SECRET` | Your Google Client Secret |
   | `YOUTUBE_REDIRECT_URI` | `https://your-app.vercel.app/api/oauth/youtube/callback` |
   | `TWITTER_CLIENT_ID` | Your Twitter Client ID |
   | `TWITTER_CLIENT_SECRET` | Your Twitter Client Secret |
   | `TWITTER_REDIRECT_URI` | `https://your-app.vercel.app/api/oauth/twitter/callback` |

   > **Important:** Update your redirect URIs in the developer consoles (Meta, Google, Twitter) to match your new Vercel URL!

3. **Deploy**:
   - Click **"Deploy"**.
   - Wait for the build to finish.

## 4. Post-Deployment Setup

1. **Update Redirect URIs**:
   - Go to **Meta for Developers** -> Instagram Login -> Settings -> Valid OAuth Redirect URIs. Add your new Vercel URI.
   - Go to **Google Cloud Console** -> Credentials -> OAuth 2.0 Client IDs. Add your new Vercel URI.
   - Go to **Twitter Developer Portal** -> User Authentication Settings. Add your new Vercel URI.

2. **Test Connection**:
   - Open your deployed app.
   - Go to Dashboard -> Connect.
   - Try connecting your accounts again.

## Troubleshooting

- **500 Errors on Video Generation**: Since Vercel has limited function size (50MB), video generation using `ffmpeg-static` might fail. If this happens, you may need to use a separate service for video processing or a lighter implementation.
- **Redirect Mismatch**: Double-check that `NEXT_PUBLIC_BASE_URL` exactly matches your Vercel URL (no trailing slash).

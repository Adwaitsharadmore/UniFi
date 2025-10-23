# Vercel Deployment Guide

This guide will help you deploy your UNIFI Financial OS dashboard to Vercel and fix the Supabase environment variable issues.

## Quick Fix for Current Deployment Error

The error you're seeing is because Supabase environment variables are missing during the build process. Here's how to fix it:

### 1. Set Up Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Navigate to your project
3. Go to **Settings** → **Environment Variables**
4. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (use this for `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (use this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 3. Redeploy

After adding the environment variables, trigger a new deployment by:
- Pushing a new commit to your repository, OR
- Going to **Deployments** tab in Vercel and clicking **Redeploy**

## Complete Setup Guide

### Prerequisites

- A Supabase account and project
- Your code pushed to GitHub
- A Vercel account

### Step 1: Create Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `unifi-financial-os` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be ready (usually takes 1-2 minutes)

### Step 2: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Click on **Email** in the providers list
3. Ensure **Enable email confirmations** is enabled (recommended for security)

### Step 3: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `lib/database-schema.sql` from this project
4. Click **Run** to execute the schema

### Step 4: Configure Environment Variables

#### For Local Development

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

#### For Vercel Deployment

1. In your Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add these variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (optional) | Production, Preview, Development |

### Step 5: Configure Redirect URLs

1. In your Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your Vercel domain: `https://your-app.vercel.app`
3. Add **Redirect URLs**:
   - `https://your-app.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

### Step 6: Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect it's a Next.js project
4. Make sure environment variables are set (from Step 4)
5. Deploy your application

## Troubleshooting

### Build Errors

If you're still getting build errors:

1. **Check Environment Variables**: Ensure all required environment variables are set in Vercel
2. **Redeploy**: After adding environment variables, trigger a new deployment
3. **Check Supabase Project**: Ensure your Supabase project is active and accessible

### Authentication Issues

1. **Redirect URLs**: Make sure your Vercel domain is added to Supabase redirect URLs
2. **Email Confirmation**: Check if email confirmation is required in Supabase settings
3. **HTTPS**: Ensure your Vercel deployment is using HTTPS

### Database Issues

1. **Schema**: Ensure you've run the database schema in Supabase
2. **RLS Policies**: Check that Row Level Security policies are correctly set up
3. **Permissions**: Verify that your anon key has the correct permissions

## Environment Variables Reference

### Required Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Optional Variables

- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for server-side operations)

### Getting These Values

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the values from the **Project API keys** section

## Security Notes

- Never expose your service role key in client-side code
- The service role key has admin privileges - keep it secure
- Use Row Level Security (RLS) to protect user data
- Regularly rotate your API keys

## Next Steps

After successful deployment:

1. Test user authentication
2. Verify database operations
3. Set up monitoring and alerts
4. Configure custom domains (if needed)
5. Set up CI/CD for automated deployments

Your UNIFI Financial OS dashboard should now be successfully deployed on Vercel!

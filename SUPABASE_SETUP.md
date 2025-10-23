# Supabase Setup Instructions

This document provides step-by-step instructions to set up Supabase authentication and database for the UNIFI Financial OS dashboard.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and pnpm installed

## 1. Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `unifi-financial-os` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be ready (usually takes 1-2 minutes)

## 2. Configure Authentication

### Enable Email Authentication

1. In your Supabase dashboard, go to **Authentication** > **Providers**
2. Click on **Email** in the providers list
3. Ensure **Enable email confirmations** is enabled (recommended for security)
4. Optionally configure **Email confirmation settings**:
   - Set custom email templates
   - Configure redirect URLs for email confirmation

### Configure Email Settings (Optional)

1. In **Authentication** > **Email Templates**
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link
   - Email change

### Configure Site URL

1. In **Authentication** > **URL Configuration**
2. Set **Site URL** to your production domain (e.g., `https://yourdomain.com`)
3. Add **Redirect URLs** (if using email confirmation):
   - `https://yourdomain.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

## 3. Set Up Database Schema

**Important:** Due to Supabase's security model, you cannot modify the `auth.users` table directly. The corrected schema has been split into multiple files for easier execution.

### Option A: Run All at Once (Recommended)
1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `lib/database-schema.sql` from this project
4. Click **Run** to execute the schema

### Option B: Run Step by Step (If you encounter errors)
If you get permission errors, run the schema in separate steps:

1. **Create Tables:**
   - Run the contents of `lib/database-schema-tables.sql`
   
2. **Create Policies:**
   - Run the contents of `lib/database-schema-policies.sql`
   
3. **Create Functions and Triggers:**
   - Run the contents of `lib/database-schema-functions.sql`

This will create:
- `profiles` table for user information
- `user_goals` table for financial goals
- `transactions` table for financial transactions
- `user_achievements` table for gamification achievements
- `user_stats` table for user statistics
- Row Level Security (RLS) policies
- Triggers for automatic profile creation and timestamp updates

## 4. Configure Environment Variables

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-ref.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

3. Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important:** Never commit the `.env.local` file to version control!

## 5. Test the Setup

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `http://localhost:3000`
3. You should be redirected to the login page
4. Try signing in with one of the configured OAuth providers
5. After successful authentication, you should be redirected to the dashboard

## 6. Production Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variables in Vercel dashboard:
   - Go to your project settings
   - Navigate to **Environment Variables**
   - Add the same variables from your `.env.local` file
4. Update your Supabase redirect URLs to include your production domain
5. Deploy your application

### Other Platforms

For other deployment platforms, make sure to:
1. Set the environment variables in your platform's configuration
2. Update the redirect URLs in Supabase to match your production domain
3. Ensure HTTPS is enabled (required for OAuth)

## 7. Database Management

### Viewing Data

- Use the Supabase dashboard **Table Editor** to view and manage your data
- All tables will have Row Level Security enabled, so users can only access their own data

### Backup

- Supabase automatically backs up your database
- You can also create manual backups from the **Database** > **Backups** section

### Monitoring

- Monitor your project usage in the **Settings** > **Usage** section
- Set up alerts for important metrics

## Troubleshooting

### Common Issues

1. **"must be owner of table users" error**
   - This happens when trying to modify Supabase's `auth.users` table
   - The `auth.users` table is managed by Supabase and cannot be modified directly
   - Use the corrected schema that removes the problematic `ALTER TABLE auth.users` statement
   - The `auth.users` table already has RLS enabled by default

2. **"Invalid redirect URL" error**
   - Make sure your redirect URLs are correctly configured in Supabase
   - Check that your site URL matches your actual domain

3. **"Email confirmation required" error**
   - Check your email for a confirmation link
   - Verify that email confirmations are enabled in Supabase settings
   - Check spam folder if you don't see the confirmation email

4. **Database permission errors**
   - Ensure Row Level Security policies are correctly set up
   - Check that users are authenticated before accessing protected data

5. **Environment variables not loading**
   - Restart your development server after adding environment variables
   - Make sure the variable names match exactly (including the `NEXT_PUBLIC_` prefix)

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Join the [Supabase Discord community](https://discord.supabase.com/)
- Review the [Next.js Supabase integration guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## Security Best Practices

1. **Never expose your service role key** in client-side code
2. **Use Row Level Security** to protect user data
3. **Regularly rotate your API keys**
4. **Monitor your project usage** and set up alerts
5. **Keep your dependencies updated**
6. **Use HTTPS in production**

## Next Steps

Once your Supabase setup is complete, you can:

1. Customize the user onboarding flow
2. Add more OAuth providers
3. Implement additional database features
4. Set up real-time subscriptions
5. Add email notifications
6. Implement advanced security features

Your UNIFI Financial OS dashboard is now ready with full authentication and database functionality!

# JoMich Academic Commissions - Deployment Guide

This guide explains how to deploy the React frontend to Netlify and completely migrate the backend to Supabase (Database, Storage, Auth).

## 1. Supabase Setup

### Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and sign up/log in.
2. Click **New Project** and select an organization.
3. Give it a name (e.g., `jomich-web`) and generate a strong database password.
4. Select a region close to your target audience.
5. Wait for the project to provision.

### Set up Database Schema
1. In your Supabase dashboard, go to the **SQL Editor** (the `< / >` icon on the left).
2. Click **New query**.
3. Paste the following SQL code and click **Run**:

```sql
-- 1. Create proof_transactions table
CREATE TABLE proof_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    caption TEXT,
    image_url TEXT,
    image_path TEXT,
    transaction_date TIMESTAMPTZ DEFAULT now(),
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create client_reviews table
CREATE TABLE client_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    review_message TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
    screenshot_url TEXT,
    screenshot_path TEXT,
    review_date TIMESTAMPTZ DEFAULT now(),
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Row Level Security (RLS) setup
-- Enable RLS
ALTER TABLE proof_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to visible proofs
CREATE POLICY "Public can view visible proofs" 
ON proof_transactions FOR SELECT 
USING (is_visible = true);

-- Allow public read access to published reviews
CREATE POLICY "Public can view published reviews" 
ON client_reviews FOR SELECT 
USING (status = 'published' AND is_visible = true);

-- Allow public to INSERT new reviews (they default to 'draft' automatically)
CREATE POLICY "Public can insert reviews" 
ON client_reviews FOR INSERT 
WITH CHECK (true);

-- Allow authenticated admins to do everything
CREATE POLICY "Admins have full access to proofs" 
ON proof_transactions FOR ALL 
USING (auth.role() = 'authenticated');

CREATE POLICY "Admins have full access to reviews" 
ON client_reviews FOR ALL 
USING (auth.role() = 'authenticated');
```

### Set up Storage Buckets
1. In the Supabase dashboard, go to **Storage**.
2. Create a new bucket named `proofs`.
   - Make it **Public**.
3. Create another bucket named `reviews`.
   - Make it **Public**.
4. To allow uploading, we need Storage RLS policies. Go to **Storage -> Policies**.
5. For both `proofs` and `reviews` buckets, create a policy:
   - Allow **SELECT** for everyone (public access).
   - Allow **INSERT, UPDATE, DELETE** only for **authenticated** users.

### Create the Admin User
1. Since you don't have a specific admin email, let's create a generic one.
2. In Supabase, go to **Authentication -> Users**.
3. Click **Add User** -> **Create New User**.
4. Enter an email (e.g., `admin@jomich.com`) and a strong password.
5. Uncheck "Auto Confirm User?" so the account is instantly confirmed, or toggle the "Confirm Email" setting in Auth Settings off. You will use these credentials to log into `/admin`.

---

## 2. Frontend Configuration & Netlify Deployment

### Get your Environment Variables
1. In Supabase, go to **Project Settings** (the gear icon) -> **API**.
2. Copy the `Project URL`. This is your `VITE_SUPABASE_URL`.
3. Copy the `anon` `public` key. This is your `VITE_SUPABASE_ANON_KEY`.

### Deploy to Netlify
1. Log into [Netlify](https://www.netlify.com/).
2. Click **Add new site** -> **Import an existing project**.
3. Connect your GitHub repository containing the React frontend.
4. In the **Build settings**:
   - **Base directory**: `frontend/` (if your package.json is in the frontend folder)
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Click **Show advanced** to add Environment Variables. Add:
   - `VITE_SUPABASE_URL` = (Your Supabase URL)
   - `VITE_SUPABASE_ANON_KEY` = (Your Supabase Anon Key)
6. Click **Deploy site**.

### Post-Deployment Testing
1. Visit your Netlify URL. The public site should load with empty states ("Proof records are being prepared...").
2. Submit a review using the public form. Check if it says success.
3. Manually navigate to `https://your-site.netlify.app/admin`.
4. Log in using `admin@jomich.com` and the password you set in Supabase.
5. Go to Reviews and see the draft review you submitted.
6. Toggle the status to "PUBLISHED" and check the public landing page.
7. Upload a new Proof transaction image, verify it displays on the public page.

Congratulations! Your project is fully serverless and hosted for free!

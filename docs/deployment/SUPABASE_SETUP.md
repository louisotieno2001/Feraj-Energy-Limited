# Supabase Setup Guide
**Project**: Feraj Solar Limited Website  
**Date**: January 22, 2026

---

## Quick Start

### 1. Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Project Name**: Feraj Solar Limited
   - **Database Password**: (generate a strong password and save it)
   - **Region**: Choose closest to Kenya (e.g., eu-west-2 or ap-southeast-1)
   - **Pricing Plan**: Free tier is sufficient for development
4. Click "Create new project" and wait ~2 minutes for setup

### 2. Get API Credentials

Once your project is created:

1. Go to **Project Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

### 3. Configure Environment Variables

Update your `.env.local` file with your credentials:

```bash
# Replace with your actual Supabase credentials
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important**: Never commit `.env.local` to Git (it's already in `.gitignore`)

### 4. Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Create a new query and paste the schema from below
3. Click "Run" to execute

---

## Database Schema

Copy this SQL and run it in Supabase SQL Editor:

```sql
-- ============================================
-- FERAJ SOLAR LIMITED - DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'installer')),
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PRODUCTS TABLE
-- ============================================

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('panels', 'inverters', 'batteries', 'accessories')),
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  specifications JSONB,
  images TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can view active products
CREATE POLICY "Active products are viewable by everyone"
  ON public.products FOR SELECT
  USING (is_active = true);

-- Only admins can manage products
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- ORDERS TABLE
-- ============================================

CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Authenticated users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update orders
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Users can view items of their own orders
CREATE POLICY "Users can view own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

-- Users can insert order items for their orders
CREATE POLICY "Users can insert own order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

-- ============================================
-- INSTALLATION REQUESTS TABLE
-- ============================================

CREATE TABLE public.installation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('residential', 'commercial', 'industrial')),
  address JSONB NOT NULL,
  system_size TEXT,
  preferred_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  assigned_installer_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.installation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests"
  ON public.installation_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create requests"
  ON public.installation_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and installers can view requests"
  ON public.installation_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'installer')
    )
  );

-- ============================================
-- SUPPORT TICKETS TABLE
-- ============================================

CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets"
  ON public.support_tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets"
  ON public.support_tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- PERFORMANCE INDEXES
-- ============================================

CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_is_active ON public.products(is_active);
CREATE INDEX idx_installation_requests_user_id ON public.installation_requests(user_id);
CREATE INDEX idx_installation_requests_status ON public.installation_requests(status);
CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables that have it
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_products
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_orders
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_installation_requests
  BEFORE UPDATE ON public.installation_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_support_tickets
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

## 5. Configure Authentication Settings

In Supabase dashboard:

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Go to **Authentication** → **URL Configuration**
4. Set **Site URL**: `http://localhost:5173` (for development)
5. Add **Redirect URLs**:
   - `http://localhost:5173/reset-password`
   - `http://localhost:5173/auth/callback`
   - `https://feraj-solar.netlify.app/reset-password` (for production)
   - `https://feraj-solar.netlify.app/auth/callback` (for production)

### Email Templates

Go to **Authentication** → **Email Templates** and customize:

- **Confirm signup**: Welcome email with verification link
- **Reset password**: Password reset instructions
- **Magic Link**: For passwordless login (future)

---

## 6. Test Your Setup

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Go to [http://localhost:5173/login](http://localhost:5173/login)

3. Create a test account:
   - Click "Sign Up"
   - Enter email, password, and name
   - Check your email for verification link
   - Click the link to verify
   - Return to login page and sign in

4. Test authentication:
   - You should be logged in and redirected to `/products`
   - Your name should appear in the navbar
   - Click "Logout" to sign out

---

## 7. Create Admin User

To make a user an admin:

1. Go to Supabase **SQL Editor**
2. Run this query (replace with your user's email):
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'your-email@example.com';
   ```

---

## 8. Production Deployment (Netlify)

Add these environment variables in Netlify dashboard:

1. Go to your Netlify site → **Site settings** → **Environment variables**
2. Add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

3. Update Supabase URL Configuration:
   - Go to Supabase **Authentication** → **URL Configuration**
   - Set **Site URL** to your Netlify domain
   - Update redirect URLs with your Netlify domain

---

## Troubleshooting

### "Missing Supabase environment variables"

- Make sure `.env.local` exists and has correct values
- Restart dev server after changing `.env.local`

### "Email not confirmed"

- Check your email inbox (and spam folder)
- Resend verification email from Supabase dashboard → **Authentication** → **Users** → Click user → "Send Verification Email"

### "Invalid login credentials"

- Ensure you've verified your email
- Check that password meets requirements (8+ chars, uppercase, lowercase, number, special char)

### "Cannot read properties of undefined"

- Ensure database schema has been run
- Check that the `handle_new_user()` trigger is created
- Verify profile was created in `profiles` table

---

## Next Steps

1. ✅ Set up Supabase project
2. ✅ Run database migrations
3. ✅ Configure authentication
4. ✅ Test signup/login flow
5. ✅ Add sample products to database
6. ✅ Configure admin access
7. ⏳ Implement orders functionality
8. ⏳ Deploy to production

---

## Quick Start SQL Scripts

### Populate Products Database
Run [`EMERGENCY_DIAGNOSTIC.sql`](./EMERGENCY_DIAGNOSTIC.sql) to:
- Check if products exist
- Verify RLS policies are working
- Test public access (anon role)
- Insert 6 sample products if needed

### Create Admin User
Run [`MAKE_ADMIN.sql`](./MAKE_ADMIN.sql) to:
- Promote a user to admin role
- Verify admin access granted
- [Project Repository](https://github.com/onyangojerry/Feraj-Energy-Limited)

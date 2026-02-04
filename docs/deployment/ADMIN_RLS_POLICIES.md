# Admin Features - Required Supabase RLS Policies

## Status Update (February 4, 2026)
- Roles now supported: admin, co_admin, employee, customer (installer replaced by employee).
- Staff access: admin/co_admin/employee can access /admin; user management limited to admin/co_admin.
- Co-admins cannot change admin/co_admin roles; they can manage employee/customer roles.
- Per-user permissions added: can_manage_products, can_manage_tickets, can_promote_to_co_admin (admin-only).
- Audit & monitoring: /admin/audit shows activity feed + ticket queue; profile sensitive edits, role/permission changes, and product CRUD are logged.
- Product images: URL or device upload, max 4 images, 2MB per image, primary image = first.
- Environment files (.env, .env.local, etc.) must never be committed; use host env vars.
- Linting: Prettier applied; ESLint passes with warnings only (mostly any/fast-refresh).

This document outlines the Row Level Security (RLS) policies that need to be added to your Supabase database to support the admin features.

**Note**: This file is legacy (admin-only). For the current staff/permission model (admin/co_admin/employee), use `docs/deployment/ACCESS_CONTROL_SETUP.sql`.

## Prerequisites

Before adding these policies, ensure you have:
1. Logged into your Supabase project dashboard
2. Navigated to SQL Editor
3. Verified that RLS is enabled on the `profiles` and `products` tables

## Policy 1: Admins Can View All Profiles

**Purpose:** Allow admin users to view all user profiles in the system.

```sql
-- Enable RLS on profiles table (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);
```

## Policy 2: Admins Can Update User Roles

**Purpose:** Allow admin users to update the role of any user profile.

```sql
-- Policy: Admins can update any profile
CREATE POLICY "Admins can update any profile"
ON profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);
```

## Policy 3: Users Can View Their Own Profile

**Purpose:** Allow regular users to view their own profile information.

```sql
-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);
```

## Policy 4: Users Can Update Their Own Profile

**Purpose:** Allow regular users to update their own profile (but not their role).

```sql
-- Policy: Users can update own profile (excluding role)
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  role = (SELECT role FROM profiles WHERE id = auth.uid())
);
```

## Policy 5: Admins Can Manage All Products

**Purpose:** Allow admin users to create, read, update, and delete products.

```sql
-- Enable RLS on products table (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all products
CREATE POLICY "Admins can view all products"
ON products
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Policy: Admins can insert products
CREATE POLICY "Admins can insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Policy: Admins can update products
CREATE POLICY "Admins can update products"
ON products
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Policy: Admins can delete products
CREATE POLICY "Admins can delete products"
ON products
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);
```

## Policy 6: Public Can View Active Products

**Purpose:** Allow anyone (including unauthenticated users) to view active products on the website.

```sql
-- Policy: Anyone can view active products
CREATE POLICY "Anyone can view active products"
ON products
FOR SELECT
TO public
USING (is_active = true);
```

## Complete SQL Script

Here's the complete script you can run in one go:

```sql
-- =====================================================
-- PROFILES TABLE POLICIES
-- =====================================================

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (optional, be careful!)
-- DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
-- DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
-- DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
-- DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Admins can update any profile
CREATE POLICY "Admins can update any profile"
ON profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Users can update their own profile (excluding role)
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  role = (SELECT role FROM profiles WHERE id = auth.uid())
);

-- =====================================================
-- PRODUCTS TABLE POLICIES
-- =====================================================

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (optional, be careful!)
-- DROP POLICY IF EXISTS "Admins can view all products" ON products;
-- DROP POLICY IF EXISTS "Admins can insert products" ON products;
-- DROP POLICY IF EXISTS "Admins can update products" ON products;
-- DROP POLICY IF EXISTS "Admins can delete products" ON products;
-- DROP POLICY IF EXISTS "Anyone can view active products" ON products;

-- Admins can view all products (including inactive)
CREATE POLICY "Admins can view all products"
ON products
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Admins can insert products
CREATE POLICY "Admins can insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Admins can update products
CREATE POLICY "Admins can update products"
ON products
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Admins can delete products
CREATE POLICY "Admins can delete products"
ON products
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Anyone can view active products (public access for website)
CREATE POLICY "Anyone can view active products"
ON products
FOR SELECT
TO public
USING (is_active = true);
```

## How to Apply These Policies

1. **Log into Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your `ferajsite` project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Paste and Execute**
   - Copy the "Complete SQL Script" section above
   - Paste it into the SQL editor
   - Click "Run" to execute

4. **Verify Policies**
   - Navigate to "Authentication" → "Policies" in the dashboard
   - Check that policies appear for both `profiles` and `products` tables
   - Verify that each policy shows the correct permissions

## Testing the Policies

After applying the policies, test them:

1. **Test as Admin:**
   - Log in with an admin account
   - Navigate to `/admin/users` - should see all users
   - Navigate to `/admin/products` - should see all products
   - Try creating/editing/deleting a product - should work

2. **Test as Regular User:**
   - Log in with a customer account
   - Try accessing `/admin/*` - should be redirected
   - Visit `/products` - should only see active products
   - Visit `/profile` - should only see own profile

3. **Test as Public (Not Logged In):**
   - Visit `/products` - should see active products
   - Try accessing `/admin/*` - should be redirected to login

## Troubleshooting

### Issue: "Permission denied" when admin tries to manage products

**Solution:** Ensure the user's role is set to `'admin'` in the profiles table:

```sql
-- Check user's role
SELECT id, email, role FROM profiles WHERE email = 'your-admin@example.com';

-- Update role to admin if needed
UPDATE profiles SET role = 'admin' WHERE email = 'your-admin@example.com';
```

### Issue: Policies not applying

**Solution:** Check if RLS is enabled:

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('profiles', 'products');

-- Enable RLS if disabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
```

### Issue: Duplicate policy errors

**Solution:** Drop existing policies first:

```sql
-- List all policies
SELECT policyname, tablename FROM pg_policies WHERE tablename IN ('profiles', 'products');

-- Drop specific policy
DROP POLICY "policy_name" ON table_name;
```

## Security Considerations

1. **Admin Role Protection:** The policies ensure only users with `role = 'admin'` can perform admin actions
2. **Self-Service Prevention:** Regular users cannot elevate their own role due to the WITH CHECK clause
3. **Public Access:** Only active products are visible to non-authenticated users
4. **Profile Privacy:** Users can only view and edit their own profiles (admins can view/edit all)

## Next Steps

After applying these policies:

1. ✅ Run the complete SQL script in Supabase SQL Editor
2. ✅ Verify policies in the Authentication → Policies section
3. ✅ Test admin features with an admin account
4. ✅ Test that regular users cannot access admin features
5. ✅ Document any admin user credentials securely

## Reference

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Policy Documentation](https://www.postgresql.org/docs/current/sql-createpolicy.html)

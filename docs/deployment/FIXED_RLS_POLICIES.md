# Fixed RLS Policies - No Infinite Recursion

**Issue Resolved**: Infinite recursion in profiles table policies

The original policies had circular dependency: checking `profiles.role` while protecting `profiles` table.

---

## Solution: Security Definer Function

Create a function that bypasses RLS to check user roles:

```sql
-- =====================================================
-- STEP 1: Create Helper Function (Bypasses RLS)
-- =====================================================

-- Drop function if exists
DROP FUNCTION IF EXISTS public.is_admin();

-- Create function to check if user is admin (SECURITY DEFINER bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- =====================================================
-- STEP 2: Drop All Existing Policies (Clean Slate)
-- =====================================================

-- Drop profiles policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Drop products policies
DROP POLICY IF EXISTS "Admins can view all products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Anyone can view active products" ON products;

-- =====================================================
-- STEP 3: Enable RLS on Tables
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 4: PROFILES TABLE POLICIES (Using Helper Function)
-- =====================================================

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (is_admin());

-- Policy 3: Users can update their own profile (but not role)
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  (role IS NULL OR role = (SELECT role FROM profiles WHERE id = auth.uid()))
);

-- Policy 4: Admins can update any profile
CREATE POLICY "Admins can update any profile"
ON profiles
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- =====================================================
-- STEP 5: PRODUCTS TABLE POLICIES (Using Helper Function)
-- =====================================================

-- Policy 1: Anyone can view active products (PUBLIC ACCESS - CRITICAL!)
CREATE POLICY "Anyone can view active products"
ON products
FOR SELECT
TO public
USING (is_active = true);

-- Policy 2: Admins can view all products (including inactive)
CREATE POLICY "Admins can view all products"
ON products
FOR SELECT
TO authenticated
USING (is_admin());

-- Policy 3: Admins can insert products
CREATE POLICY "Admins can insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

-- Policy 4: Admins can update products
CREATE POLICY "Admins can update products"
ON products
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Policy 5: Admins can delete products
CREATE POLICY "Admins can delete products"
ON products
FOR DELETE
TO authenticated
USING (is_admin());

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check function exists
SELECT routine_name, security_type 
FROM information_schema.routines 
WHERE routine_name = 'is_admin';

-- Check policies created
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'products')
ORDER BY tablename, policyname;

-- Test the function (should return true if you're admin)
SELECT is_admin();
```

---

## What Changed?

### Problem:
Original policies had this:
```sql
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'  -- ❌ Queries profiles while protecting profiles!
  )
)
```

### Solution:
New policies use a helper function:
```sql
USING (is_admin())  -- ✅ Function bypasses RLS with SECURITY DEFINER
```

The `is_admin()` function:
- Uses `SECURITY DEFINER` to bypass RLS
- Safely checks if current user is admin
- No infinite recursion!

---

## Apply These Fixed Policies

1. **Open Supabase SQL Editor**
2. **Copy the entire SQL script above**
3. **Paste and Run**
4. **Verify** - Should see "Success" messages

---

## Test After Applying

1. **Public Products Access:**
```sql
-- Set role to anon (simulates unauthenticated user)
SET ROLE anon;
SELECT id, name FROM products WHERE is_active = true;
RESET ROLE;
-- Should work! ✅
```

2. **Admin Access:**
```sql
-- Test if you're recognized as admin
SELECT is_admin();
-- Should return true if your role = 'admin' ✅
```

3. **Website:**
- Go to http://localhost:5175/products
- Should load products without errors ✅
- Console should be clear ✅

---

## Why This Works

**SECURITY DEFINER** means the function runs with the permissions of the function creator (the superuser), not the current user. This allows it to:
1. Read the profiles table
2. Check the role
3. Return true/false
4. Without triggering RLS policies

The function is safe because:
- It only returns boolean (true/false)
- It only checks the current user's role
- It doesn't expose other users' data
- It's a read-only check

---

## Troubleshooting

If you still get errors:

**Error: "function is_admin() does not exist"**
- Make sure Step 1 ran successfully
- Check function exists: `SELECT * FROM pg_proc WHERE proname = 'is_admin';`

**Error: "infinite recursion"**
- Make sure old policies are dropped (Step 2)
- Verify using helper function, not subquery

**Products still not loading:**
- Check RLS policies exist: `SELECT * FROM pg_policies WHERE tablename = 'products';`
- Verify "Anyone can view active products" policy exists for public access

---

**Run this fixed SQL now and products should load!** 🚀

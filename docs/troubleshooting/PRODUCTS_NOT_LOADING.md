# Products Not Loading - Troubleshooting Guide

## Status Update (February 4, 2026)
- Roles now supported: admin, co_admin, employee, customer (installer replaced by employee).
- Staff access: admin/co_admin/employee can access /admin; user management limited to admin/co_admin.
- Co-admins cannot change admin/co_admin roles; they can manage employee/customer roles.
- Per-user permissions added: can_manage_products, can_manage_tickets, can_promote_to_co_admin (admin-only).
- Audit & monitoring: /admin/audit shows activity feed + ticket queue; profile sensitive edits, role/permission changes, and product CRUD are logged.
- Product images: URL or device upload, max 4 images, 2MB per image, primary image = first.
- Environment files (.env, .env.local, etc.) must never be committed; use host env vars.
- Linting: Prettier applied; ESLint passes with warnings only (mostly any/fast-refresh).

**Issue**: Products page shows loading spinner forever or shows "Failed to load products"

---

## Quick Diagnosis

Run these SQL queries in Supabase SQL Editor to diagnose the issue:

### Step 1: Check if products table exists and has data

```sql
-- Check if products table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'products';

-- Count products in table
SELECT COUNT(*) as total_products FROM products;

-- View all products
SELECT id, name, category, price, is_active FROM products;
```

**Expected Results**:
- Table exists: ✅ Should return 1 row
- Total products: ✅ Should show 6 or more
- Products visible: ✅ Should list all products

**If table doesn't exist or is empty** → Go to Fix #1

---

### Step 2: Check RLS policies on products table

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'products';

-- List all policies on products table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'products';
```

**Expected Results**:
- RLS enabled: ✅ `rowsecurity` should be `true`
- Policies count: ✅ Should include:
  - "Staff can view all products" (admin/co_admin/employee with permission)
  - "Staff can insert products"
  - "Staff can update products"
  - "Staff can delete products"
  - "Anyone can view active products"

**If RLS not enabled or policies missing** → Go to Fix #2

---

### Step 3: Test public access to products

```sql
-- This simulates what the website does (public access)
-- Set role to anon (unauthenticated user)
SET ROLE anon;

-- Try to fetch active products (what getProducts() does)
SELECT id, name, category, price, is_active 
FROM products 
WHERE is_active = true;

-- Reset role
RESET ROLE;
```

**Expected Results**:
- ✅ Should return all active products
- ✅ Should NOT show error

**If returns error or no rows** → RLS policy issue, go to Fix #2

---

### Step 4: Check Supabase connection

Open browser console (F12) on http://localhost:5175/products and look for errors:

**Common errors**:
- `relation "products" does not exist` → Table not created (Fix #1)
- `permission denied for table products` → RLS policy missing (Fix #2)
- `Failed to fetch` → Supabase URL/key issue (Fix #3)
- Network error → Check internet connection

---

## Fixes

### Fix #1: Create Products Table and Add Data

If products table doesn't exist or is empty, run this SQL:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('panels', 'inverters', 'batteries', 'accessories')),
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  specifications TEXT[],
  images TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- Insert sample products
INSERT INTO public.products (name, description, category, price, stock_quantity, specifications, images, is_active)
VALUES
  (
    'SolarMax Pro 400W Panel',
    'High-efficiency monocrystalline solar panel with 22% efficiency rating',
    'panels',
    29900.00,
    25,
    ARRAY['400W Output', '22% Efficiency', '25 Year Warranty', 'Weather Resistant'],
    ARRAY['https://images.unsplash.com/photo-1545209575-704d1434f9cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGVuZXJneXxlbnwxfHx8fDE3Njg4ODkxNzV8MA&ixlib=rb-4.1.0&q=80&w=400'],
    true
  ),
  (
    'EcoPower 5kW Inverter',
    'Advanced solar inverter with smart grid connectivity',
    'inverters',
    149900.00,
    15,
    ARRAY['5kW Capacity', 'MPPT Technology', '98% Efficiency', 'Wi-Fi Monitoring'],
    ARRAY['https://images.unsplash.com/photo-1487875961445-47a00398c267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY4OTI2MzYwfDA&ixlib=rb-4.1.0&q=80&w=400'],
    true
  ),
  (
    'PowerBank Home Battery 10kWh',
    'Residential energy storage system for 24/7 clean power',
    'batteries',
    699900.00,
    8,
    ARRAY['10kWh Capacity', 'Lithium-Ion', '10 Year Warranty', 'Scalable System'],
    ARRAY['https://images.unsplash.com/photo-1594373237925-5c674eda43b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGVuZXJneSUyMHJlbmV3YWJsZXxlbnwxfHx8fDE3Njg5NTcwMzh8MA&ixlib=rb-4.1.0&q=80&w=400'],
    true
  ),
  (
    'SmartMount Roof System',
    'Professional-grade mounting solution for residential installations',
    'accessories',
    89900.00,
    30,
    ARRAY['Adjustable Tilt', 'Corrosion Resistant', 'Easy Installation', 'Wind Rated'],
    ARRAY['https://images.unsplash.com/photo-1723177548474-b58ada59986b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBvd2VyJTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc2ODkwODA2Mnww&ixlib=rb-4.1.0&q=80&w=400'],
    true
  ),
  (
    'SolarMax Pro 550W Panel',
    'Premium high-output solar panel for commercial applications',
    'panels',
    44900.00,
    20,
    ARRAY['550W Output', '24% Efficiency', '30 Year Warranty', 'Bifacial Technology'],
    ARRAY['https://images.unsplash.com/photo-1545209575-704d1434f9cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGVuZXJneXxlbnwxfHx8fDE3Njg4ODkxNzV8MA&ixlib=rb-4.1.0&q=80&w=400'],
    true
  ),
  (
    'EcoPower 10kW Inverter',
    'Commercial-grade solar inverter for large installations',
    'inverters',
    279900.00,
    10,
    ARRAY['10kW Capacity', 'Hybrid Ready', '99% Efficiency', 'Remote Monitoring'],
    ARRAY['https://images.unsplash.com/photo-1487875961445-47a00398c267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY4OTI2MzYwfDA&ixlib=rb-4.1.0&q=80&w=400'],
    true
  );

-- Verify
SELECT id, name, category, price FROM products;
```

---

### Fix #2: Apply RLS Policies

If RLS is disabled or policies are missing:

```sql
-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if needed
DROP POLICY IF EXISTS "Admins can view all products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Anyone can view active products" ON products;

-- Staff can view all products (including inactive)
CREATE POLICY "Staff can view all products"
ON products
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Staff can insert products
CREATE POLICY "Staff can insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Staff can update products
CREATE POLICY "Staff can update products"
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

-- Staff can delete products
CREATE POLICY "Staff can delete products"
ON products
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- ⭐ CRITICAL: Anyone can view active products (public access)
CREATE POLICY "Anyone can view active products"
ON products
FOR SELECT
TO public
USING (is_active = true);

-- Verify policies created
SELECT policyname FROM pg_policies WHERE tablename = 'products';
```

**The last policy is CRITICAL for public product display!**

---

### Fix #3: Check Supabase Configuration

Verify your `.env` or environment variables:

1. Check `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

2. Check `.env` file exists with:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Restart dev server after changing `.env`:
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

### Fix #4: Test with Simple Query

Create a test file to verify Supabase connection:

```typescript
// test-supabase.ts
import { supabase } from './src/lib/supabase';

async function testProducts() {
  console.log('Testing Supabase connection...');
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true);
  
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Success! Products:', data);
  }
}

testProducts();
```

Run with: `npx tsx test-supabase.ts`

---

## Common Scenarios

### Scenario 1: "Loading..." Forever
**Cause**: Network request hanging or RLS blocking access  
**Fix**: 
1. Check browser console for errors
2. Check RLS policy "Anyone can view active products" exists
3. Verify Supabase URL is correct

### Scenario 2: "Failed to load products" Error
**Cause**: SQL error or RLS permission denied  
**Fix**:
1. Check browser console for exact error
2. Run diagnostic queries above
3. Apply Fix #1 or Fix #2

### Scenario 3: Empty Products List
**Cause**: No products in database or all inactive  
**Fix**:
1. Run: `SELECT COUNT(*) FROM products WHERE is_active = true;`
2. If 0, run products migration (Fix #1)
3. Check products aren't all inactive

### Scenario 4: Works Locally, Not in Production
**Cause**: Environment variables not set in Netlify  
**Fix**:
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. Redeploy

---

## Verification Checklist

After applying fixes, verify:

- [ ] Products table exists: `SELECT * FROM information_schema.tables WHERE table_name = 'products';`
- [ ] Products have data: `SELECT COUNT(*) FROM products;` (should be ≥ 6)
- [ ] RLS is enabled: Check `pg_tables` query
- [ ] Public policy exists: `SELECT * FROM pg_policies WHERE policyname = 'Anyone can view active products';`
- [ ] All products active: `SELECT id, name, is_active FROM products;`
- [ ] Browser console clear: No red errors
- [ ] Products page loads: http://localhost:5175/products shows products

---

## Still Not Working?

1. **Share the exact error**:
   - Open browser console (F12)
   - Go to /products page
   - Copy the red error message
   - Share the full error text

2. **Share SQL query results**:
   - Run the diagnostic queries
   - Share the output

3. **Check Supabase Dashboard**:
   - Go to Table Editor → products
   - Verify products are there
   - Check is_active column is true

---

**Most Common Issue**: The RLS policy "Anyone can view active products" is missing. Apply Fix #2 to resolve.

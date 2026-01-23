-- Emergency Diagnostic: Check Products and RLS

-- =====================================================
-- STEP 1: Check if products exist
-- =====================================================

SELECT COUNT(*) as total_products FROM products;

SELECT id, name, category, is_active FROM products;

-- =====================================================
-- STEP 2: Check if RLS policies exist
-- =====================================================

SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'products'
ORDER BY policyname;

-- =====================================================
-- STEP 3: Check if helper function exists
-- =====================================================

SELECT routine_name, security_type 
FROM information_schema.routines 
WHERE routine_name = 'is_admin';

-- =====================================================
-- STEP 4: Test public access (critical!)
-- =====================================================

-- This simulates what the website does
SET ROLE anon;
SELECT id, name, is_active FROM products WHERE is_active = true;
RESET ROLE;

-- If above fails, the public policy is not working!

-- =====================================================
-- STEP 5: If products table is empty, insert them
-- =====================================================

-- Only run if COUNT(*) = 0 above
INSERT INTO public.products (name, description, category, price, stock_quantity, specifications, images, is_active)
VALUES
  (
    'SolarMax Pro 400W Panel',
    'High-efficiency monocrystalline solar panel with 22% efficiency rating',
    'panels',
    29900.00,
    25,
    '["400W Output", "22% Efficiency", "25 Year Warranty", "Weather Resistant"]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1545209575-704d1434f9cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGVuZXJneXxlbnwxfHx8fDE3Njg4ODkxNzV8MA&ixlib=rb-4.1.0&q=80&w=400'],
    true
  ),
  (
    'EcoPower 5kW Inverter',
    'Advanced solar inverter with smart grid connectivity',
    'inverters',
    149900.00,
    15,
    '["5kW Capacity", "MPPT Technology", "98% Efficiency", "Wi-Fi Monitoring"]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1487875961445-47a00398c267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY4OTI2MzYwfDA&ixlib=rb-4.1.0&q=80&w=400'],
    true
  ),
  (
    'PowerBank Home Battery 10kWh',
    'Residential energy storage system for 24/7 clean power',
    'batteries',
    699900.00,
    8,
    '["10kWh Capacity", "Lithium-Ion", "10 Year Warranty", "Scalable System"]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1594373237925-5c674eda43b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGVuZXJneSUyMHJlbmV3YWJsZXxlbnwxfHx8fDE3Njg5NTcwMzh8MA&ixlib=rb-4.1.0&q=80&w=400'],
    true
  ),
  (
    'SmartMount Roof System',
    'Professional-grade mounting solution for residential installations',
    'accessories',
    89900.00,
    30,
    '["Adjustable Tilt", "Corrosion Resistant", "Easy Installation", "Wind Rated"]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1723177548474-b58ada59986b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBvd2VyJTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc2ODkwODA2Mnww&ixlib=rb-4.1.0&q=80&w=400'],
    true
  ),
  (
    'SolarMax Pro 550W Panel',
    'Premium high-output solar panel for commercial applications',
    'panels',
    44900.00,
    20,
    '["550W Output", "24% Efficiency", "30 Year Warranty", "Bifacial Technology"]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1545209575-704d1434f9cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGVuZXJneXxlbnwxfHx8fDE3Njg4ODkxNzV8MA&ixlib=rb-4.1.0&q=80&w=400'],
    true
  ),
  (
    'EcoPower 10kW Inverter',
    'Commercial-grade solar inverter for large installations',
    'inverters',
    279900.00,
    10,
    '["10kW Capacity", "Hybrid Ready", "99% Efficiency", "Remote Monitoring"]'::jsonb,
    ARRAY['https://images.unsplash.com/photo-1487875961445-47a00398c267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY4OTI2MzYwfDA&ixlib=rb-4.1.0&q=80&w=400'],
    true
  )
ON CONFLICT DO NOTHING;

-- Verify products inserted
SELECT COUNT(*) as total_products FROM products;

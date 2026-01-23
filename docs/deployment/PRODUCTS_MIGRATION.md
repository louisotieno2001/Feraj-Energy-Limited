# Products Migration Guide

## Overview
This guide explains how to migrate products from the static data file to Supabase database.

## Prerequisites
- Supabase project already set up
- Database schema already created (products table exists)
- Access to Supabase SQL Editor

## Migration Steps

### Option 1: Using SQL Editor (Recommended)

1. **Open Supabase Dashboard**
   - Navigate to your Supabase project: https://supabase.com/dashboard/project/ferajsite
   - Go to SQL Editor

2. **Run Migration Script**
   - Copy the contents of `docs/architecture/migrate-products.sql`
   - Paste into SQL Editor
   - Click "Run" to execute

3. **Verify Products**
   - Go to Table Editor
   - Select `products` table
   - You should see 6 products inserted

### Option 2: Using Supabase Client (Manual)

If you prefer to insert products programmatically:

```typescript
import { supabase } from '@/lib/supabase';

const products = [
  {
    name: 'SolarMax Pro 400W Panel',
    description: 'High-efficiency monocrystalline solar panel with 22% efficiency rating',
    category: 'panels',
    price: 29900.00,
    stock_quantity: 25,
    specifications: ['400W Output', '22% Efficiency', '25 Year Warranty', 'Weather Resistant'],
    images: ['https://images.unsplash.com/photo-1545209575-704d1434f9cd?w=400'],
  },
  // ... add other products
];

async function migrateProducts() {
  for (const product of products) {
    const { data, error } = await supabase
      .from('products')
      .insert([product]);
    
    if (error) {
      console.error('Error inserting product:', error);
    } else {
      console.log('Inserted:', product.name);
    }
  }
}
```

## Price Conversion Note

The static data had prices in USD ($). The migration script converts them to KES (Kenyan Shillings):
- Conversion rate used: 1 USD = ~100 KES (approximate)
- Example: $299 → KES 29,900

You can adjust these prices in Supabase after migration.

## Category Mapping

| Static Category | Database Category |
|----------------|-------------------|
| Solar Panels   | panels           |
| Inverters      | inverters        |
| Battery Storage| batteries        |
| Mounting       | accessories      |

## Verification

After migration, verify the products are visible:

1. **Frontend**: Visit http://localhost:5173/products
2. **Database**: Check Supabase Table Editor
3. **API Test**: Use products.service.ts functions

## Troubleshooting

### Issue: "relation 'products' does not exist"
**Solution**: Run the schema creation script first: `docs/architecture/supabase-schema.sql`

### Issue: Products not showing on frontend
**Solution**: 
1. Check browser console for errors
2. Verify Supabase credentials in `.env.local`
3. Check RLS policies allow SELECT for unauthenticated users

### Issue: "permission denied for table products"
**Solution**: Ensure Row Level Security policy exists:
```sql
CREATE POLICY "Active products viewable by everyone"
  ON public.products FOR SELECT
  USING (is_active = true);
```

## Next Steps

After migration:
1. Test product listing on frontend
2. Test category filtering
3. Test add to cart functionality
4. Update product images if needed
5. Adjust prices for Kenyan market
6. Add more products as needed

## Rollback

If you need to remove all products:
```sql
DELETE FROM public.products;
```

To remove specific products:
```sql
DELETE FROM public.products WHERE category = 'panels';
```

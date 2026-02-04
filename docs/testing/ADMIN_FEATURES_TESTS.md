# Admin Features Testing Checklist

## Status Update (February 4, 2026)
- Roles now supported: admin, co_admin, employee, customer (installer replaced by employee).
- Staff access: admin/co_admin/employee can access /admin; user management limited to admin/co_admin.
- Co-admins cannot change admin/co_admin roles; they can manage employee/customer roles.
- Per-user permissions added: can_manage_products, can_manage_tickets, can_promote_to_co_admin (admin-only).
- Audit & monitoring: /admin/audit shows activity feed + ticket queue; profile sensitive edits, role/permission changes, and product CRUD are logged.
- Product images: URL or device upload, max 4 images, 2MB per image, primary image = first.
- Environment files (.env, .env.local, etc.) must never be committed; use host env vars.
- Linting: Prettier applied; ESLint passes with warnings only (mostly any/fast-refresh).

**Priority**: P0 (Critical - Must Complete Before Production)  
**Status**: Ready to Test  
**Estimated Time**: 20-30 minutes  
**Last Updated**: January 23, 2026

---

## Prerequisites

Before testing, ensure:
- ✅ Products migration SQL has been run in Supabase
- ✅ RLS policies have been applied in Supabase
- ✅ Your user account has been elevated to admin role
- ✅ Dev server is running (`npm run dev`)
- ✅ Browser console is open (F12) to check for errors

---

## Test 1: Admin Dashboard Access ⭐ CRITICAL

**Priority**: P0  
**Objective**: Verify admin users can access the dashboard

### Steps:
1. Open http://localhost:5174/ in browser
2. Log in with your admin account credentials
3. Navigate to http://localhost:5174/admin/dashboard

### Expected Results:
- ✅ Dashboard loads without errors
- ✅ Statistics cards display:
  - Total Users count
  - Total Products count (should show 6+)
  - Total Orders (shows 0 for now)
  - Total Revenue (shows KES 0 for now)
- ✅ Secondary stats show:
  - Out of stock products
  - Low stock products
  - Active products
- ✅ Quick action buttons visible
- ✅ Navigation sidebar visible with 4 menu items

### Failure Scenarios:
- ❌ "Access denied" message → Check user role in Supabase profiles table
- ❌ Loading spinner forever → Check browser console for API errors
- ❌ Statistics show 0 → Check RLS policies and product data

---

## Test 2: Products Display on Public Site ⭐ CRITICAL

**Priority**: P0  
**Objective**: Verify products from database appear on the website

### Steps:
1. Navigate to http://localhost:5174/products
2. Scroll through the products page

### Expected Results:
- ✅ 6 products visible:
  - SolarMax Pro 400W Panel (KES 29,900)
  - EcoPower 5kW Inverter (KES 149,900)
  - PowerBank Home Battery 10kWh (KES 699,900)
  - SmartMount Roof System (KES 89,900)
  - SolarMax Pro 550W Panel (KES 44,900)
  - EcoPower 10kW Inverter (KES 279,900)
- ✅ Product images load correctly
- ✅ Prices displayed in KES format
- ✅ Stock quantities visible
- ✅ "Add to Cart" buttons visible
- ✅ Category badges displayed

### Failure Scenarios:
- ❌ "No products found" → Products migration didn't run
- ❌ Loading spinner forever → Check RLS policy "Anyone can view active products"
- ❌ Broken images → Image URLs may be invalid

---

## Test 3: Admin User Management ⭐ CRITICAL

**Priority**: P0  
**Objective**: Verify admin can view and manage user roles

### Steps:
1. Navigate to http://localhost:5174/admin/users
2. Observe the users list
3. Try searching for a user by name or email
4. Filter users by role (All/Customer/Admin/Installer)
5. Click "Change Role" on a test user (create one if needed)
6. Select a different role (e.g., Customer → Installer)
7. Confirm the change

### Expected Results:
- ✅ All users displayed in table
- ✅ User info shows: name, email, role badge, join date
- ✅ Statistics cards show user counts by role
- ✅ Search filters users correctly
- ✅ Role filter works correctly
- ✅ Role change modal opens
- ✅ Role options displayed (Customer, Admin, Installer)
- ✅ Success toast appears: "User role updated to [role]"
- ✅ User's role badge updates immediately in table
- ✅ Cannot change own role (button disabled for current user)

### Failure Scenarios:
- ❌ "Failed to load users" → Check RLS policy "Admins can view all profiles"
- ❌ "Failed to update user role" → Check RLS policy "Admins can update any profile"
- ❌ Can change own role → Security bug, check AdminUsers.tsx logic

---

## Test 4: Admin Product Management - View ⭐ CRITICAL

**Priority**: P0  
**Objective**: Verify admin can view all products with management controls

### Steps:
1. Navigate to http://localhost:5174/admin/products
2. Observe the products table
3. Try searching for a product
4. Filter by category (Panels, Inverters, Batteries, Accessories)
5. Filter by status (All, Active, Inactive)

### Expected Results:
- ✅ All 6 products displayed with:
  - Product image thumbnail
  - Name and description
  - Category badge
  - Price in KES
  - Stock quantity (color-coded)
  - Active/Inactive status badge
  - Edit and Delete buttons
- ✅ Statistics cards show:
  - Total products (6)
  - Active products (6)
  - Out of stock (0)
  - Low stock (<10) count
- ✅ Search filters products correctly
- ✅ Category filter works
- ✅ Status filter works
- ✅ "Add Product" button visible

### Failure Scenarios:
- ❌ No products shown → Check RLS policy "Admins can view all products"
- ❌ Only some products shown → Check products table data
- ❌ Statistics wrong → Check product data integrity

---

## Test 5: Create New Product ⭐ CRITICAL

**Priority**: P0  
**Objective**: Verify admin can create products that appear immediately

### Steps:
1. On /admin/products page, click **"Add Product"** button
2. Fill in the form:
   - **Name**: "Test Solar Panel 100W"
   - **Description**: "Testing product creation feature"
   - **Category**: Solar Panels
   - **Price**: 15000
   - **Stock Quantity**: 50
3. Add specification:
   - Key: "Power"
   - Value: "100W"
   - Click + button
4. Add image:
   - URL: `https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400`
   - Click + button
5. Verify image preview appears
6. Leave "Active" checkbox checked
7. Click **"Create Product"**
8. Wait for success message
9. Navigate to http://localhost:5174/products
10. Find "Test Solar Panel 100W" in the list

### Expected Results:
- ✅ Modal form opens
- ✅ All fields editable
- ✅ Specification added and displayed
- ✅ Image URL validated and preview shown
- ✅ Success toast: "Product created successfully"
- ✅ Modal closes automatically
- ✅ New product appears at top of admin products list
- ✅ Product visible on public /products page immediately
- ✅ Product shows correct price, stock, and image

### Failure Scenarios:
- ❌ "Failed to create product" → Check RLS policy "Admins can insert products"
- ❌ Form validation errors → Check required fields are filled
- ❌ Product not visible on /products → Check is_active is true
- ❌ Image doesn't load → Check image URL is valid and accessible

---

## Test 6: Edit Product ⭐ CRITICAL

**Priority**: P0  
**Objective**: Verify admin can edit products and changes reflect immediately

### Steps:
1. On /admin/products page, find "Test Solar Panel 100W"
2. Click the **Edit icon** (pencil)
3. Modify the product:
   - Change **Price** to 12000
   - Change **Stock Quantity** to 30
   - Add new specification: Key="Warranty" Value="5 Years"
   - Add another image URL (optional)
4. Click **"Update Product"**
5. Wait for success message
6. Check admin products list for changes
7. Navigate to /products page
8. Find and verify the updated product

### Expected Results:
- ✅ Edit modal opens with pre-filled data
- ✅ All existing data displayed correctly
- ✅ Can modify all fields
- ✅ Can add new specifications/images
- ✅ Can remove existing specifications/images
- ✅ Success toast: "Product updated successfully"
- ✅ Changes visible immediately in admin list
- ✅ Changes visible immediately on public /products page
- ✅ Price shows KES 12,000
- ✅ Stock shows 30

### Failure Scenarios:
- ❌ "Failed to update product" → Check RLS policy "Admins can update products"
- ❌ Changes don't appear → Clear browser cache (Ctrl+Shift+R)
- ❌ Old data still shows → Check database was actually updated

---

## Test 7: Delete Product ⭐ CRITICAL

**Priority**: P0  
**Objective**: Verify admin can delete products permanently

### Steps:
1. On /admin/products page, find "Test Solar Panel 100W"
2. Click the **Delete icon** (trash)
3. Read the confirmation message
4. Click **"Delete"** to confirm
5. Wait for success message
6. Check if product removed from list
7. Navigate to /products page
8. Verify product no longer visible

### Expected Results:
- ✅ Confirmation modal appears
- ✅ Warning message displayed
- ✅ Can cancel deletion
- ✅ Success toast: "Product deleted successfully"
- ✅ Product removed from admin list immediately
- ✅ Product removed from public /products page immediately
- ✅ No errors in console

### Failure Scenarios:
- ❌ "Failed to delete product" → Check RLS policy "Admins can delete products"
- ❌ Product still visible → Check database deletion occurred
- ❌ Error deleting → Check for foreign key constraints (orders referencing product)

---

## Test 8: Product Image Management ⭐ HIGH

**Priority**: P1  
**Objective**: Verify multiple images can be added and managed

### Steps:
1. Create or edit a product
2. Add multiple image URLs:
   - `https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400`
   - `https://images.unsplash.com/photo-1545209575-704d1434f9cd?w=400`
   - `https://images.unsplash.com/photo-1594373237925-5c674eda43b2?w=400`
3. Verify all images show preview
4. Remove second image by clicking trash icon
5. Save product
6. View product on /products page

### Expected Results:
- ✅ All 3 images show live preview
- ✅ Can remove images individually
- ✅ First image becomes primary thumbnail
- ✅ Invalid URL shows error message
- ✅ Product displays first image as main image
- ✅ All images stored in database array

### Failure Scenarios:
- ❌ Images don't preview → Check URL validity
- ❌ Can't remove images → Check ProductForm.tsx logic
- ❌ Images not saved → Check database array storage

---

## Test 9: Non-Admin Access Control ⭐ CRITICAL

**Priority**: P0  
**Objective**: Verify security - non-admin users cannot access admin features

### Steps:
1. Log out from admin account
2. Create a new account OR log in with a customer account
3. Try to access http://localhost:5174/admin/dashboard
4. Try to access http://localhost:5174/admin/users
5. Try to access http://localhost:5174/admin/products

### Expected Results:
- ✅ Redirected to home page (/)
- ✅ Error toast appears: "Access denied. Admin privileges required."
- ✅ Cannot see /admin/* routes
- ✅ Navbar doesn't show admin links
- ✅ Can still access /products, /cart, /orders, /profile

### Failure Scenarios:
- ❌ Can access admin pages → CRITICAL SECURITY BUG
  - Check AdminRoute.tsx logic
  - Check user role in database
  - Verify RLS policies applied
- ❌ No error message → Check toast notification

---

## Test 10: Product Stock Management ⭐ HIGH

**Priority**: P1  
**Objective**: Verify stock quantities display correctly

### Steps:
1. On /admin/products, edit a product
2. Set stock quantity to 0
3. Save product
4. Check admin list - stock should show in red
5. Edit again, set stock to 5
6. Save product
7. Check admin list - stock should show in orange
8. Edit again, set stock to 50
9. Save product
10. Check admin list - stock should show in green

### Expected Results:
- ✅ Stock = 0 → Red color with "Out of Stock" indicator
- ✅ Stock 1-9 → Orange color (low stock warning)
- ✅ Stock 10+ → Green color (healthy stock)
- ✅ Dashboard stats update accordingly
- ✅ Out of stock products show in statistics
- ✅ Low stock products show in statistics

### Failure Scenarios:
- ❌ Colors don't change → Check AdminProducts.tsx CSS classes
- ❌ Statistics don't update → Refresh page or check calculation logic

---

## Test 11: Product Active/Inactive Toggle ⭐ HIGH

**Priority**: P1  
**Objective**: Verify product visibility can be controlled

### Steps:
1. Edit a product in /admin/products
2. Uncheck "Active" checkbox
3. Save product
4. Check admin list - status should show "Inactive" with eye-off icon
5. Navigate to /products page
6. Verify product is NOT visible to customers
7. Edit product again, check "Active"
8. Save product
9. Verify product appears on /products page

### Expected Results:
- ✅ Active toggle works in form
- ✅ Inactive products show gray badge with EyeOff icon
- ✅ Active products show green badge with Eye icon
- ✅ Inactive products NOT visible on public /products page
- ✅ Active products visible on public /products page
- ✅ Admins can see all products regardless of status

### Failure Scenarios:
- ❌ Inactive products still visible → Check RLS policy filters by is_active
- ❌ Can't toggle status → Check form logic

---

## Test 12: Search and Filter Functionality ⭐ MEDIUM

**Priority**: P2  
**Objective**: Verify search and filters work correctly

### Steps:

**Admin Users Search:**
1. Go to /admin/users
2. Type partial email in search
3. Verify filtered results
4. Clear search
5. Filter by role "Admin"
6. Verify only admins shown

**Admin Products Search:**
1. Go to /admin/products
2. Type "solar" in search
3. Verify only solar products shown
4. Clear search
5. Filter by category "Inverters"
6. Verify only inverters shown
7. Filter by status "Inactive"
8. Verify only inactive products shown

### Expected Results:
- ✅ Search filters dynamically as you type
- ✅ Filters work independently and can be combined
- ✅ Clearing search/filter shows all items
- ✅ No results shows "No [users/products] found" message
- ✅ Results update immediately

### Failure Scenarios:
- ❌ Search doesn't filter → Check filter logic in component
- ❌ Filters don't combine → Check multiple filter application

---

## Test 13: Responsive Design ⭐ MEDIUM

**Priority**: P2  
**Objective**: Verify admin panel works on mobile devices

### Steps:
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar
4. Navigate through admin pages
5. Test hamburger menu
6. Test forms on mobile

### Expected Results:
- ✅ Sidebar collapses to hamburger menu on mobile
- ✅ Tables are horizontally scrollable
- ✅ Forms are usable on mobile
- ✅ Buttons are touch-friendly (44px minimum)
- ✅ Statistics cards stack vertically
- ✅ No horizontal overflow

### Failure Scenarios:
- ❌ Sidebar doesn't collapse → Check AdminLayout.tsx responsive breakpoints
- ❌ Tables overflow → Add overflow-x-auto wrapper
- ❌ Forms unusable → Adjust form field sizes

---

## Post-Testing Actions

### If All Tests Pass ✅
1. Mark all tests as complete
2. Update PROJECT_STATUS.md
3. Create deployment checklist
4. Prepare for production deployment
5. Document any minor issues as future enhancements

### If Tests Fail ❌
1. Document exact error messages
2. Check browser console for errors (F12 → Console)
3. Verify database data integrity
4. Check Supabase logs (Dashboard → Logs)
5. Review RLS policies
6. Report issues with screenshots
7. Retest after fixes

---

## Test 14: Role Elevation Rules ⭐ CRITICAL

**Priority**: P0  
**Objective**: Verify admin and co-admin role change rules

### Steps:
1. Log in as **admin**
2. Navigate to `/admin/users`
3. Select a customer and set role to **co_admin**
4. Select a co-admin and set role to **admin**
5. Log in as **co_admin**
6. Try to change an **admin** role (should be blocked)
7. Try to change a **co_admin** role (should be blocked)
8. Change an **employee** to **customer**

### Expected Results:
- ✅ Admin can promote/demote all roles
- ✅ Co-admin cannot change admin/co-admin roles
- ✅ Co-admin can change employee/customer roles
- ✅ Changes reflected immediately in table

---

## Test 15: Permissions Checkboxes ⭐ HIGH

**Priority**: P1  
**Objective**: Verify per-user permissions and product/ticket access

### Steps:
1. Log in as **admin**
2. Open a user in `/admin/users`
3. Toggle **Handle products** and **Handle tickets**
4. Save changes
5. Log in as that user (employee role)
6. Verify access:
   - Products page only if **Handle products** is enabled
   - Ticket actions only if **Handle tickets** is enabled

### Expected Results:
- ✅ Permissions saved and enforced
- ✅ Access reflects permissions in UI

---

## Test 16: Audit Panel ⭐ HIGH

**Priority**: P1  
**Objective**: Verify audit feed visibility and logging

### Steps:
1. Log in as admin or co-admin
2. Visit `/admin/audit`
3. Create or update a product
4. Change a user role or permissions
5. Edit your profile phone/company

### Expected Results:
- ✅ Audit feed shows entries for each action
- ✅ Entries include metadata (product ID, role change, profile changes)

---

## Test 17: Tickets ⭐ HIGH

**Priority**: P1  
**Objective**: Verify ticket queue and resolution

### Steps:
1. Ensure at least one ticket exists in database
2. Log in as employee without **Handle tickets**
3. Visit `/admin/audit` and confirm read-only
4. Log in as admin/co-admin (or employee with permission)
5. Resolve a ticket and add a response

### Expected Results:
- ✅ Read-only view for users without permission
- ✅ Resolution allowed only with permission
- ✅ Resolution logged in audit feed

---

## Test 18: Device Image Upload ⭐ HIGH

**Priority**: P1  
**Objective**: Verify device upload flow and image limits

### Steps:
1. Log in as admin or co-admin
2. Go to `/admin/products` → Add Product
3. Upload 1–2 images from device (under 2MB)
4. Set a non-primary image as **Primary**
5. Try to upload more than 4 images

### Expected Results:
- ✅ Uploaded images show preview
- ✅ Primary badge updates correctly
- ✅ Max 4 images enforced
- ✅ Over-limit uploads show error toast

---

## Success Criteria

**Admin features are production-ready when:**
- ✅ All P0 tests pass without errors
- ✅ Admin can view/create/edit/delete products
- ✅ Admin can view/manage user roles
- ✅ Role elevation rules enforced (admin/co-admin)
- ✅ Permissions enforce product/ticket access
- ✅ Products appear immediately on public site after creation
- ✅ Non-admin users cannot access admin features
- ✅ Audit panel shows change log entries
- ✅ Ticket queue visible to staff, actions gated by permission
- ✅ No console errors during normal usage
- ✅ Statistics display correctly
- ✅ Search and filters work
- ✅ Mobile layout is functional

---

## Testing Environment

- **Browser**: Chrome/Firefox/Safari (latest)
- **Server**: http://localhost:5174/
- **Database**: Supabase (ferajsite project)
- **Admin Email**: [Your admin email]
- **Test User Email**: [Create test user if needed]

---

## Notes

- Keep browser console open during testing to catch errors
- Test with both admin and non-admin accounts
- Clear browser cache if changes don't appear
- Take screenshots of any errors
- Test on both desktop and mobile viewports
- Document any unexpected behavior

---

**Last Updated**: February 4, 2026  
**Version**: v1.3.0  
**Status**: Ready for Testing

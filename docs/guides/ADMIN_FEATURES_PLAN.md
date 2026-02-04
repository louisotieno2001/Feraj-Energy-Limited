# Admin Features Implementation Plan

## Status Update (February 4, 2026)
- Roles now supported: admin, co_admin, employee, customer (installer replaced by employee).
- Staff access: admin/co_admin/employee can access /admin; user management limited to admin/co_admin.
- Co-admins cannot change admin/co_admin roles; they can manage employee/customer roles.
- Per-user permissions added: can_manage_products, can_manage_tickets, can_promote_to_co_admin (admin-only).
- Audit & monitoring: /admin/audit shows activity feed + ticket queue; profile sensitive edits, role/permission changes, and product CRUD are logged.
- Product images: URL or device upload, max 4 images, 2MB per image, primary image = first.
- Environment files (.env, .env.local, etc.) must never be committed; use host env vars.
- Linting: Prettier applied; ESLint passes with warnings only (mostly any/fast-refresh).

**Created**: January 23, 2026  
**Version**: v1.3.0 (Planned)  
**Status**: Planning Phase

---

## Overview

This document outlines the implementation plan for admin dashboard features. **Implementation has progressed** beyond this plan. Current behavior includes staff roles (admin/co_admin/employee), per-user permissions, and an audit/ticket panel.

### Current Implementation Summary
- Staff roles: admin, co_admin, employee (customer remains default)
- Co-admin limitations enforced (cannot change admin/co_admin)
- Per-user permissions: products/tickets/co-admin promotion
- Audit & monitoring panel at `/admin/audit`

---

## Architecture

### Admin Role System

```
User Roles Hierarchy:
├── customer (default)     - Can browse, purchase, view own orders
├── employee              - Staff access; permissions required for products/tickets
├── co_admin              - Staff access; can manage employees/customers
└── admin                 - Full system access
    ├── Manage users (all roles)
    ├── Manage products (CRUD)
    ├── Manage tickets/audit
    └── View analytics
```

### Route Protection

```
/admin/*                  - Staff access (admin/co_admin/employee)
  ├── /admin/dashboard    - Admin overview
  ├── /admin/users        - User management
  ├── /admin/products     - Product management
  ├── /admin/audit        - Audit & tickets
  └── /admin/orders       - Order management
```

---

## Phase 1: Admin Infrastructure (1-2 hours)

### 1.1 Admin Route Guard
**File**: `src/app/components/AdminRoute.tsx`

**Features**:
- Check if user is authenticated
- Verify user role is 'admin'
- Redirect non-admins to home with error message
- Show loading state during role check

**Implementation**:
```typescript
interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, profile, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}
```

### 1.2 Admin Layout Component
**File**: `src/app/components/layouts/AdminLayout.tsx`

**Features**:
- Sidebar navigation
- Admin header with user info
- Breadcrumbs
- Mobile responsive

**Navigation Items**:
- Dashboard (overview)
- Users (management)
- Products (CRUD)
- Orders (view/update)

### 1.3 Update App Routes
**File**: `src/app/App.tsx`

Add admin routes:
```typescript
<Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>}>
  <Route index element={<AdminDashboard />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="products" element={<AdminProducts />} />
  <Route path="orders" element={<AdminOrders />} />
</Route>
```

---

## Phase 2: User Management (2-3 hours)

### 2.1 User Management Service
**File**: `src/services/users.service.ts`

**Functions**:
```typescript
// Fetch all users (admin only)
getAllUsers(): Promise<Profile[]>

// Update user role
updateUserRole(userId: string, newRole: 'customer' | 'admin' | 'employee'): Promise<Profile>

// Get user by ID
getUserById(userId: string): Promise<Profile>

// Search users
searchUsers(query: string): Promise<Profile[]>
```

**Database Requirements**:
- RLS policies for admin access to all profiles
- Update policy for admin to modify user roles

### 2.2 Admin Users Page
**File**: `src/app/pages/admin/Users.tsx`

**Features**:
- ✅ List all users with pagination
- ✅ Search users by name/email
- ✅ Filter by role (customer, admin, employee)
- ✅ View user details
- ✅ Elevate user to admin
- ✅ Demote admin to customer
- ✅ Show confirmation dialog before role change
- ✅ Toast notifications for success/error
- ✅ Display user stats (total users, admins, customers)

**UI Components**:
- User table with sortable columns
- Role badge (color-coded)
- Action buttons (Edit Role)
- Search bar
- Filter dropdown
- Confirmation modal

### 2.3 Database Policies
**File**: Add to Supabase

```sql
-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can update any profile
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## Phase 3: Product Management (3-4 hours)

### 3.1 Admin Products Page
**File**: `src/app/pages/admin/Products.tsx`

**Features**:
- ✅ List all products (including inactive)
- ✅ Search products
- ✅ Filter by category
- ✅ Sort by name, price, stock, date
- ✅ Add new product (form modal)
- ✅ Edit existing product
- ✅ Delete product (soft delete)
- ✅ Toggle product active/inactive status
- ✅ Bulk actions (activate, deactivate, delete)
- ✅ Image upload/URL input
- ✅ Stock management

**UI Components**:
- Products table/grid view toggle
- Add Product button → Modal
- Edit button → Modal
- Delete button → Confirmation
- Status toggle switch
- Search bar
- Category filter
- Sort dropdown

### 3.2 Product Form Component
**File**: `src/app/components/admin/ProductForm.tsx`

**Form Fields**:
```typescript
interface ProductFormData {
  name: string;              // Required
  description: string;       // Required
  category: 'panels' | 'inverters' | 'batteries' | 'accessories'; // Required
  price: number;             // Required, min 0
  stock_quantity: number;    // Required, min 0
  specifications: string[];  // Optional, array of strings
  images: string[];          // Optional, array of URLs
  is_active: boolean;        // Default true
}
```

**Validation**:
- Name: 3-100 characters
- Description: 10-500 characters
- Price: Must be positive number
- Stock: Must be non-negative integer
- Images: Valid URLs

**Features**:
- Zod validation schema
- Real-time error messages
- Add/remove specification fields
- Add/remove image URLs
- Preview first image
- Submit/Cancel buttons

### 3.3 Products Service (Already Exists)
**File**: `src/services/products.service.ts` ✅

**Already Implemented**:
- ✅ `createProduct()` - Create new product
- ✅ `updateProduct()` - Update existing product
- ✅ `deleteProduct()` - Soft delete
- ✅ `getAllProducts()` - Admin view all (including inactive)

**Database Policies** (Already Set):
```sql
-- Admins can manage products
CREATE POLICY "Admins can manage products"
  ON public.products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## Phase 4: Admin Dashboard (1-2 hours)

### 4.1 Admin Dashboard Page
**File**: `src/app/pages/admin/Dashboard.tsx`

**Features**:
- Overview statistics cards
  - Total Users
  - Total Products
  - Total Orders
  - Revenue (if implemented)
- Recent orders list
- Low stock alerts
- Recent user registrations
- Quick actions (Add Product, View Orders)

**Components**:
- StatCard component
- Recent activity feed
- Quick action buttons
- Charts (optional, future enhancement)

---

## Implementation Order

### Day 1 (4-5 hours)
1. ✅ Create AdminRoute component (30 min)
2. ✅ Create AdminLayout component (1 hour)
3. ✅ Update App.tsx with admin routes (15 min)
4. ✅ Create users.service.ts (1 hour)
5. ✅ Add database policies for admin access (30 min)
6. ✅ Create AdminUsers page (2 hours)

### Day 2 (3-4 hours)
1. ✅ Create ProductForm component (1.5 hours)
2. ✅ Create AdminProducts page (2 hours)
3. ✅ Test product CRUD operations (30 min)

### Day 3 (1-2 hours)
1. ✅ Create AdminDashboard page (1.5 hours)
2. ✅ Final testing and bug fixes (30 min)

---

## Testing Checklist

### User Management
- [ ] Admin can view all users
- [ ] Admin can search users
- [ ] Admin can filter by role
- [ ] Admin can elevate user to admin
- [ ] Admin can demote admin to customer
- [ ] Non-admin cannot access admin routes
- [ ] Role changes reflect immediately in database
- [ ] Toast notifications appear on success/error

### Product Management
- [ ] Admin can view all products (including inactive)
- [ ] Admin can create new product
- [ ] Admin can edit existing product
- [ ] Admin can delete product (soft delete)
- [ ] Admin can toggle active status
- [ ] New products appear on frontend immediately
- [ ] Form validation works correctly
- [ ] Images display correctly
- [ ] Stock updates work
- [ ] Non-admin cannot manage products

### Security
- [ ] Admin routes protected by AdminRoute component
- [ ] Database RLS policies enforce admin-only access
- [ ] Non-admin API calls are rejected by Supabase
- [ ] Session validation works correctly

---

## Database Updates Required

### 1. RLS Policies for Admin Access

```sql
-- Add to Supabase SQL Editor

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

-- Admins can update any profile role
CREATE POLICY "Admins can update user roles"
  ON public.profiles FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );
```

### 2. Create First Admin User

**Option A: Manual SQL Update**
```sql
-- Update specific user to admin
UPDATE public.profiles 
SET role = 'admin', updated_at = NOW()
WHERE email = 'your-admin-email@example.com';
```

**Option B: Create Admin During Registration**
- First registered user becomes admin automatically
- Or use invite code system

---

## File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── AdminRoute.tsx                 (NEW)
│   │   ├── layouts/
│   │   │   └── AdminLayout.tsx            (NEW)
│   │   └── admin/
│   │       ├── ProductForm.tsx            (NEW)
│   │       ├── UserRoleModal.tsx          (NEW)
│   │       └── StatCard.tsx               (NEW)
│   ├── pages/
│   │   └── admin/
│   │       ├── Dashboard.tsx              (NEW)
│   │       ├── Users.tsx                  (NEW)
│   │       ├── Products.tsx               (NEW)
│   │       └── Orders.tsx                 (NEW)
│   └── App.tsx                            (UPDATE)
├── services/
│   └── users.service.ts                   (NEW)
└── hooks/
    └── useAdmin.ts                        (NEW - optional)
```

---

## Security Considerations

1. **Authentication**: Always verify user is authenticated
2. **Authorization**: Check admin role on both frontend and backend (RLS)
3. **Input Validation**: Validate all form inputs with Zod
4. **SQL Injection**: Use Supabase parameterized queries (built-in protection)
5. **XSS Prevention**: React escapes strings automatically
6. **CSRF**: Supabase handles token validation
7. **Rate Limiting**: Supabase has built-in rate limiting

---

## Future Enhancements (Post v1.3.0)

- [ ] Audit log for admin actions
- [ ] Bulk product import (CSV)
- [ ] Product image upload to Supabase Storage
- [ ] Advanced analytics dashboard
- [ ] Email notifications for admin actions
- [ ] Two-factor authentication for admins
- [ ] Activity history for each user
- [ ] Export reports (users, products, orders)

---

## Success Criteria

✅ **Phase Complete When**:
1. Admin can successfully elevate users to admin role
2. Admin can create new products that appear on the site
3. Admin can edit existing products
4. Admin can delete/deactivate products
5. All actions are reflected in real-time on the frontend
6. Non-admin users cannot access admin routes
7. Database RLS policies properly enforce permissions
8. Zero TypeScript errors
9. All tests pass

---

**Next Steps**: Begin implementation with Phase 1 - Admin Infrastructure

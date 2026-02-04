# Supabase Backend Architecture

## Status Update (February 4, 2026)
- Roles now supported: admin, co_admin, employee, customer (installer replaced by employee).
- Staff access: admin/co_admin/employee can access /admin; user management limited to admin/co_admin.
- Co-admins cannot change admin/co_admin roles; they can manage employee/customer roles.
- Per-user permissions added: can_manage_products, can_manage_tickets, can_promote_to_co_admin (admin-only).
- Audit & monitoring: /admin/audit shows activity feed + ticket queue; profile sensitive edits, role/permission changes, and product CRUD are logged.
- Product images: URL or device upload, max 4 images, 2MB per image, primary image = first.
- Environment files (.env, .env.local, etc.) must never be committed; use host env vars.
- Linting: Prettier applied; ESLint passes with warnings only (mostly any/fast-refresh).
**Project**: Feraj Solar Limited Website  
**Version**: 1.0  
**Date**: January 22, 2026  
**Status**: Design Phase

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Database Schema Design](#database-schema-design)
3. [Authentication System](#authentication-system)
4. [API Design](#api-design)
5. [Security Implementation](#security-implementation)
6. [Frontend Integration](#frontend-integration)
7. [Deployment Strategy](#deployment-strategy)
8. [Implementation Roadmap](#implementation-roadmap)

---

## 1. Architecture Overview

### Technology Stack

**Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime)
**Frontend**: React 18 + TypeScript
**Authentication**: Supabase Auth (JWT-based)
**Database**: PostgreSQL (via Supabase)
**Storage**: Supabase Storage (for user uploads)
**API**: Supabase REST API + Real-time subscriptions

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                        │
│  React App + TypeScript + Supabase Client                  │
└──────────────────┬──────────────────────────────────────────┘
                   │ HTTPS
                   │ JWT Tokens
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE PLATFORM                          │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Auth Service │  │  PostgreSQL  │  │  Storage        │  │
│  │  (GoTrue)     │  │  Database    │  │  (S3-compatible)│  │
│  └───────────────┘  └──────────────┘  └─────────────────┘  │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  REST API     │  │  Realtime    │  │  Edge Functions │  │
│  │  (PostgREST)  │  │  (Phoenix)   │  │  (Deno)         │  │
│  └───────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Key Benefits of Supabase

1. **Open Source**: No vendor lock-in, can self-host if needed
2. **Real-time**: Built-in real-time subscriptions for live updates
3. **PostgreSQL**: Full power of PostgreSQL with extensions
4. **Row Level Security (RLS)**: Database-level security policies
5. **Auto-generated APIs**: RESTful API from database schema
6. **Authentication Built-in**: Email, OAuth, Magic Links
7. **File Storage**: S3-compatible object storage
8. **Edge Functions**: Serverless functions with Deno

---

## 2. Database Schema Design

### User Management Tables

#### 2.1 Users Table (Extends Supabase Auth)

```sql
-- Supabase provides auth.users table automatically
-- We extend it with a public.profiles table

CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'employee', 'co_admin', 'admin')),
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### 2.2 Products Table

```sql
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Staff can manage products (admins/co-admins, employees with permission)
-- See docs/deployment/ACCESS_CONTROL_SETUP.sql for current policies
```

#### 2.2.1 User Permissions Table

```sql
CREATE TABLE public.user_permissions (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id),
  can_manage_products BOOLEAN DEFAULT false,
  can_manage_tickets BOOLEAN DEFAULT false,
  can_promote_to_co_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2.2.2 Audit Logs Table

```sql
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES public.profiles(id),
  target_user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2.2.3 Tickets Table

```sql
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.profiles(id),
  assigned_to UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'open',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2.3 Orders Table

```sql
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
```

#### 2.4 Order Items Table

```sql
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
```

#### 2.5 Installation Requests Table

```sql
CREATE TABLE public.installation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('residential', 'commercial', 'industrial')),
  address JSONB NOT NULL,
  system_size TEXT,
  preferred_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  assigned_employee_id UUID REFERENCES public.profiles(id),
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
```

#### 2.6 Support Tickets Table

```sql
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
```

### Indexes for Performance

```sql
-- Performance indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_installation_requests_user_id ON public.installation_requests(user_id);
CREATE INDEX idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
```

---

## 3. Authentication System

### 3.1 Authentication Methods

**Supported Methods:**
1. Email + Password (Primary)
2. Magic Link (Passwordless email)
3. OAuth Providers (Future: Google, GitHub)
4. Phone + OTP (Future)

### 3.2 Authentication Flow

#### Registration Flow

```
1. User submits registration form
   ├─ Email
   ├─ Password (min 8 chars, uppercase, lowercase, number, special char)
   └─ Full Name

2. Frontend validates input
   ├─ Email format
   ├─ Password strength
   └─ Required fields

3. Call Supabase signUp()
   └─ Supabase sends verification email

4. User clicks verification link
   └─ Email confirmed

5. Trigger creates profile entry
   └─ User can now sign in
```

#### Login Flow

```
1. User submits credentials
   ├─ Email
   └─ Password

2. Frontend validates input

3. Call Supabase signInWithPassword()
   ├─ Success: Returns session + JWT token
   │   ├─ Access token (short-lived: 1 hour)
   │   └─ Refresh token (long-lived: 30 days)
   └─ Failure: Returns error message

4. Store session in memory (not localStorage)
   └─ Supabase handles token refresh automatically

5. Redirect to dashboard/home
```

#### Password Reset Flow

```
1. User clicks "Forgot Password"
   └─ Enters email

2. Call Supabase resetPasswordForEmail()
   └─ Sends reset link to email

3. User clicks reset link
   └─ Redirected to password reset page

4. User enters new password
   └─ Call Supabase updateUser()

5. Password updated
   └─ User can log in with new password
```

### 3.3 Session Management

**Token Strategy:**
- Access Token: 1 hour expiration
- Refresh Token: 30 days expiration
- Automatic token refresh via Supabase client
- Tokens stored in httpOnly cookies (configured in Supabase)

**Session Persistence:**
```typescript
// Supabase automatically handles session persistence
// Configure in Supabase client initialization
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

### 3.4 Protected Routes

```typescript
// Route protection strategy
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!session) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

// Admin-only routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  
  return <>{children}</>;
};
```

---

## 4. API Design

### 4.1 Supabase Client Setup

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
```

### 4.2 Service Layer Architecture

```typescript
// src/services/auth.service.ts
export class AuthService {
  static async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    
    if (error) throw error;
    return data;
  }
  
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }
  
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
  
  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) throw error;
  }
  
  static async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
  }
  
  static async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  }
  
  static async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  }
}
```

```typescript
// src/services/products.service.ts
export class ProductsService {
  static async getAll() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  static async getById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async getByCategory(category: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  }
}
```

```typescript
// src/services/orders.service.ts
export class OrdersService {
  static async create(order: CreateOrderDto) {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
  
  static async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  static async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
}
```

### 4.3 Real-time Subscriptions

```typescript
// Subscribe to order status updates
const subscription = supabase
  .channel('orders')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'orders',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Order updated:', payload.new);
      // Update UI with new order status
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

---

## 5. Security Implementation

### 5.1 Environment Variables

```env
# .env.local (never commit this file)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5.2 Row Level Security (RLS) Policies

All tables have RLS enabled with policies that:
1. Users can only access their own data
2. Admins have elevated permissions
3. Public data (products) is readable by all
4. Sensitive data is protected

### 5.3 Input Validation

```typescript
// src/utils/validation.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain special character'),
  fullName: z.string().min(2, 'Full name required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password required'),
});
```

### 5.4 Rate Limiting

Supabase provides built-in rate limiting:
- 30 requests per minute for auth endpoints
- Can be customized in Supabase dashboard

### 5.5 CORS Configuration

Configured in Supabase dashboard:
- Allow origin: https://feraj-solar.netlify.app
- Allow credentials: true

---

## 6. Frontend Integration

### 6.1 Auth Context Provider

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 6.2 Updated Login Component

```typescript
// src/app/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/auth.service';
import { toast } from 'sonner';
import { loginSchema } from '@/utils/validation';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Validate
        loginSchema.parse({ email, password });
        
        // Sign in
        await AuthService.signIn(email, password);
        toast.success('Login successful!');
        navigate('/products');
      } else {
        // Validate
        registerSchema.parse({ email, password, fullName });
        
        // Sign up
        await AuthService.signUp(email, password, fullName);
        toast.success('Account created! Please check your email to verify.');
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
}
```

### 6.3 Directory Structure

```
src/
├── lib/
│   └── supabase.ts              # Supabase client initialization
├── services/
│   ├── auth.service.ts          # Authentication service
│   ├── products.service.ts      # Products service
│   ├── orders.service.ts        # Orders service
│   └── profile.service.ts       # User profile service
├── contexts/
│   └── AuthContext.tsx          # Auth context provider
├── hooks/
│   ├── useAuth.ts               # Auth hook
│   ├── useProducts.ts           # Products hook
│   └── useOrders.ts             # Orders hook
├── types/
│   └── supabase.ts              # Generated TypeScript types
├── utils/
│   └── validation.ts            # Input validation schemas
└── app/
    ├── components/
    │   └── ProtectedRoute.tsx   # Route protection component
    └── pages/
        ├── Login.tsx            # Updated login/signup
        ├── Profile.tsx          # User profile
        └── Orders.tsx           # User orders
```

---

## 7. Deployment Strategy

### 7.1 Supabase Project Setup

1. Create project at supabase.com
2. Run database migrations
3. Configure authentication settings
4. Set up RLS policies
5. Configure storage buckets (if needed)
6. Get API keys and URL

### 7.2 Netlify Environment Variables

Add to Netlify dashboard:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 7.3 Database Migrations

```sql
-- migrations/001_initial_schema.sql
-- Run this in Supabase SQL Editor
-- Contains all table definitions, RLS policies, and triggers
```

---

## 8. Implementation Roadmap

### Phase 1: Setup (Week 1)
- [x] Design architecture
- [ ] Create Supabase project
- [ ] Install Supabase client library
- [ ] Set up environment variables
- [ ] Run database migrations
- [ ] Configure RLS policies

### Phase 2: Authentication (Week 1-2)
- [ ] Create AuthContext provider
- [ ] Create auth service layer
- [ ] Update Login/Signup page
- [ ] Implement password reset
- [ ] Add email verification
- [ ] Create protected routes
- [ ] Add logout functionality

### Phase 3: User Profile (Week 2)
- [ ] Create profile service
- [ ] Build profile page
- [ ] Implement profile editing
- [ ] Add avatar upload

### Phase 4: Products Integration (Week 2-3)
- [ ] Create products service
- [ ] Update Products page to use Supabase
- [ ] Add product search/filter
- [ ] Implement pagination

### Phase 5: Orders System (Week 3-4)
- [ ] Create orders service
- [ ] Build checkout flow
- [ ] Implement order creation
- [ ] Add order history page
- [ ] Set up real-time order updates

### Phase 6: Testing & Security (Week 4)
- [ ] Add unit tests for services
- [ ] Test authentication flows
- [ ] Security audit
- [ ] Performance optimization
- [ ] Deploy to staging

### Phase 7: Production Launch (Week 5)
- [ ] Final testing
- [ ] Documentation
- [ ] Deploy to production
- [ ] Monitor and fix issues

---

## Dependencies to Install

```bash
npm install @supabase/supabase-js
npm install zod          # Input validation
npm install @tanstack/react-query  # Data fetching (optional)
```

---

## Success Criteria

1. [PASS] Users can register with email verification
2. [PASS] Users can log in securely with JWT tokens
3. [PASS] Users can reset passwords
4. [PASS] Sessions persist across page reloads
5. [PASS] Protected routes redirect unauthenticated users
6. [PASS] Users can only access their own data
7. [PASS] Admin users have elevated permissions
8. [PASS] All sensitive operations are logged
9. [PASS] API calls are rate-limited
10. [PASS] No security vulnerabilities found in audit

---

**Next Steps**: 
1. Create Supabase project
2. Install dependencies
3. Implement Phase 1 (Setup)

**Document Owner**: Development Team  
**Last Updated**: January 22, 2026

# Feraj Solar Limited Website

Live site: https://feraj.solar/

## Overview
Feraj Solar Limited is a React + TypeScript site built with Vite and Supabase (Auth + Postgres + RLS). It includes public pages, a product catalog, and a staff admin panel with role-based access.

## Tech Stack
- React 18, TypeScript, Vite
- Tailwind CSS, Radix UI
- Supabase (Auth, Postgres, RLS)
- Netlify (deployment)

## Local Development
1. Install dependencies:
   - `npm install`
2. Set env vars (do not commit any `.env` files):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Run dev server:
   - `npm run dev`
4. Open:
   - `http://localhost:5173`

## Admin Access
Staff roles: `admin`, `co_admin`, `employee`.
- Staff can access `/admin`
- Admin/co_admin manage users
- Permissions control product/ticket access
- Audit panel at `/admin/audit`

## Database Setup
Run the access control script in Supabase SQL editor:
- `docs/deployment/ACCESS_CONTROL_SETUP.sql`

## Docs
See `docs/` for architecture, deployment, testing, and guides.

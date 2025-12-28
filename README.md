# MK Nursery Project

A React + Supabase plant catalogue website.

## Features

- **Public Access**: 
  - Home page with featured plants.
  - Full plant catalog with search/filter (basic list implemented).
  - Plant details page.
  - Blog section for gardening tips.
  - **Contact Us** page with business info and inquiry form.
- **Admin Access**:
  - Secure login.
  - Dashboard with overview stats.
  - Manage Plants (Add, Edit, Delete, Image Upload).
  - Manage Blogs (Add, Edit, Delete, Banner Upload).

## Prerequisites

1. Node.js installed.
2. Supabase project created.

## Setup

1.  **Clone/Open** the project.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**:
    - Rename `.env.example` to `.env`.
    - Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase project settings.
4.  **Database Setup**:
    - Run the SQL script found in `supabase_schema.sql` in your Supabase SQL Editor.
    - This creates `plants`, `blogs` tables and storage buckets with policies.
5.  **Create Admin User**:
    - Go to Supabase Auth > Users.
    - Create a new user (e.g., `admin@mknursery.com`).

## Running the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

- **Public View**: Navigate as a normal user.
- **Admin View**: Go to `/login` to sign in.

## Build for Production

```bash
npm run build
```

The output will be in the `dist` folder.

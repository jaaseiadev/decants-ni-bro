# Decants ni Bro

Decants ni Bro is a modern web application and the official platform for our real-world perfume decanting business. It features a public-facing catalog for customers to browse our available fragrances and a comprehensive administrative dashboard for managing our inventory, tracking sales, and analyzing business statistics.

## Business Overview

This is the custom-built infrastructure powering our actual perfume decanting operations. It centralizes our catalog, sales tracking, and inventory management into a single platform for our daily business use.

## Key Features

- **Public Catalog**: A responsive, clean display of available perfume decants with filtering and search capabilities for our customers.
- **Admin Dashboard**: A secure area for managing business operations.
- **Inventory Management**: Tools to add, update, and remove products, monitor stock levels, and handle restocks.
- **Sales & Expense Tracking**: A system to directly record completed transactions and track daily business expenses.
- **Statistics & Analytics**: Visual insights offering sales trends, popular products, and revenue tracking.
- **Secure Authentication**: Secure login system with protected routes for business administrators.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database & Authentication**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Getting Started

First, install the dependencies:

`ash
npm install
`

Set up your .env.local file with the required Supabase credentials (see Supabase dashboard for these values):

`ash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
`

Then, run the development server:

`ash
npm run dev
`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Application Structure

The project is structured with specific routing for both our customers and our admins:
- src/app/ (Root): Contains the customer-facing catalog and public home pages.
- src/app/admin/: Contains the protected dashboard, inventory management, sales tracking, and analytics.
- src/app/api/: Handles specific backend business logic and calculations.

---
Built and maintained internally for the Decants ni Bro business.

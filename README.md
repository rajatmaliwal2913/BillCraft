# BillCraft 🧾

GST invoicing, simplified for modern businesses

BillCraft is a modern, GST-compliant invoicing web application built for Indian businesses, freelancers, and startups. It enables users to create, manage, and export professional GST invoices with real-time calculations, reusable business profiles, and beneficiary management — all through a clean and intuitive interface.

## Features

Secure email/password authentication
Business profile management (seller details stored once, reusable)
Beneficiary (buyer) management with auto-fill
GST-compliant invoicing with per-item discount & tax rates
Real-time invoice preview
One-click PDF export
Invoice dashboard with edit, download, and delete options
Cloud-backed storage using Supabase
Fully responsive and modern UI

## Tech Stack

Language: TypeScript, JavaScript
Frontend: React, Vite
Styling: Tailwind CSS
Backend / Auth / DB: Supabase (PostgreSQL, Auth, Row-Level Security)
PDF Generation: html2pdf.js
Hosting: Vercel

## Project Structure

frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level components (Dashboard, Invoice, Auth, etc.)
│   ├── hooks/             # Custom hooks (invoice calculations, etc.)
│   ├── utils/             # Supabase queries, helpers, validators
│   ├── types/             # TypeScript types
│   ├── constants/         # Static constants (Indian states, etc.)
│   └── lib/               # Supabase client
├── public/
└── package.json

## 🚀 Getting Started

1️⃣ Clone the repository

git clone https://github.com/rajatmaliwal2913/BillCraft.git
cd BillCraft/frontend

2️⃣ Install dependencies

npm install 

2️⃣ Install dependencies

Create a .env file in the frontend directory:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

You can find these values in your Supabase project settings.

4️⃣ Run the development server

npm run dev

The app will be available at:

http://localhost:5173

## 🗄️ Supabase Setup

You’ll need the following tables in Supabase:

business_profiles

beneficiaries

invoices

Each table uses user_id with Row-Level Security (RLS) enabled so users can only access their own data.

Authentication is configured using email and password.


## Hosted

Hosted it on vercel : https://billcrafts.vercel.app/

## 👤 Author

Rajat Maliwal
Built as a hackathon project to demonstrate clean architecture, real-world problem solving, and modern web development practices.
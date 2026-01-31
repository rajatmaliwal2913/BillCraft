# BillCraft 🧾
**GST invoicing, simplified for modern businesses**

BillCraft is a modern, GST-compliant invoicing web application built for Indian businesses, freelancers, and startups. It enables users to create, manage, and export professional GST invoices with real-time calculations, reusable business profiles, and beneficiary management — all through a clean and intuitive interface.

---

## ✨ Features

- Email & password authentication  
- Business profile management (seller details saved once and reused)  
- Beneficiary (buyer) management with auto-fill  
- GST-compliant invoicing with per-item discounts and tax rates  
- Real-time invoice preview  
- One-click PDF export  
- Invoice dashboard with edit, download, and delete options  
- Cloud-backed invoice storage  
- Responsive, modern UI  

---

## 🛠️ Tech Stack

- **Languages:** TypeScript, JavaScript  
- **Frontend:** React, Vite  
- **Styling:** Tailwind CSS  
- **Backend / Auth / Database:** Supabase (PostgreSQL, Auth, Row-Level Security)  
- **PDF Generation:** html2pdf.js  
- **Hosting:** Vercel  

---

## 📂 Project Structure

```

frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page-level components (Dashboard, Invoice, Auth, etc.)
│   ├── hooks/             # Custom hooks (invoice calculations, etc.)
│   ├── utils/             # Supabase queries, helpers, validators
│   ├── types/             # TypeScript type definitions
│   ├── constants/         # Static constants (Indian states, etc.)
│   └── lib/               # Supabase client configuration
├── public/
└── package.json

````

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/rajatmaliwal2913/BillCraft.git
cd BillCraft/frontend
````

---

### 2️⃣ Install dependencies

```bash
npm install
```

---

### 3️⃣ Configure environment variables

Create a `.env` file inside the `frontend` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These values can be found in your Supabase project settings.

---

### 4️⃣ Run the development server

```bash
npm run dev
```

The application will be available at:

```
http://localhost:5173
```

---

## 🗄️ Supabase Setup

The application uses the following tables:

* `business_profiles`
* `beneficiaries`
* `invoices`

All tables use `user_id` and have **Row-Level Security (RLS)** enabled so users can only access their own data.

Authentication is configured using **email and password**.

---

## 📄 Invoice PDF Export

Invoices are rendered as React components and exported as PDFs using `html2pdf.js`, ensuring the downloaded invoice exactly matches the on-screen preview.

---

## 🔒 Security

* Authentication handled by Supabase Auth
* Row-Level Security ensures strict data isolation
* No sensitive keys are exposed in the frontend

---

## 🧠 Design Philosophy

BillCraft focuses on simplicity, real-world GST workflows, and clean architecture. Business data, transactional data, and UI logic are clearly separated to ensure maintainability, correctness, and scalability.

---

## 🔮 Future Enhancements

* Automatic IGST vs CGST detection
* Financial-year-based invoice numbering
* Invoice sharing via email or public links
* Payment status tracking
* Reporting and analytics

---

## 👤 Author

**Rajat Maliwal**
Built as a hackathon project to demonstrate modern web development practices, clean architecture, and real-world problem solving.

---

## 📜 License

This project is intended for learning and demonstration purposes.

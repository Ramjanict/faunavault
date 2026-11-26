# FaunaVault — Modern Animal Platform (v2.0)

A high-performance animal catalog and categorization web platform upgraded with modern full-stack architecture:
- **Frontend**: [Next.js](https://nextjs.org/) App Router (React 18/19), TypeScript, [Tailwind CSS](https://tailwindcss.com/), Radix UI (`CommonSelect`), and [Lucide Icons](https://lucide.dev/).
- **Backend**: [NestJS](https://nestjs.com/) with TypeScript, modular dependency injection, [Prisma ORM](https://www.prisma.io/), [Neon PostgreSQL](https://neon.tech/), and [Cloudinary](https://cloudinary.com/) for media management.

---

## 🌐 Live Deployments

| Service | Platform | URL |
| :--- | :--- | :--- |
| **Frontend Application** | **Vercel** | [https://faunavault.vercel.app](https://faunavault.vercel.app) |
| **Backend REST API** | **Render** | [https://faunavault.onrender.com](https://faunavault.onrender.com) |
| **Interactive API Docs** | **Swagger UI** | [https://faunavault.onrender.com/api/docs](https://faunavault.onrender.com/api/docs) |

---

## 🔑 Environment Configuration & Secrets

> [!IMPORTANT]
> Never commit `.env` files or secret keys to GitHub. Real secrets should be kept locally in your `.env` file (ignored by Git) and configured in the deployment platform dashboards (Render & Vercel).

### 1. Database (Neon Serverless PostgreSQL)
- **Provider**: [Neon](https://neon.tech/)
- **Connection URI Format**:
  ```text
  postgresql://<username>:<password>@<ep-pooler-host>/neondb?sslmode=require&channel_binding=require
  ```

### 2. Media CDN (Cloudinary)
- **Provider**: [Cloudinary](https://cloudinary.com/)
- **Configuration Keys**:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- **Environment Variable Format**:
  ```text
  CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
  ```

---

## 🏗️ Architecture & Technology Stack

```
                          ┌─────────────────────────┐
                          │   Next.js (App Router)  │
                          │   TypeScript + Tailwind │
                          │   Radix UI CommonSelect │
                          └───────────┬─────────────┘
                                      │ REST API / JSON / FormData
                                      ▼
                          ┌─────────────────────────┐
                          │      NestJS Backend     │
                          │   Swagger / Validation  │
                          └─────┬─────────────┬─────┘
                                │             │
                    Prisma ORM  │             │ Cloudinary SDK
                                ▼             ▼
                     ┌──────────────────┐  ┌──────────────────┐
                     │ Neon PostgreSQL  │  │ Cloudinary Cloud │
                     │  (Serverless)    │  │  (Media Storage) │
                     └──────────────────┘  └──────────────────┘
```

### Backend (`/backend`)
- **Framework**: NestJS (Modular Architecture)
- **Database**: Neon Serverless PostgreSQL with connection pooling
- **ORM**: Prisma ORM with migrations and automated category seed
- **Cloud Storage**: Cloudinary (auto-format WebP/AVIF and quality optimization)
- **API Documentation**: OpenAPI 3.0 / Swagger UI hosted at `/api/docs`
- **Validation**: `class-validator` & `class-transformer`

### Frontend (`/frontend`)
- **Framework**: Next.js App Router (React, TypeScript)
- **Dropdown Component**: Reusable `CommonSelect` built with `@radix-ui/react-select`
- **Styling**: Tailwind CSS with modern glassmorphism aesthetic and animated background mesh
- **Image Optimization**: Next.js `<Image />` configured with Cloudinary remote patterns
- **Feedback**: `react-hot-toast` notifications

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm** or **pnpm**

---

### 2. Backend Setup & Local Run

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client & Sync Neon PostgreSQL schema
npm run prisma:generate
npm run prisma:push

# Seed default categories (Land Animal, Bird, Fish, Insect)
npm run prisma:seed

# Start backend server in development mode (runs on http://localhost:5000)
npm run start:dev

# Or run in production mode
npm run build
npm run start:prod
```

#### Backend Environment Variables (`backend/.env` - copy from `backend/.env.example`)
```env
DATABASE_URL="postgresql://<user>:<password>@<host>/neondb?sslmode=require&channel_binding=require"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
PORT=5000
FRONTEND_URL="https://faunavault.vercel.app"
```

---

### 3. Frontend Setup & Local Run

```bash
cd frontend

# Install dependencies
npm install

# Start Next.js development server (runs on http://localhost:3000)
npm run dev

# Or build for production
npm run build
npm run start
```

#### Frontend Environment Variables (`frontend/.env.local` or Vercel Settings)
```env
# For local development:
NEXT_PUBLIC_API_URL="http://localhost:5000"

# For production deployment on Vercel:
# NEXT_PUBLIC_API_URL="https://faunavault.onrender.com"
```

---

## 🧩 Reusable `CommonSelect` Dropdown Component

All dropdowns across the application use the `CommonSelect` component powered by Radix UI:

```tsx
import CommonSelect, { SelectOption } from "@/components/ui/CommonSelect";

const options: SelectOption<string>[] = [
  { label: "Option 1", value: "opt1" },
  { label: "Option 2", value: "opt2" },
];

<CommonSelect
  value={selectedValue}
  item={options}
  w="100%"
  onValueChange={(val) => setSelectedValue(val)}
  placeholder="Select an option"
/>
```

---

## 📡 API Endpoints

### Categories
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/categories` | Retrieve all categories with animal counts |
| `POST` | `/api/categories` | Create a new category (`{ "name": "Reptile" }`) |
| `DELETE` | `/api/categories/:id` | Delete category by ID |

### Animals
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/animals` | Get all animals (supports `?categoryId=...` & `?search=...`) |
| `POST` | `/api/animals` | Upload new animal (`multipart/form-data` with `file`, `name`, `categoryId`) |
| `DELETE` | `/api/animals/:id` | Delete animal record and remove image from Cloudinary |

*Legacy routes (`/api/upload-animal`, `/api/add-category`, `/api/all-category`) are preserved for backward compatibility.*

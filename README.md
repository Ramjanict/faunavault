# Animal Vault — Modern Full-Stack Platform (v2.0)

A high-performance animal management and categorization web application upgraded with modern architecture:
- **Backend**: [NestJS](https://nestjs.com/) with TypeScript, modular dependency injection, [Prisma ORM](https://www.prisma.io/), [Neon PostgreSQL](https://neon.tech/), and [Cloudinary](https://cloudinary.com/) for media management.
- **Frontend**: [Next.js](https://nextjs.org/) App Router with TypeScript, [Tailwind CSS](https://tailwindcss.com/), and [Lucide Icons](https://lucide.dev/).

---

## 🏗️ Architecture & Technology Stack

```
                          ┌─────────────────────────┐
                          │   Next.js (App Router)  │
                          │   TypeScript + Tailwind │
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
- **Framework**: NestJS (Node.js TypeScript framework)
- **Database**: Neon Serverless PostgreSQL (pooled connection)
- **ORM**: Prisma ORM with schema migrations & seeding
- **Cloud Storage**: Cloudinary (auto format & quality optimization)
- **API Documentation**: OpenAPI / Swagger UI at `/api/docs`
- **Validation**: `class-validator` & `class-transformer`

### Frontend (`/frontend`)
- **Framework**: Next.js App Router (React 18/19, TypeScript)
- **Styling**: Tailwind CSS with dark theme aesthetics
- **Image Optimization**: Next.js `<Image />` with Cloudinary remote pattern
- **User Feedback**: `react-hot-toast` notifications

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm** or **pnpm**

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Push database schema to Neon PostgreSQL
npm run prisma:push

# Seed default categories (Land Animal, Bird, Fish, Insect)
npm run prisma:seed

# Start backend in development mode (runs on http://localhost:5000)
npm run start:dev
```

- **API Documentation (Swagger UI)**: `http://localhost:5000/api/docs`

#### Environment Variables (`backend/.env`)
```env
DATABASE_URL="postgresql://neondb_owner:npg_K29uVNgsSinL@ep-long-surf-be8i6erx-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
CLOUDINARY_CLOUD_NAME="ramjan"
CLOUDINARY_API_KEY="839226347835865"
CLOUDINARY_API_SECRET="JrKNyYxIiwOtyuTYa6ykVwEG-gk"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

---

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev
```

#### Environment Variables (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000"
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

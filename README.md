# 🏪 Store Rating Platform

A full-stack web application where users can browse and rate stores. Built with React, Node.js, Express, and PostgreSQL — featuring three distinct user roles with separate dashboards and protected routes.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Form Validations](#form-validations)
- [Running the Project](#running-the-project)

---

## 🧾 Overview

The Store Rating Platform allows normal users to discover and rate registered stores (1–5 stars). Admins manage users and stores from a central dashboard, while store owners can monitor their ratings and average scores. All access is secured with JWT-based authentication and role-based route protection.

---

## 🛠 Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js + Vite                   |
| Styling    | Tailwind CSS                      |
| Backend    | Node.js + Express.js              |
| Database   | PostgreSQL                        |
| Auth       | JWT (JSON Web Tokens) + bcryptjs  |
| HTTP       | Axios                             |
| Routing    | React Router DOM                  |
| Dev Tool   | Nodemon                           |

---

## ✨ Features

### System Administrator
- Dashboard with total users, stores, and ratings count
- Add new users (normal user, admin, store owner)
- Add new stores
- View and filter all users by name, email, address, role
- View and filter all stores by name, email, address, rating
- Sortable tables (ascending/descending)
- Logout

### Normal User
- Register and login
- Browse all registered stores
- Search stores by name and address
- Submit a rating (1–5 stars) for any store
- Update a previously submitted rating
- View overall store rating and their own submitted rating
- Update password
- Logout

### Store Owner
- Login to the platform
- View list of users who rated their store
- View average rating of their store
- Update password
- Logout

---

## 📁 Project Structure

```
store-rating-app/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js               # Axios instance with token interceptor
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Global auth state (login/logout)
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx     # Role-based route guard
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ManageUsers.jsx
│   │   │   │   └── ManageStores.jsx
│   │   │   ├── user/
│   │   │   │   ├── StoreList.jsx
│   │   │   │   └── UpdatePassword.jsx
│   │   │   └── storeowner/
│   │   │       ├── OwnerDashboard.jsx
│   │   │       └── UpdatePassword.jsx
│   │   ├── App.jsx                    # All routes defined here
│   │   └── main.jsx                   # Entry point
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # PostgreSQL connection pool
│   │   ├── middleware/
│   │   │   ├── auth.js                # JWT verify middleware
│   │   │   └── roleCheck.js           # Role-based access control
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── storeController.js
│   │   │   └── ratingController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── storeRoutes.js
│   │   │   └── ratingRoutes.js
│   │   └── app.js                     # Express app setup
│   ├── .env                           # Environment variables
│   ├── server.js                      # Entry point
│   └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) v15+
- [pgAdmin 4](https://www.pgadmin.org/) (for database management)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/store-rating-app.git
cd store-rating-app
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=mysupersecretjwtkey123
```

---

## 🗄 Database Schema

Open pgAdmin, create a database called `store_rating_db`, then run this SQL:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user', 'store_owner')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(400),
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id)
);
```

### Seed Admin User

```sql
INSERT INTO users (name, email, password, address, role)
VALUES (
    'System Administrator One',
    'admin@store.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'Admin Office Main Street Address Here',
    'admin'
);
```

Default admin credentials:
- **Email:** admin@store.com
- **Password:** password

---

## 📡 API Endpoints

### Auth
| Method | Endpoint             | Description        | Access  |
|--------|----------------------|--------------------|---------|
| POST   | /api/auth/register   | Register new user  | Public  |
| POST   | /api/auth/login      | Login              | Public  |

### Users
| Method | Endpoint                  | Description           | Access  |
|--------|---------------------------|-----------------------|---------|
| GET    | /api/users                | Get all users         | Admin   |
| POST   | /api/users                | Create user           | Admin   |
| GET    | /api/users/stats          | Get platform stats    | Admin   |
| GET    | /api/users/:id            | Get user by ID        | Admin   |
| PUT    | /api/users/update-password| Update password       | All     |

### Stores
| Method | Endpoint        | Description      | Access      |
|--------|-----------------|------------------|-------------|
| GET    | /api/stores     | Get all stores   | All logged  |
| POST   | /api/stores     | Create store     | Admin       |

### Ratings
| Method | Endpoint                    | Description         | Access      |
|--------|-----------------------------|---------------------|-------------|
| POST   | /api/ratings                | Submit rating       | User        |
| PUT    | /api/ratings                | Update rating       | User        |
| GET    | /api/ratings/store/:storeId | Get store ratings   | Store Owner |

---

## 👥 User Roles

| Role        | Registration | Login | Key Access                          |
|-------------|-------------|-------|-------------------------------------|
| admin       | By admin only | ✅  | Full platform management            |
| user        | Self-register | ✅  | Browse & rate stores                |
| store_owner | By admin only | ✅  | View own store ratings              |

---

## ✅ Form Validations

| Field    | Rule                                                        |
|----------|-------------------------------------------------------------|
| Name     | Minimum 20 characters, Maximum 60 characters               |
| Email    | Must follow standard email format                          |
| Address  | Maximum 400 characters                                     |
| Password | 8–16 characters, at least 1 uppercase, 1 special character |
| Rating   | Integer between 1 and 5                                    |

---

## ▶️ Running the Project

You need **two terminals open at the same time**.

### Terminal 1 — Start Backend

```bash
cd backend
npm run dev
```

Expected output:
```
Server running on port 5000
Database connected successfully
```

### Terminal 2 — Start Frontend

```bash
cd frontend
npm run dev
```

Expected output:
```
Local: http://localhost:5173
```

Then open your browser at:
```
http://localhost:5173
```

---

## 🔗 Default Routes

| URL                        | Page                   | Role        |
|----------------------------|------------------------|-------------|
| /login                     | Login page             | All         |
| /register                  | Register page          | Public      |
| /admin/dashboard           | Admin dashboard        | Admin       |
| /admin/users               | Manage users           | Admin       |
| /admin/stores              | Manage stores          | Admin       |
| /stores                    | Browse & rate stores   | User        |
| /update-password           | Update password        | User        |
| /owner/dashboard           | Store owner dashboard  | Store Owner |
| /owner/update-password     | Update password        | Store Owner |

---

## 📌 Notes

- All routes are protected by JWT authentication
- Role-based access control prevents unauthorized access
- Tokens are stored in localStorage and attached to every API request automatically
- Store owners must be linked to a store by an admin via the `owner_id` field in the stores table

---

## 🙌 Author

Built by **Aparna** 


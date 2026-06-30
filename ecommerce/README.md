# ShopXN — Full-Stack E-Commerce Website

Built with React, Node.js, Express, MySQL, and Stripe.

---

## 📁 Project Structure

```
ecommerce/
├── client/               ← React frontend
│   ├── public/
│   └── src/
│       ├── components/   ← Navbar, Footer, ProductCard
│       ├── context/      ← Auth & Cart state
│       ├── pages/        ← All pages + admin/
│       └── services/     ← Axios API instance
└── server/               ← Node.js backend
    ├── config/           ← DB config + SQL schema
    ├── controllers/      ← Business logic
    ├── middleware/        ← Auth (JWT)
    └── routes/           ← API routes
```

---

## ⚙️ Local Setup (Step-by-Step)

### 1. Install MySQL and create database

```bash
mysql -u root -p < server/config/schema.sql
```

This creates the `ecommerce_db` database with all tables and a default admin user.

**Admin login:** `admin@store.com` / `Admin@123`

---

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` with your values:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=ecommerce_db
JWT_SECRET=any_long_random_string
STRIPE_SECRET_KEY=sk_test_xxxxx
CLIENT_URL=http://localhost:3000
```

Start the server:
```bash
npm run dev
```
Server runs at: http://localhost:5000

---

### 3. Set up the frontend

```bash
cd client
npm install
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

Start the app:
```bash
npm start
```
App runs at: http://localhost:3000

---

## 🔑 Stripe Setup

1. Create a free account at https://stripe.com
2. Go to Dashboard → Developers → API Keys
3. Copy the **Publishable key** (pk_test_...) → put in client `.env`
4. Copy the **Secret key** (sk_test_...) → put in server `.env`
5. Use test card: **4242 4242 4242 4242**, any future date, any CVC

---

## 🚀 Deployment

### Frontend → Vercel

1. Push the `client/` folder to GitHub
2. Go to https://vercel.com → New Project → Import repo
3. Set Root Directory to `client`
4. Add Environment Variables:
   - `REACT_APP_API_URL` = your backend URL (e.g. https://your-app.onrender.com/api)
   - `REACT_APP_STRIPE_PUBLISHABLE_KEY` = pk_test_...
5. Click Deploy

### Backend → Render

1. Push the `server/` folder to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your repo, set Root Directory to `server`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add all Environment Variables from `.env.example`
7. Deploy

### Database → PlanetScale or Railway (MySQL)

**Option A — Railway:**
1. Go to https://railway.app → New Project → MySQL
2. Copy the connection string
3. Set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` on Render
4. Run schema: in Railway console run the contents of `schema.sql`

**Option B — PlanetScale:**
1. Create free DB at https://planetscale.com
2. Get connection credentials
3. Set them in Render environment variables

---

## 🌐 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/register | — | Register |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/profile | ✓ | Get profile |
| GET | /api/products | — | List products |
| GET | /api/products/:id | — | Product detail |
| GET | /api/products/featured | — | Featured products |
| GET | /api/products/categories | — | All categories |
| POST | /api/products/:id/review | ✓ | Add review |
| GET | /api/cart | ✓ | Get cart |
| POST | /api/cart | ✓ | Add to cart |
| PUT | /api/cart/:id | ✓ | Update quantity |
| DELETE | /api/cart/:id | ✓ | Remove item |
| GET | /api/cart/wishlist | ✓ | Get wishlist |
| POST | /api/cart/wishlist | ✓ | Toggle wishlist |
| POST | /api/cart/coupon | ✓ | Apply coupon |
| POST | /api/orders | ✓ | Place order |
| GET | /api/orders | ✓ | My orders |
| GET | /api/orders/:id | ✓ | Order detail |
| POST | /api/payment/create-intent | ✓ | Stripe intent |
| GET | /api/admin/dashboard | Admin | Dashboard stats |
| GET/POST | /api/admin/products | Admin | Manage products |
| PUT/DELETE | /api/admin/products/:id | Admin | Edit/delete |
| GET | /api/admin/orders | Admin | All orders |
| PUT | /api/admin/orders/:id/status | Admin | Update status |
| GET | /api/admin/users | Admin | All users |

---

## ✅ Features

- Product listing, search, filter by category, sort by price/rating
- Product detail with images, stock, reviews
- Cart with quantity management and coupon codes
- Wishlist
- JWT Authentication (register/login/logout)
- Stripe payment integration
- Order placement with stock deduction
- Order tracking (status steps)
- Admin dashboard with stats
- Admin product CRUD
- Admin order management
- Admin user list
- Responsive design (mobile/tablet/desktop)

---

## 👤 Default Admin

Email: `admin@store.com`  
Password: `Admin@123`

*(Change this password after first login)*

# ⛳ GolfGives — Golf Charity Subscription Platform

> Built as part of the Digital Heroes Full-Stack Development Trainee Selection Process.

GolfGives is a modern, full-stack subscription platform where golfers track their Stableford scores, compete in monthly prize draws, and automatically donate to a charity of their choice — all in one beautifully designed application.

---

## 🌐 Live Demo

| Link | URL |
|------|-----|
| 🏠 Homepage | [https://your-app.vercel.app](https://golf-charity-platform-six-gamma.vercel.app/) |
| 👤 User Dashboard | [https://your-app.vercel.app/dashboard](https://golf-charity-platform-six-gamma.vercel.app/dashboard) |
| 🔧 Admin Panel | https://your-app.vercel.app/admin |

**Test Credentials:**

| Role | Email | Password |
|------|-------|----------|
| User | tanishgoyal08@gmail.com | 123456 |
| Admin | admin@golfgives.com | Admin@123456 |

---

## 📸 Screenshots

### Homepage
![Homepage](screenshots/homepage.png)

### User Dashboard — Overview
![Dashboard Overview](screenshots/dashboard-overview.png)

### Score Management
![Score Management](screenshots/scores.png)

### Charity Selection
![Charity Selection](screenshots/charity.png)

### Draw Results
![Draw Results](screenshots/draws.png)

### Admin Panel
![Admin Panel](screenshots/admin-overview.png)

### Admin Draw Engine
![Draw Engine](screenshots/admin-draws.png)

---

## 🚀 Key Features

### 👤 User Features
- Secure signup, login and session management via Supabase Auth
- Subscription management via Stripe (Monthly £9.99 / Yearly £99.99)
- Rolling score logic — only the latest 5 Stableford scores are kept (1–45 range)
- Charity selection with adjustable contribution percentage (min 10%)
- Monthly draw results visible in dashboard
- Winnings overview with payment status

### 🔧 Admin Features
- Full user management — view, activate, deactivate subscriptions
- Draw engine with two modes:
  - 🎲 **Random** — standard lottery-style
  - 🧠 **Algorithmic** — weighted by most frequent user scores
- Simulation mode before publishing draws
- Prize pool auto-calculation (40% jackpot / 35% 4-match / 25% 3-match)
- Jackpot rollover if no 5-match winner
- Winner verification — Approve / Reject submissions
- Payout tracking — Pending → Paid
- Charity management — Add, edit, delete listings

---

## 🏗️ System Architecture

### Database Schema (Supabase/PostgreSQL)

### Prize Pool Logic

| Match Type | Pool Share | Rollover |
|------------|-----------|---------|
| 5-Number Match | 40% | ✅ Yes (Jackpot) |
| 4-Number Match | 35% | ❌ No |
| 3-Number Match | 25% | ❌ No |

---

## 💻 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, Tailwind CSS, Lucide Icons |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth + RLS Policies |
| Payments | Stripe (Subscriptions + Webhooks) |
| Deployment | Vercel (new account) + Supabase (new project) |

---

## 🔐 Security

- Row Level Security (RLS) enforced on all tables
- Users can only access their own data at database level
- JWT-based authentication via Supabase
- Stripe webhook signature verification
- Environment variables for all sensitive keys

---

## 🗄️ Local Development
```bash
# Clone the repo
git clone https://github.com/Tanish9856/golf-charity-platform

# Install dependencies
cd golf-charity-platform
npm install

# Add environment variables
cp .env.example .env.local
# Fill in your Supabase and Stripe keys

# Run development server
npm run dev
```

---

## 📋 PRD Checklist

- ✅ User signup & login
- ✅ Subscription flow (monthly and yearly)
- ✅ Score entry — 5-score rolling logic
- ✅ Draw system logic and simulation
- ✅ Charity selection and contribution calculation
- ✅ Winner verification flow and payout tracking
- ✅ User Dashboard — all modules functional
- ✅ Admin Panel — full control and usability
- ✅ Responsive design on mobile and desktop
- ✅ Row Level Security on all tables
- ✅ Deployed to Vercel with new account
- ✅ New Supabase project

---

## 👨‍💻 Built By

**Tanish Goyal**
BTech Computer Science — Poornima Institute of Engineering & Technology, Jaipur

> Built from scratch in under 3 days with no prior Next.js experience.

GitHub: https://github.com/Tanish9856

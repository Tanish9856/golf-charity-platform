# ⛳ GolfGives: Charity & Score Tracking Platform

GolfGives is a full-stack application designed for golfers to track their performance while supporting global charities. Users enter their daily scores, and every entry contributes to a monthly jackpot draw for their chosen cause.

## 🚀 Key Features

* **Secure Dashboard**: Private user area showing subscription status and key performance metrics.
* **Rolling Score Logic**: A custom algorithm that tracks only the latest 5 scores, automatically removing the oldest entry to maintain data freshness.
* **Charity Integration**: Dynamic selection of global charities with real-time updates to user profiles.
* **Verified Draws**: A transparent system to view monthly draw results and jackpot winners.

## 📸 Project Walkthrough

### 1. User Dashboard & Analytics
The overview provides a snapshot of the user's current charity, total scores entered, and subscription status.
![Dashboard Overview](screenshots/Screenshot%202026-04-07%20112428.png)

### 2. Performance Tracking
Users can add new scores with date validation. The system manages the database to ensure a maximum of 5 scores per user.
![Score Management](screenshots/Screenshot%202026-04-07%20112527.png)

### 3. Charity Selection
Users can browse and select from a list of verified charities to support through their subscription.
![Charity Selection](screenshots/Screenshot%202026-04-07%20112537.png)

### 4. Database Architecture (Supabase)
The backend is powered by Supabase, utilizing Row Level Security (RLS) to ensure users can only access their own sensitive data.
![Supabase Schema](screenshots/Screenshot%202026-04-07%20112620.png)

## 💻 Tech Stack

* **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons.
* **Backend/Database**: Supabase (PostgreSQL).
* **Authentication**: Supabase Auth with custom RLS policies.
* **Deployment**: Vercel.

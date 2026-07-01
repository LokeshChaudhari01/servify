# Servify - Home Services Booking Platform

Servify is a full-stack Next.js web application that allows users to discover, book, and pay for professional home services such as electricians, plumbers, AC repair, home cleaning, and carpentry.

## Features

- **Service Catalog**: Browse available home services categorized for easy discovery.
- **Service Details**: View in-depth details of each service including price, duration, and inclusions.
- **Booking System**: Interactive calendar and time-slot selection (1-hour intervals).
- **Authentication**: JWT-based email and password login, implemented securely using NextAuth.js.
- **Payment Gateway**: Seamless integration with Razorpay to facilitate secure online payments.
- **Transactions Management**: Dedicated section to view all past payments and explicitly retry pending or failed payments without duplicating orders.
- **Email Notifications**: Automated booking confirmation emails sent to users via Brevo upon successful payment.
- **User Dashboard**: Profile section allowing users to track their upcoming and past bookings, including payment statuses.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [SQLite](https://sqlite.org/)
- **ORM**: [Prisma](https://www.prisma.io/) (with Prisma 7 driver adapters)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) v5 (Auth.js)
- **Payments**: [Razorpay](https://razorpay.com/)
- **Emails**: [Brevo](https://www.brevo.com/) (formerly Sendinblue) via native API

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd servify
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory based on the following template. **Important:** Do not commit your actual `.env` file to version control.
   ```env
   # Prisma database connection (SQLite for local development)
   DATABASE_URL="file:./dev.db"

   # NextAuth / Auth.js
   AUTH_SECRET="your-super-secret-jwt-key" # Run `npx auth secret` or `openssl rand -base64 32` to generate

   # Razorpay API Keys (Get these from your Razorpay Dashboard)
   NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key-id"
   RAZORPAY_KEY_ID="your-razorpay-key-id"
   RAZORPAY_KEY_SECRET="your-razorpay-key-secret"

   # Brevo Email API
   BREVO_API_KEY="your_brevo_api_key_here"
   BREVO_SENDER_EMAIL="noreply@servify.com"
   ```

4. **Initialize the Database:**
   Generate the Prisma client and apply the initial schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed the Database (Optional but recommended):**
   Populate the database with default services:
   ```bash
   npx tsx prisma/seed.ts
   ```

6. **Run the Development Server:**
   ```bash
   npm run dev
   ```

7. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## Security & Privacy Notice

To maintain the security of this project, several files containing sensitive information are excluded from version control via `.gitignore`. 

**Ignored Private Items:**
- `.env` and `.env.*` (Contains secret keys, Auth secrets, and database credentials)
- `dev.db`, `dev.db-journal`, and `*.db` (Local SQLite database files containing user and transactional data)
- `/node_modules/` (Project dependencies)
- `/.next/` (Build output)

If you are contributing to this project, ensure you do not commit any secret keys or production database files.

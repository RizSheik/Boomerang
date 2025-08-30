# Boomerang - E-commerce Platform

A modern e-commerce platform built with Next.js, Sanity CMS, Stripe payments, and Firebase authentication.

## Features

- 🛍️ **E-commerce**: Product catalog, shopping cart, and checkout
- 🔐 **Authentication**: Firebase Google authentication
- 💳 **Payments**: Stripe integration for secure payments
- 📝 **CMS**: Sanity for content management
- 📱 **Responsive**: Mobile-first design with Tailwind CSS
- ⚡ **Performance**: Built with Next.js 15 and optimized for speed

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **CMS**: Sanity
- **Authentication**: Firebase
- **Payments**: Stripe
- **State Management**: Zustand
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Sanity account and project
- Stripe account
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd boomerang
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-03-20
SANITY_API_TOKEN=your_sanity_api_token_here
SANITY_API_READ_TOKEN=your_sanity_read_token_here

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id_here

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typegen` - Generate Sanity types

### Project Structure

```
boomerang/
├── app/                    # Next.js app directory
│   ├── (client)/         # Client-side routes
│   ├── api/              # API routes
│   └── studio/           # Sanity Studio
├── components/            # React components
├── lib/                   # Utility libraries
├── sanity/                # Sanity configuration
├── store/                 # Zustand store
└── constants/             # App constants
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these environment variables in your Vercel project:

- All variables from `.env.local` (except `NEXT_PUBLIC_BASE_URL`)
- Set `NEXT_PUBLIC_BASE_URL` to your production domain

### Stripe Webhook Configuration

1. Set up your Stripe webhook endpoint in the Stripe dashboard
2. Point it to: `https://your-domain.com/api/webhook`
3. Add the webhook secret to your environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

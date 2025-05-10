# Stripe Payment Integration Demo

This is a simple Node.js application that demonstrates Stripe payment integration for a product priced at $1,099.

## Setup

1. First, install the dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with your Stripe API keys:

```
STRIPE_PUBLISHABLE_KEY=your_publishable_key_here
STRIPE_SECRET_KEY=your_secret_key_here
```

3. Replace `your_publishable_key_here` in `public/index.html` with your actual Stripe publishable key.

## Running the Application

1. Start the server:

```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`

## Features

- Product price display with breakdown
- Secure payment processing using Stripe Elements
- Modern and responsive UI
- Success page after successful payment
- Error handling and loading states

## Requirements

- Node.js 14.0.0 or higher
- A Stripe account with API keys

## Security Notes

- Never commit your `.env` file to version control
- Always use environment variables for sensitive data
- Keep your Stripe API keys secure

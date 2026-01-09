# Jade Portfolio - Node.js Version

A modern portfolio website with Node.js backend and serverless API routes.

## Features

- 🚀 Node.js backend with Express
- 📡 RESTful API endpoints
- 💾 Automatic cache detection
- 📧 Contact form API
- ⚡ Optimized for Vercel deployment
- 🎨 Modern UI with dark mode

## API Endpoints

- `GET /api/skills` - Get skills data
- `GET /api/projects` - Get projects data
- `GET /api/certificates` - Get certificates data
- `GET /api/education` - Get education data
- `POST /api/contact` - Submit contact form

## Local Development

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:3000 in your browser.

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
vercel
```

### Option 2: Deploy via GitHub

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy (auto-configured)

## Project Structure

```
Portfolio/
├── api/                 # Serverless API functions
│   ├── index.js        # Main Express server
│   ├── skills.js       # Skills API endpoint
│   ├── projects.js     # Projects API endpoint
│   ├── certificates.js # Certificates API endpoint
│   ├── education.js    # Education API endpoint
│   └── contact.js      # Contact form handler
├── data/               # JSON data files
├── css/                # Stylesheets
├── js/                 # Frontend JavaScript
├── assets/             # Images and fonts
├── index.html          # Main page
├── package.json        # Dependencies
└── vercel.json         # Vercel configuration
```

## Environment Variables (Optional)

Create a `.env` file for environment variables:

```env
NODE_ENV=development
PORT=3000
```

## Contact Form Setup

The contact form API is ready. To send actual emails, integrate:
- [Nodemailer](https://nodemailer.com/)
- [SendGrid](https://sendgrid.com/)
- [Mailgun](https://www.mailgun.com/)

## License

MIT © Jade Madriaga

# IIT PMRecruit AI - Complete Platform

**AI-Powered Recruitment Screening Platform**

A full-stack application combining a modern React frontend with an intelligent n8n-based backend for automated candidate screening.

---

## 📦 Project Structure

```
IIT-PMRecruit-AI/
├── frontend/                    # Next.js React Application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Next.js pages
│   │   ├── lib/                # Utilities and API clients
│   │   ├── styles/             # CSS/Tailwind
│   │   └── types/              # TypeScript definitions
│   ├── package.json
│   ├── README.md
│   └── CONTRIBUTING.md
│
├── backend/                     # n8n Workflow Documentation
│   ├── README.md              # Workflow overview
│   ├── API.md                 # API specifications
│   ├── SETUP.md               # Configuration guide
│   └── docs-index.md          # Documentation index
│
├── README.md                   # This file
├── MONOREPO.md                # Monorepo structure details
└── .gitignore
```

---

## 🎯 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### 1. Clone Repository
```bash
git clone https://github.com/MikeGSA/IIT-PMRecruit-AI.git
cd IIT-PMRecruit-AI
```

### 2. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with n8n webhook URLs
npm run dev
```

Visit http://localhost:3000

### 3. Configure Backend
See [backend/SETUP.md](./backend/SETUP.md) for n8n configuration

---

## 🚀 Features

### Frontend
- ✅ Resume upload and parsing
- ✅ Candidate screening dashboard
- ✅ Job role management
- ✅ Interview scheduling interface
- ✅ Real-time scoring display
- ✅ Responsive design
- ✅ Type-safe React with TypeScript
- ✅ Global state management (Zustand)

### Backend (n8n Workflow)
- ✅ **Agent 1**: Resume parsing with AI
- ✅ **Agent 2**: Candidate scoring algorithm
- ✅ **Agent 3**: Interview scheduling
- ✅ **Agent 2b**: Rejection email automation
- ✅ **Webhooks**: Two REST API endpoints
- ✅ **Integration**: Google Calendar, OpenAI, Email

---

## 📚 Documentation

### Frontend Documentation
- [Frontend README](./frontend/README.md) - Setup and features
- [Contributing Guidelines](./frontend/CONTRIBUTING.md) - Development workflow
- [Frontend Structure](#frontend-structure) - File organization

### Backend Documentation
- [Backend README](./backend/README.md) - Workflow architecture
- [API Reference](./backend/API.md) - Complete endpoint specs
- [Setup Guide](./backend/SETUP.md) - Configuration instructions

### Monorepo Documentation
- [MONOREPO.md](./MONOREPO.md) - Monorepo structure and conventions

---

## 🔗 API Integration

Frontend communicates with n8n backend via webhooks:

### Screening Pipeline
```
POST https://iitprecruitaiproject.app.n8n.cloud/webhook/screening-pipeline
```
**Payload**: Resume + Job Description  
**Response**: Candidate profile with fit score

### Interview Scheduling
```
POST https://iitprecruitaiproject.app.n8n.cloud/webhook/schedule-interview
```
**Payload**: Candidate email + Job info  
**Response**: Available time slots

See [backend/API.md](./backend/API.md) for details.

---

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 16
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Package Manager**: npm

### Backend
- **Platform**: n8n (cloud-hosted)
- **AI Engine**: OpenAI GPT-4
- **Calendar**: Google Calendar API
- **Email**: SMTP (Gmail or other)

---

## 📋 Development

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

### Backend Development
Access the n8n workflow editor:
https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9

See [backend/SETUP.md](./backend/SETUP.md) for configuration.

---

## 📦 Deployment

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
# Push to GitHub - Vercel auto-deploys
```

### Backend Deployment
Backend runs on n8n cloud - no deployment needed. Configure webhooks in the n8n editor.

---

## 🤝 Contributing

1. **Frontend changes**: See [frontend/CONTRIBUTING.md](./frontend/CONTRIBUTING.md)
2. **Backend changes**: Edit workflow in n8n, update docs in `/backend`
3. **General**: Read [MONOREPO.md](./MONOREPO.md) for conventions

### Branch Strategy
```
main (production)
├── feature/* (new features)
├── fix/* (bug fixes)
└── docs/* (documentation)
```

### Commit Format
```
type(scope): description

feat(frontend): add candidate filtering
fix(backend): improve scoring algorithm
docs(api): update webhook examples
```

---

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Testing
Use the curl examples in [backend/API.md](./backend/API.md)

---

## 🔐 Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_N8N_PIPELINE_WEBHOOK=...
NEXT_PUBLIC_N8N_SCHEDULING_WEBHOOK=...
```

### Backend (n8n credentials)
```
OPENAI_API_KEY=...
GOOGLE_CALENDAR_API=...
SMTP_CREDENTIALS=...
```

---

## 📊 Project Statistics

| Aspect | Details |
|--------|---------|
| **Total Files** | ~50+ |
| **Frontend Code** | ~5,000+ lines |
| **Backend Docs** | ~1,000 lines |
| **Languages** | TypeScript, JavaScript, Markdown |
| **Dependencies** | 20+ npm packages |
| **Last Updated** | February 23, 2026 |

---

## 🐛 Troubleshooting

### Frontend Issues
1. Check Node.js version: `node --version`
2. Clear cache: `rm -rf node_modules .next`
3. Reinstall: `npm install`
4. Check env vars in `.env.local`

### Backend Issues
1. Check webhook URLs are correct
2. Verify n8n credentials are configured
3. Test webhooks with curl
4. Review n8n execution logs

See detailed troubleshooting in [backend/SETUP.md](./backend/SETUP.md)

---

## 📞 Support

- **Frontend Issues**: GitHub Issues
- **Backend Issues**: n8n workflow editor or GitHub Issues
- **Documentation**: See README files in `/frontend` and `/backend`

---

## 📄 License

© 2026 IIT PMRecruit AI. All rights reserved.

---

## 🔗 Links

- **GitHub**: https://github.com/MikeGSA/IIT-PMRecruit-AI
- **Frontend Repo**: https://github.com/MikeGSA/Recruit-ai-frontend
- **n8n Workflow**: https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9
- **Live Demo**: (Coming Soon)

---

## 📈 Roadmap

- [ ] User authentication
- [ ] Candidate scoring export/reports
- [ ] Advanced filtering and search
- [ ] Mobile app version
- [ ] Self-hosted n8n option
- [ ] Database integration
- [ ] Analytics dashboard
- [ ] Multi-language support

---

**Start screening smarter with IIT PMRecruit AI!** 🚀

# Monorepo Structure & Guidelines

This is a monorepo containing both frontend and backend code for IIT PMRecruit AI.

## 📁 Directory Structure

```
IIT-PMRecruit-AI/
│
├── frontend/                      # React/Next.js Application
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ResumeUploader.tsx
│   │   │   └── ScoreBadge.tsx
│   │   ├── lib/
│   │   │   ├── n8n.ts           # API client for webhooks
│   │   │   ├── store.ts         # Zustand state management
│   │   │   └── utils.ts         # Utility functions
│   │   ├── pages/               # Next.js pages (routes)
│   │   │   ├── index.tsx        # Dashboard
│   │   │   ├── _app.tsx         # App wrapper
│   │   │   ├── candidates/      # Candidate detail pages
│   │   │   ├── roles/           # Role detail pages
│   │   │   └── schedule/        # Scheduling pages
│   │   ├── styles/
│   │   │   └── globals.css      # Tailwind + custom CSS
│   │   └── types/
│   │       └── index.ts         # TypeScript type definitions
│   ├── public/                   # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   ├── README.md
│   ├── CONTRIBUTING.md
│   ├── .env.example
│   └── .gitignore
│
├── backend/                      # n8n Workflow Documentation
│   ├── README.md                # Workflow overview & architecture
│   ├── API.md                   # Complete API specification
│   ├── SETUP.md                 # Configuration & deployment guide
│   ├── docs-index.md            # Documentation index
│   └── .gitignore
│
├── README.md                     # Root documentation
├── MONOREPO.md                   # This file
└── .gitignore                    # Root .gitignore
```

## 🎯 Monorepo Benefits

| Benefit | Description |
|---------|-------------|
| **Single Repository** | Easy to track related changes |
| **Shared Context** | Frontend and backend together |
| **Unified CI/CD** | One pipeline for both |
| **Consistent Versioning** | Release both together |
| **Documentation** | All docs in one place |

## 📝 File Naming Conventions

### Frontend
- **Components**: PascalCase (`UserCard.tsx`)
- **Pages**: PascalCase with brackets (`[id].tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Styles**: lowercase (`globals.css`)
- **Types**: PascalCase (`User.ts`)

### Backend
- **Markdown Files**: UPPERCASE (`README.md`, `API.md`)
- **Code Snippets**: In markdown blocks

## 🔄 Workflow

### Making Changes

#### Frontend Changes
```bash
cd frontend
git checkout -b feature/your-feature
# Make changes
git add .
git commit -m "feat(component): description"
git push origin feature/your-feature
# Create PR
```

#### Backend Changes
```bash
cd backend
# Edit markdown files
git add .
git commit -m "docs(api): description"
git push origin
```

#### Root Changes
```bash
git add README.md MONOREPO.md
git commit -m "docs(root): description"
git push origin
```

## 📦 Dependencies

### Frontend Dependencies
Managed in `frontend/package.json`

### Backend Dependencies
No npm dependencies - documentation only

### Root Dependencies
None

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
Manual testing using curl (see backend/API.md)

### Full Stack Testing
```bash
cd frontend
npm run dev
# Test in http://localhost:3000
```

## 🚀 Building & Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy Frontend
```bash
# Vercel (recommended)
npm run deploy

# Or manual
npm run build
npm run start
```

### Backend Deployment
No build needed - already deployed on n8n cloud

## 📊 Monorepo Statistics

| Metric | Value |
|--------|-------|
| **Total Directories** | 7 |
| **Total Files** | ~50+ |
| **Frontend Files** | ~26 |
| **Backend Files** | ~5 |
| **Root Files** | ~3 |
| **Lines of Code** | ~6,000+ |
| **Languages** | TypeScript, CSS, Markdown |

## 🔐 .gitignore Strategy

### Frontend .gitignore
```
node_modules/
.next/
.env.local
dist/
*.log
```

### Backend .gitignore
```
.env
.DS_Store
```

### Root .gitignore
```
node_modules/
.env
.DS_Store
```

## 📋 Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Code style
- **refactor**: Code refactoring
- **test**: Tests
- **chore**: Build, dependencies

### Scopes
- **frontend**: React/Next.js changes
- **backend**: n8n/API documentation
- **root**: Root-level changes
- **ci**: CI/CD changes

### Examples
```
feat(frontend): add candidate filtering
fix(backend): update API examples
docs(root): update README
refactor(frontend): simplify component
```

## 🔀 Branch Strategy

```
main (production)
├── develop (integration)
├── feature/* (new features)
├── fix/* (bug fixes)
└── docs/* (documentation)
```

### Branch Naming
```
feature/add-user-auth
fix/scoring-bug
docs/api-updates
refactor/component-cleanup
```

## 📈 CI/CD Pipeline

### Frontend Checks
- ESLint
- TypeScript compilation
- Build test
- Deploy to Vercel

### Backend Checks
- Markdown validation
- Link checking
- Documentation review

### Full Stack
- Both must pass before merge

## 🤝 Code Review Process

1. Create branch from `develop`
2. Make changes
3. Push and create PR
4. Request reviews
5. Address feedback
6. Merge to `develop`
7. Merge to `main` for release

## 📚 Documentation

### Frontend Docs
- **README.md**: Setup and features
- **CONTRIBUTING.md**: Development guide
- **Code Comments**: JSDoc for functions

### Backend Docs
- **README.md**: Architecture overview
- **API.md**: Endpoint specifications
- **SETUP.md**: Configuration guide

### Root Docs
- **README.md**: Project overview
- **MONOREPO.md**: This file

## 🔗 Internal References

### Frontend → Backend
```typescript
// frontend/src/lib/n8n.ts
const PIPELINE_WEBHOOK = process.env.NEXT_PUBLIC_N8N_PIPELINE_WEBHOOK;
```

### Backend → Frontend
```markdown
# backend/README.md
See [Frontend Repository](../frontend/README.md)
```

### Root References
```markdown
# README.md
- [Frontend](./frontend/README.md)
- [Backend](./backend/README.md)
```

## 🚨 Important Rules

1. **Never commit** node_modules
2. **Never commit** .env files
3. **Always update** docs with code changes
4. **Always test** before pushing
5. **Keep monorepo** organized and clean
6. **Use meaningful** commit messages
7. **Link related** issues and PRs

## 🎓 Learning Path

### New Developer Setup
1. Clone repo: `git clone ...`
2. Read root README.md
3. Read MONOREPO.md (this file)
4. `cd frontend && npm install`
5. Read frontend/README.md
6. Read frontend/CONTRIBUTING.md
7. Read backend/README.md
8. Start developing!

## 📞 Common Questions

### Q: Where do I put new components?
**A**: In `frontend/src/components/`

### Q: How do I modify the API?
**A**: Edit n8n workflow, update docs in `backend/API.md`

### Q: Where do I add utilities?
**A**: In `frontend/src/lib/utils.ts`

### Q: How do I fix a bug in frontend?
**A**: Create branch `fix/bug-name` from `develop`

### Q: How do I update documentation?
**A**: Edit markdown files, commit with `docs(scope):` prefix

---

**Happy developing!** 🚀

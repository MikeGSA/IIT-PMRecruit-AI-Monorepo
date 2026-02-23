# IIT PMRecruit AI Backend Documentation

This is the backend repository for the IIT PMRecruit AI system.

## 📁 Directory Structure

```
├── README.md          # Main documentation
├── API.md            # Complete API reference
├── SETUP.md          # Setup and configuration guide
└── .gitignore
```

## 📚 Documentation Files

- **README.md** - Overview, workflow architecture, data models
- **API.md** - Webhook endpoints, request/response formats, error handling
- **SETUP.md** - Configuration guide, environment setup, testing

## 🔗 Quick Links

- **Workflow**: https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9
- **Frontend Repository**: https://github.com/MikeGSA/Recruit-ai-frontend
- **API Documentation**: [API.md](API.md)
- **Setup Guide**: [SETUP.md](SETUP.md)

## 🚀 Quick Start

1. Read [README.md](README.md) for overview
2. Follow [SETUP.md](SETUP.md) to configure
3. Reference [API.md](API.md) for integration

## 🤝 Integration

The frontend communicates with this backend via two webhooks:
- POST `/webhook/screening-pipeline` - Resume screening
- POST `/webhook/schedule-interview` - Interview scheduling

See [API.md](API.md) for details.

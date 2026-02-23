# IIT PMRecruit AI - Backend (n8n Workflow)

**Multi-Agent AI Recruitment Screening Pipeline**

https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9

## 📋 Overview

The IIT PMRecruit AI backend is a sophisticated n8n workflow that orchestrates multiple AI agents to automate the recruitment screening process. It processes resumes through a series of intelligent agents that parse, score, and schedule interviews.

### Core Features
- ✅ **Intelligent Resume Parsing** - Extracts structured data from unformatted resumes
- ✅ **AI-Powered Scoring** - Evaluates candidate fit against job requirements
- ✅ **Automated Decision Making** - Routes candidates: Qualified → Schedule, Borderline → Review, Rejected → Decline
- ✅ **Interview Scheduling** - Automatically finds calendar slots and sends invitations
- ✅ **Email Automation** - Sends personalized interview invites and rejection emails

## 🔄 Workflow Architecture

```
Resume Upload (from Frontend)
        ↓
[Screening Pipeline Webhook]
        ↓
┌─────────────────────────────────┐
│  Agent 1: Resume Parser         │
│  - Extract candidate data       │
│  - Parse skills & experience    │
│  - Structured candidate profile │
└─────────────────────────────────┘
        ↓
┌─────────────────────────────────┐
│  Agent 2: Candidate Scorer      │
│  - Compare job requirements     │
│  - Calculate fit score (0-100)  │
│  - Determine status             │
└─────────────────────────────────┘
        ↓
    ┌───────────────────────────────────────┐
    │                                       │
    ↓ Qualified                            ↓ Rejected/Borderline
(Score ≥ threshold)              (Score < threshold)
    │                                       │
    ↓                                       ↓
┌──────────────────────┐    ┌──────────────────────┐
│ Agent 3:             │    │ Agent 2b:            │
│ Interview Scheduler  │    │ Rejection Handler    │
│ - Query calendar     │    │ - Send decline email │
│ - Find open slots    │    │ - Personalized note  │
│ - Send invitations   │    └──────────────────────┘
└──────────────────────┘
```

## 🔌 Webhook Endpoints

### 1. Screening Pipeline
**Path**: `/webhook/screening-pipeline`

**Request**:
```json
{
  "resume_text": "John Doe\nSoftware Engineer with 5+ years...",
  "job_description": "We seek a Senior Frontend Engineer...",
  "job_id": "role-001",
  "interviewer_calendar_id": "primary"
}
```

**Response**:
```json
{
  "candidate": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "location": "San Francisco, CA",
    "current_title": "Senior Frontend Engineer",
    "years_experience": 5,
    "skills": ["React", "TypeScript", "Node.js", "AWS"],
    "education": {
      "degree": "Bachelor of Science",
      "institution": "UC Berkeley",
      "graduation_year": 2018
    },
    "work_history": [
      {
        "company": "Tech Company A",
        "title": "Senior Frontend Engineer",
        "duration": "2 years"
      }
    ],
    "links": {
      "github": "https://github.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe"
    }
  },
  "job_requirements": {
    "must_haves": ["React", "TypeScript"],
    "nice_to_haves": ["AWS", "GraphQL"],
    "experience_years_required": 5,
    "job_title": "Senior Frontend Engineer"
  },
  "fit_score": 85,
  "status": "Qualified/High",
  "confidence": "High",
  "score_breakdown": {
    "must_haves": 95,
    "experience": 85,
    "adjacency": 80,
    "culture": 80
  },
  "strengths": [
    "Expert React and TypeScript skills",
    "Strong DevOps background with AWS",
    "Leadership experience"
  ],
  "gaps": [
    "Limited GraphQL experience"
  ],
  "proceed_to_scheduling": true,
  "scheduled_time": "2026-02-25T10:00:00Z"
}
```

### 2. Interview Scheduling
**Path**: `/webhook/schedule-interview`

**Request**:
```json
{
  "candidate_email": "john@example.com",
  "candidate_name": "John Doe",
  "job_title": "Senior Frontend Engineer",
  "job_id": "role-001",
  "interviewer_calendar_id": "primary"
}
```

**Response**:
```json
{
  "available_slots": [
    {
      "start": "2026-02-25T10:00:00Z",
      "end": "2026-02-25T11:00:00Z",
      "display": "Tuesday, February 25 at 10:00 AM ET"
    },
    {
      "start": "2026-02-25T14:00:00Z",
      "end": "2026-02-25T15:00:00Z",
      "display": "Tuesday, February 25 at 2:00 PM ET"
    }
  ],
  "candidate_name": "John Doe",
  "candidate_email": "john@example.com",
  "job_title": "Senior Frontend Engineer"
}
```

## 🤖 AI Agents

### Agent 1: Resume Parser
Extracts structured candidate information from raw resume text.

**Outputs**:
- Name, email, phone, location
- Current title and years of experience
- Skills and skill-specific experience
- Education and certifications
- Work history and achievements
- Contact links (GitHub, LinkedIn, portfolio)

### Agent 2: Candidate Scorer
Evaluates candidate fit using weighted scoring model.

**Scoring Dimensions**:
- **Must-Haves** (40%): Required skills match
- **Experience** (25%): Years and depth of relevant experience
- **Adjacency** (20%): Related skills that transfer well
- **Culture Fit** (15%): Soft skills and company alignment

**Status Determination**:
- **Qualified/High**: Score ≥ 80 → Proceed to scheduling
- **Qualified/Medium**: Score 65-79 → Proceed to scheduling
- **Borderline**: Score 50-64 → Manual review required
- **Rejected**: Score < 50 → Send rejection email

### Agent 2b: Rejection Handler
Sends personalized rejection emails to candidates who don't meet requirements.

**Features**:
- Personalized messaging based on gaps
- Encouraging tone for future applications
- Clear next steps

### Agent 3: Interview Scheduler
Automatically schedules qualified candidates.

**Features**:
- Queries Google Calendar for availability
- Identifies optimal meeting times (typically 1 hour slots)
- Sends interview invitation email
- Creates calendar event
- Sends confirmation to candidate

## 📊 Data Models

### Candidate
```typescript
{
  name: string;
  email: string;
  phone: string;
  location: string;
  current_title: string;
  years_experience: number;
  skills: string[];
  years_experience_per_skill: Record<string, number>;
  education: {
    degree: string;
    institution: string;
    graduation_year: number;
  };
  certifications: string[];
  work_history: Array<{
    company: string;
    title: string;
    duration: string;
  }>;
  languages: string[];
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  visa_status: string;
  soft_skills: string[];
}
```

### JobRequirements
```typescript
{
  must_haves: string[];
  nice_to_haves: string[];
  experience_years_required: number;
  culture_keywords: string[];
  job_title: string;
  department: string;
  salary_range: {
    min: number;
    max: number;
  };
}
```

### ScreeningResult
```typescript
{
  candidate: Candidate;
  job_requirements: JobRequirements;
  job_id: string;
  fit_score: number; // 0-100
  status: "Qualified/High" | "Qualified/Medium" | "Borderline" | "Rejected";
  confidence: "High" | "Medium" | "Low";
  score_breakdown: {
    must_haves: number;
    experience: number;
    adjacency: number;
    culture: number;
  };
  strengths: string[];
  gaps: string[];
  proceed_to_scheduling: boolean;
}
```

## 🚀 Quick Start

### Prerequisites
- n8n instance: https://iitprecruitaiproject.app.n8n.cloud
- OpenAI API key (for Agents 1 & 2)
- Google Calendar API (for Agent 3)

### Setup
1. Access the workflow: https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9
2. Configure webhook paths:
   - `/webhook/screening-pipeline`
   - `/webhook/schedule-interview`
3. Set environment variables in n8n:
   - `OPENAI_API_KEY`
   - `GOOGLE_CALENDAR_ID`
4. Test webhooks (see Testing section below)

## 🧪 Testing Webhooks

### Test Screening Pipeline
```bash
curl -X POST https://iitprecruitaiproject.app.n8n.cloud/webhook/screening-pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "John Doe\n\nSoftware Engineer\n5 years of experience\n\nSkills: React, TypeScript, Node.js, AWS\n\nEducation: BS Computer Science, UC Berkeley 2018",
    "job_description": "Senior Frontend Engineer\n\nRequired: React, TypeScript, 5+ years\nNice to have: AWS, GraphQL",
    "job_id": "role-001"
  }'
```

### Test Interview Scheduling
```bash
curl -X POST https://iitprecruitaiproject.app.n8n.cloud/webhook/schedule-interview \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_email": "john@example.com",
    "candidate_name": "John Doe",
    "job_title": "Senior Frontend Engineer",
    "job_id": "role-001"
  }'
```

## 📈 Monitoring & Debugging

Access the n8n dashboard to monitor workflow execution:
- **Dashboard**: https://iitprecruitaiproject.app.n8n.cloud
- **Workflow**: https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9

### View Executions
1. Click "Executions" tab in workflow
2. See all webhook calls with timestamps
3. Click any execution to view input/output
4. Debug any errors in the logs

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 Not Found | Webhook not activated | Check webhook activation in n8n |
| 400 Bad Request | Invalid payload | Verify required fields match schema |
| Timeout | Slow LLM response | Check OpenAI quota and API limits |
| Email not sent | SMTP not configured | Setup email credentials in n8n |
| No calendar slots | Calendar not connected | Configure Google Calendar API |

## 📚 Documentation

- [Frontend Repository](https://github.com/MikeGSA/Recruit-ai-frontend)
- [API Specification](#webhook-endpoints)
- [Data Models](#data-models)

## 🔧 Configuration

### Environment Variables (in n8n)
```
OPENAI_API_KEY=sk-...
GOOGLE_CALENDAR_ID=your-email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Webhook Configuration
1. Enable webhooks in workflow
2. Set test path: `/webhook/test`
3. Set production path: `/webhook/screening-pipeline`
4. Note the full URL for frontend integration

## 🔗 Frontend Integration

The frontend communicates with these webhooks:

```typescript
// Frontend code
const PIPELINE_WEBHOOK = "https://iitprecruitaiproject.app.n8n.cloud/webhook/screening-pipeline";
const SCHEDULING_WEBHOOK = "https://iitprecruitaiproject.app.n8n.cloud/webhook/schedule-interview";

// Call screening pipeline
const result = await fetch(PIPELINE_WEBHOOK, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resume_text: resumeContent,
    job_description: jobDesc,
    job_id: roleId
  })
});
```

## 📄 License

© 2026 IIT PMRecruit AI. All rights reserved.

## 📞 Contact

For workflow modifications or technical issues, access the editor at:
https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9

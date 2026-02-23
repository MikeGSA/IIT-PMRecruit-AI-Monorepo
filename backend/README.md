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
    [Pipeline Webhook]
    (POST /screening-pipeline)
        ↓
┌──────────────────────────────────────────┐
│  Agent 1: Document Parser                │
│  (Google Gemini LLM)                     │
│  - Extract structured candidate data     │
│  - Parse skills & experience             │
│  - Structured JSON output                │
└──────────────────────────────────────────┘
        ↓
    [Parse Agent 1 Output]
    (Node.js Code Node)
    - JSON validation & error handling
        ↓
┌──────────────────────────────────────────┐
│  Agent 2: Skill Matcher                  │
│  (Google Gemini LLM)                     │
│  - Score against job requirements        │
│  - Calculate fit score (0-100)           │
│  - Identify strengths & gaps             │
└──────────────────────────────────────────┘
        ↓
    [Calculate Score]
    (Node.js Code Node)
    - Weighted scoring algorithm
    - Route decision logic
        ↓
    ┌──────────────────────────────────┐
    │ IF — Qualified?                  │
    │ (Score ≥ 70)                     │
    └──────────────────────────────────┘
    │                                  │
    ↓ true                            ↓ false
    │                                  │
    ↓                           ┌──────────────────────┐
    │                           │  IF — Rejected?      │
    │                           │  (Score < 60)        │
    │                           └──────────────────────┘
    │                           │                   │
    ↓                      ↓ true            ↓ false
    │                      │                │
┌────────────────┐   ┌─────────────┐  ┌──────────────────┐
│ Agent 3:       │   │ Agent 2b:   │  │ Respond:         │
│ Get Calendar   │   │ Draft       │  │ Borderline       │
│ Find Slots     │   │ Rejection   │  │ (Manual Review)  │
│ Draft Email    │   │ Email       │  └──────────────────┘
│ Send Email     │   │ Send Email  │
│ Schedule       │   │ Respond     │
│ Interview      │   └─────────────┘
└────────────────┘
     ↓
[Respond — Qualified]
(scheduling email sent)
```

### Node Details

| Node | Type | Purpose |
|------|------|---------|
| Pipeline Webhook | Webhook | Receives resume & job data (POST /screening-pipeline) |
| Agent 1 — Document Parser | LangChain + Gemini | Extracts candidate info into structured JSON |
| Parse Agent 1 Output | Node.js Code | Validates Agent 1 JSON, error handling |
| Agent 2 — Skill Matcher | LangChain + Gemini | Scores candidate on 4 dimensions |
| Calculate Score | Node.js Code | Weighted fit_score, routing decision |
| IF — Qualified? | Condition | Routes based on fit_score ≥ 70 |
| IF — Rejected? | Condition | Routes based on fit_score < 60 |
| Agent 3 — Get Calendar | Google Calendar | Fetches busy times from interviewer |
| Agent 3 — Find Slots | Node.js Code | Finds 5 open slots in next 14 days |
| Agent 3 — Draft Schedule Email | LangChain + Gemini | Generates warm interview invitation |
| Agent 3 — Send Schedule Email | Gmail | Emails candidate with slot options |
| Respond — Qualified | Webhook Response | Returns scheduled candidate data |
| Agent 2b — Draft Rejection Email | LangChain + Gemini | Generates personalized rejection |
| Agent 2b — Send Rejection Email | Gmail | Emails rejection with next steps |
| Respond — Rejected | Webhook Response | Returns rejection confirmation |
| Respond — Borderline | Webhook Response | Returns borderline for manual review |

## 🔌 Webhook Endpoints

### 1. Screening Pipeline
**Path**: `/webhook/screening-pipeline`  
**Method**: POST  
**Authentication**: None (webhook URL is private)

Submits a resume and job description for screening through the full pipeline.

**Request Schema**:
```typescript
{
  "resume_text": string;           // Raw resume content
  "job_description": string;       // Job posting or description
  "job_id": string;                // Unique job/role ID
  "interviewer_calendar_id": string; // Google Calendar ID (optional, defaults to "primary")
}
```

**Request Example**:
```bash
curl -X POST https://iitprecruitaiproject.app.n8n.cloud/webhook/screening-pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "JANE DOE\n123 Product Lane, San Francisco, CA | (555) 123-4567 | jane.doe@email.com\n\nData-driven Product Manager with 5+ years of experience...",
    "job_description": "Seeking an experienced Product Manager to lead our core platform roadmap.\n\nRequired:\n- 4+ years of product management at a SaaS company\n- Experience with B2B enterprise products\n- Strong data analysis skills (SQL a plus)",
    "job_id": "role-002",
    "interviewer_calendar_id": "primary"
  }'
```

**Response on Qualified** (fit_score ≥ 70):
```json
{
  "candidate": {
    "name": "Jane Doe",
    "email": "jane.doe@email.com",
    "phone": "(555) 123-4567",
    "location": "San Francisco, CA",
    "current_title": "Senior Product Manager",
    "years_experience": 5,
    "skills": ["Product Roadmapping", "User Research", "Jira", "SQL", "Analytics"],
    "education": {
      "degree": "MBA",
      "institution": "University of California, Berkeley"
    },
    "work_history": [
      {
        "company": "TechCorp Inc.",
        "title": "Senior Product Manager",
        "duration": "2021-Present"
      }
    ],
    "links": {
      "linkedin": "linkedin.com/in/janedoe"
    },
    "soft_skills": ["Leadership", "Stakeholder Communication", "Strategic Thinking"]
  },
  "job_requirements": {
    "must_haves": ["Product Management", "SQL"],
    "nice_to_haves": ["AI/ML experience", "HR Tech background"],
    "experience_years_required": 4,
    "job_title": "Product Manager",
    "department": "Platform"
  },
  "job_id": "role-002",
  "fit_score": 85,
  "status": "Qualified/High",
  "confidence": "High",
  "score_breakdown": {
    "must_haves": 90,
    "experience": 85,
    "adjacency": 80,
    "culture": 85
  },
  "strengths": [
    "5+ years of SaaS product management experience",
    "Strong data analysis and SQL skills",
    "Proven track record launching features at scale"
  ],
  "gaps": [
    "Limited AI/ML product experience",
    "HR Tech background not directly mentioned"
  ],
  "proceed_to_scheduling": true,
  "routing_key": "qualified",
  "available_slots": [
    {
      "start": "2026-02-25T10:00:00Z",
      "end": "2026-02-25T10:45:00Z",
      "display": "Tuesday, February 25 at 10:00 AM ET"
    }
  ],
  "scheduling_email_sent": true,
  "pipeline_stage": "scheduled"
}
```

**Response on Borderline** (fit_score 60-69):
```json
{
  "pipeline_stage": "borderline",
  "fit_score": 65,
  "status": "Borderline",
  "candidate_name": "John Smith",
  "candidate_email": "john@example.com"
}
```

**Response on Rejected** (fit_score < 60):
```json
{
  "pipeline_stage": "rejected",
  "fit_score": 45,
  "status": "Rejected",
  "rejection_email_sent": true,
  "candidate_name": "Alex Johnson",
  "candidate_email": "alex@example.com"
}
```

**HTTP Status Codes**:
| Code | Meaning |
|------|---------|
| 200 | Pipeline executed successfully (check pipeline_stage) |
| 400 | Invalid request payload |
| 408 | Timeout (LLM taking too long) |
| 500 | Server error in workflow |

**Error Response**:
```json
{
  "error": "Agent 1 parse error: missing candidate field",
  "statusCode": 400
}
```

## 🤖 AI Agents

### Agent 1: Document Parser
**Type**: LangChain + Google Gemini LLM  
**Input**: Raw resume text + job description + job ID

Extracts structured candidate information from unformatted resume text using natural language understanding.

**System Prompt**:
> You are Agent 1 — a recruitment data extraction specialist. Given a resume and job description, extract and return ONLY valid JSON (no markdown, no code fences, no explanation)

**Outputs**:
```json
{
  "candidate": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "current_title": "string",
    "years_experience": 0,
    "skills": ["string"],
    "years_experience_per_skill": {},
    "education": {
      "degree": "string",
      "institution": "string",
      "graduation_year": 2020
    },
    "certifications": ["string"],
    "work_history": [
      {
        "company": "string",
        "title": "string",
        "duration": "string"
      }
    ],
    "languages": ["string"],
    "links": {
      "github": "string",
      "linkedin": "string",
      "portfolio": "string"
    },
    "visa_status": "string",
    "soft_skills": ["string"]
  },
  "job_requirements": {
    "must_haves": ["string"],
    "nice_to_haves": ["string"],
    "experience_years_required": 0,
    "culture_keywords": ["string"],
    "job_title": "string",
    "department": "string"
  },
  "job_id": "string"
}
```

---

### Agent 2: Skill Matcher
**Type**: LangChain + Google Gemini LLM  
**Input**: Structured candidate data + job requirements

Evaluates candidate fit against job requirements using a weighted scoring model.

**System Prompt**:
> You are Agent 2 — a recruitment scoring specialist. Score the candidate against job requirements. Return ONLY valid JSON (no markdown, no code fences)

**Scoring Dimensions**:
- **Must-Haves** (0-100): Percentage of required skills matched
- **Experience** (0-100): Years and depth of relevant experience match
- **Adjacency** (0-100): Transferable skills value and relevance
- **Culture Fit** (0-100): Soft skills and company values alignment

**Example Output**:
```json
{
  "score_breakdown": {
    "must_haves": 95,
    "experience": 85,
    "adjacency": 80,
    "culture": 90
  },
  "strengths": [
    "Expert React and TypeScript skills",
    "Strong DevOps background with AWS",
    "Leadership experience managing teams"
  ],
  "gaps": [
    "Limited GraphQL experience",
    "No Kubernetes exposure"
  ],
  "confidence": "High"
}
```

**Calculate Score Logic** (Weighted Average):
```javascript
fit_score = Math.round(
  (must_haves * 0.40) +
  (experience * 0.25) +
  (adjacency * 0.20) +
  (culture * 0.15)
)
```

**Status Routing**:
- **fit_score ≥ 85**: `Qualified/High` → Auto-schedule
- **fit_score ≥ 70**: `Qualified/Medium` → Auto-schedule
- **fit_score ≥ 60**: `Borderline` → Manual review required
- **fit_score < 60**: `Rejected` → Send decline email

---

### Agent 2b: Draft Rejection Email
**Type**: LangChain + Google Gemini LLM  
**Trigger**: When fit_score < 60

Generates personalized, compassionate rejection emails that encourage future applications.

**System Prompt**:
> You are Agent 2b — a compassionate HR assistant writing personalised rejection emails. Rules: under 200 words, warm and encouraging, acknowledge 2 specific strengths, name the exact gaps, suggest 1-2 real learning resources (Coursera/LinkedIn Learning/official docs), invite reapplication in 6 months. Write ONLY the email body — no subject, no greeting, no sign-off.

**Input Data**:
- Candidate name & role applied for
- 2-3 identified strengths (from Agent 2)
- 2-3 identified skill gaps
- Fit score out of 100

**Features**:
- Acknowledges strengths genuinely
- Names specific gaps to guide learning
- Suggests concrete resources for improvement
- Maintains positive tone despite rejection
- Invites reapplication after 6 months

---

### Agent 3: Interview Scheduler
**Type**: Multi-step agent (Calendar API + LLM + Email)  
**Trigger**: When fit_score ≥ 70

Orchestrates interview scheduling for qualified candidates.

#### Step 1: Get Calendar Availability
- **Node**: `Agent 3 — Get Calendar` (Google Calendar API)
- **Query**: 2026-02-23 to 2026-04-30
- **Returns**: List of busy times (events with start/end times)

#### Step 2: Find Available Slots
- **Node**: `Agent 3 — Find Slots` (Node.js Code)
- **Logic**:
  - Looks for slots in next 14 days
  - Avoids weekends (Saturday & Sunday)
  - Prefers times: 9:00, 9:30, 10:00, 10:30, 11:00, 11:30, 1:00, 1:30, 2:00, 2:30, 3:00 PM
  - Each slot = 45 minutes
  - 15-minute buffer between events
  - Returns up to 5 available slots
- **Output**: Array of available times with friendly display format

#### Step 3: Draft Invitation Email
- **Node**: `Agent 3 — Draft Schedule Email` (LangChain + Gemini)
- **System Prompt**:
  > You are Agent 3 — an interview coordinator. Write a warm, professional email inviting the candidate to pick an interview slot. Under 120 words. Write ONLY the email body — no subject, no greeting, no sign-off.
- **Input**: Candidate name, role, list of 5 available slots
- **Output**: Friendly invitation text

#### Step 4: Send Email & Create Event
- **Node**: `Agent 3 — Send Schedule Email` (Gmail)
- **Sends**: Email with candidate's available slots
- **Subject**: "Interview Invitation — [Job Title]"
- **Credentials**: Gmail account integrated in n8n

**Final Response**:
```json
{
  "candidate": {...},
  "job_requirements": {...},
  "fit_score": 85,
  "status": "Qualified/High",
  "available_slots": [
    {
      "start": "2026-02-25T10:00:00Z",
      "end": "2026-02-25T10:45:00Z",
      "display": "Tuesday, February 25 at 10:00 AM ET"
    },
    {
      "start": "2026-02-25T14:00:00Z",
      "end": "2026-02-25T14:45:00Z",
      "display": "Tuesday, February 25 at 2:00 PM ET"
    }
  ],
  "scheduling_email_sent": true,
  "pipeline_stage": "scheduled"
}
```

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

## 🧠 LLM Configuration

The pipeline uses **Google Gemini (formerly PaLM) API** for all agent reasoning:

### LLM Model Assignments
- **Agent 1 (Parser)**: `Google Gemini Chat Model`
- **Agent 2 (Scorer)**: `Google Gemini Chat Model1`
- **Agent 2b (Rejection)**: `Google Gemini Chat Model2`
- **Agent 3 (Scheduler)**: `Google Gemini Chat Model3`

### Why Gemini?
✅ Cost-effective compared to GPT-4  
✅ Strong JSON output capability (no markdown wrappers)  
✅ Fast inference for time-sensitive operations  
✅ Integrated with n8n LangChain nodes  
✅ Supports context windows up to 32K tokens  

### Model Configuration in n8n
```
Service: Google PaLM/Gemini API
Credentials: googlePalmApi
API Key: [stored securely in n8n]
```

### Alternative Models
You can swap these nodes for alternatives:
- **OpenAI GPT-4**: More expensive but higher accuracy
- **Claude**: Better reasoning but higher cost
- **Llama 2**: Self-hosted option for privacy

To change models:
1. Edit the specific LLM node in n8n
2. Update credentials and model selection
3. Test with sample resumes
4. Verify JSON output format still works

## 🚀 Quick Start

### Prerequisites
- n8n instance: https://iitprecruitaiproject.app.n8n.cloud
- Google Gemini API credentials (for Agents 1, 2, 2b, 3)
- Google Calendar API (for Agent 3 calendar queries)
- Gmail account (for sending emails)

### Initial Setup Checklist
- [ ] Access workflow editor: https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9
- [ ] Verify all 4 Gemini LLM nodes are connected to credentials
- [ ] Connect Google Calendar API for interviewer calendar
- [ ] Connect Gmail account for email sending
- [ ] Activate webhooks in workflow settings
- [ ] Note webhook URLs for frontend integration:
  - Test: `https://iitprecruitaiproject.app.n8n.cloud/webhook/test/screening-pipeline`
  - Prod: `https://iitprecruitaiproject.app.n8n.cloud/webhook/screening-pipeline`
- [ ] Test with sample resume (see Testing section)

## 🧪 Testing Webhooks

### Test Screening Pipeline
Submit a test resume and job description to the screening pipeline.

```bash
curl -X POST https://iitprecruitaiproject.app.n8n.cloud/webhook/screening-pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "JANE DOE\n123 Product Lane, San Francisco, CA | (555) 123-4567 | jane.doe@email.com\n\nPROFESSIONAL SUMMARY\nData-driven Product Manager with 5+ years of experience leading cross-functional teams to build high-impact SaaS products. Successfully drove user growth by 35% and increased retention by 20% in previous role.\n\nTECHNICAL SKILLS\nProduct Management: Roadmapping, User Research, A/B Testing, Sprint Planning\nTools: Jira, Mixpanel, SQL, Asana, Google Analytics, Figma\nMethodologies: Agile, Scrum, Kanban\n\nPROFESSIONAL EXPERIENCE\nSENIOR PRODUCT MANAGER | TechCorp Inc., San Francisco, CA | 2021 – Present\nLed product strategy for analytics platform, resulting in 40% increase in user engagement.\nManaged end-to-end product lifecycle for three major features.\nConducted 50+ user interviews to redefine product roadmap.\n\nPRODUCT MANAGER | Startup Solutions, San Jose, CA | 2018 – 2021\nDrove mobile app feature development, boosting active users by 35% in 6 months.\n\nEDUCATION\nMBA | University of California, Berkeley\nB.S. in Computer Science | Stanford University",
    "job_description": "Seeking an experienced Product Manager to lead our core platform roadmap.\n\nRequired:\n- 4+ years of product management at a SaaS company\n- Experience with B2B enterprise products\n- Strong data analysis skills (SQL a plus)\n- Proven track record shipping features at scale\n- Excellent stakeholder communication\n\nNice to have:\n- Technical background or engineering experience\n- Experience with AI/ML products\n- Background in HR Tech or Recruiting tools\n\nCulture: Outcome-driven, direct communication, no ego.",
    "job_id": "role-002",
    "interviewer_calendar_id": "primary"
  }'
```

**Expected Response** (Qualified candidate):
```json
{
  "candidate": {
    "name": "Jane Doe",
    "email": "jane.doe@email.com",
    "phone": "(555) 123-4567",
    "location": "San Francisco, CA",
    "current_title": "Senior Product Manager",
    "years_experience": 5,
    "skills": ["Product Roadmapping", "User Research", "SQL", "Jira", "Analytics"],
    ...
  },
  "fit_score": 85,
  "status": "Qualified/High",
  "pipeline_stage": "scheduled",
  "scheduling_email_sent": true
}
```

### Using Postman or Insomnia
1. Create new POST request
2. URL: `https://iitprecruitaiproject.app.n8n.cloud/webhook/screening-pipeline`
3. Header: `Content-Type: application/json`
4. Body (raw JSON): Copy the request from above
5. Click Send
6. Check response status and pipeline_stage

### Test in n8n Dashboard
1. Go to https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9
2. Click "Test webhook" button
3. Paste sample resume JSON
4. Click "Send Test Data"
5. View execution logs in real-time
6. Check each agent's input/output in node details

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

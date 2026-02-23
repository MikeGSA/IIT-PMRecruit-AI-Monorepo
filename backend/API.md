# API Reference - IIT PMRecruit AI Backend

Complete API specification for the n8n workflow webhooks.

## Base URL
```
https://iitprecruitaiproject.app.n8n.cloud
```

## Endpoints

### POST /webhook/screening-pipeline

Processes a candidate resume through the full AI screening pipeline.

#### Request

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "resume_text": "string (required) - Raw resume text content",
  "job_description": "string (required) - Job posting text",
  "job_id": "string (required) - Unique job identifier",
  "interviewer_calendar_id": "string (optional) - Google Calendar ID, defaults to 'primary'"
}
```

#### Response

**Status**: 200 OK

**Body**:
```json
{
  "candidate": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "current_title": "string",
    "years_experience": "number",
    "skills": ["string"],
    "years_experience_per_skill": {
      "skill_name": "number"
    },
    "education": {
      "degree": "string",
      "institution": "string",
      "graduation_year": "number"
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
      "github": "string (optional)",
      "linkedin": "string (optional)",
      "portfolio": "string (optional)"
    },
    "visa_status": "string",
    "soft_skills": ["string"]
  },
  "job_requirements": {
    "must_haves": ["string"],
    "nice_to_haves": ["string"],
    "experience_years_required": "number",
    "culture_keywords": ["string"],
    "job_title": "string",
    "department": "string",
    "salary_range": {
      "min": "number",
      "max": "number"
    }
  },
  "job_id": "string",
  "fit_score": "number (0-100)",
  "status": "Qualified/High | Qualified/Medium | Borderline | Rejected",
  "confidence": "High | Medium | Low",
  "score_breakdown": {
    "must_haves": "number",
    "experience": "number",
    "adjacency": "number",
    "culture": "number"
  },
  "strengths": ["string"],
  "gaps": ["string"],
  "proceed_to_scheduling": "boolean",
  "scheduled_time": "string (ISO 8601, optional)"
}
```

#### Error Responses

**400 Bad Request**:
```json
{
  "error": "Missing required field: resume_text"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Failed to parse resume",
  "details": "string"
}
```

---

### POST /webhook/schedule-interview

Schedules an interview for a qualified candidate.

#### Request

**Headers**:
```
Content-Type: application/json
```

**Body**:
```json
{
  "candidate_email": "string (required) - Candidate email address",
  "candidate_name": "string (required) - Candidate full name",
  "job_title": "string (required) - Job position title",
  "job_id": "string (required) - Unique job identifier",
  "interviewer_calendar_id": "string (optional) - Google Calendar ID, defaults to 'primary'"
}
```

#### Response

**Status**: 200 OK

**Body**:
```json
{
  "available_slots": [
    {
      "start": "string (ISO 8601)",
      "end": "string (ISO 8601)",
      "display": "string (human-readable format)"
    }
  ],
  "candidate_name": "string",
  "candidate_email": "string",
  "job_title": "string"
}
```

**Example Response**:
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
    },
    {
      "start": "2026-02-26T09:00:00Z",
      "end": "2026-02-26T10:00:00Z",
      "display": "Wednesday, February 26 at 9:00 AM ET"
    }
  ],
  "candidate_name": "John Doe",
  "candidate_email": "john@example.com",
  "job_title": "Senior Frontend Engineer"
}
```

#### Error Responses

**400 Bad Request**:
```json
{
  "error": "Invalid email format: candidate_email"
}
```

**503 Service Unavailable**:
```json
{
  "error": "Google Calendar API not available",
  "details": "Please check calendar integration"
}
```

---

## Status Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | Success | Webhook executed successfully |
| 400 | Bad Request | Invalid payload or missing fields |
| 401 | Unauthorized | Invalid authentication (if enabled) |
| 500 | Server Error | Unhandled error in workflow |
| 503 | Service Unavailable | External service (Google, OpenAI) down |

## Rate Limiting

Currently no rate limiting is enforced. Future versions may implement:
- Per-minute request limits
- Per-day quota per job_id
- Concurrent request limits

## Scoring Algorithm

### Fit Score Calculation (0-100)

```
Final Score = 
  (must_haves_score × 0.40) +
  (experience_score × 0.25) +
  (adjacency_score × 0.20) +
  (culture_score × 0.15)

Where each component is scored 0-100
```

### Status Decision Tree

```
if fit_score >= 80:
  status = "Qualified/High"
else if fit_score >= 65:
  status = "Qualified/Medium"
else if fit_score >= 50:
  status = "Borderline"
else:
  status = "Rejected"

proceed_to_scheduling = (fit_score >= 65)
```

## Payload Examples

### Example 1: Screening Pipeline Request
```bash
curl -X POST https://iitprecruitaiproject.app.n8n.cloud/webhook/screening-pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "JOHN DOE\njohn.doe@email.com | 555-0123\n\nEXPERIENCE\nSenior Frontend Engineer at Tech Corp (2022-Present, 2 years)\n- Led React migration project\n- Reduced bundle size by 40%\n- Mentored 3 junior developers\n\nFrontend Engineer at StartupXYZ (2020-2022, 2 years)\n- Built responsive UI with React and TypeScript\n- Implemented state management with Redux\n\nSKILLS\nReact, TypeScript, Node.js, JavaScript, CSS3, HTML5, AWS, GraphQL, REST APIs\n\nEDUCATION\nBS Computer Science, UC Berkeley, 2018\n\nLINKS\nGitHub: github.com/johndoe\nLinkedIn: linkedin.com/in/johndoe",
    "job_description": "Senior Frontend Engineer\n\nWe are looking for a Senior Frontend Engineer with 5+ years of experience.\n\nRequired Skills:\n- React\n- TypeScript\n- Node.js\n- 5+ years experience\n\nNice to Have:\n- AWS\n- GraphQL\n- Team leadership\n\nCulture:\nCollaborative, fast-paced, user-focused",
    "job_id": "role-001"
  }'
```

### Example 2: Scheduling Request
```bash
curl -X POST https://iitprecruitaiproject.app.n8n.cloud/webhook/schedule-interview \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_email": "john.doe@email.com",
    "candidate_name": "John Doe",
    "job_title": "Senior Frontend Engineer",
    "job_id": "role-001"
  }'
```

## Response Time SLA

- **Screening Pipeline**: 30-60 seconds (depends on OpenAI API)
- **Interview Scheduling**: 5-10 seconds (depends on Google Calendar API)

## Troubleshooting

### "OpenAI API Error"
- Check API key is valid
- Check API quota hasn't been exceeded
- Ensure resume text is not empty

### "Google Calendar API Error"
- Verify Google Calendar API is enabled
- Check service account credentials
- Ensure calendar_id is correct format

### "Email Not Sent"
- Verify SMTP credentials in n8n
- Check recipient email is valid
- Review n8n execution logs

## Webhook Security

Currently webhooks are public. To secure:
1. Enable webhook authentication in n8n
2. Add IP whitelisting
3. Use ngrok or similar for tunneling
4. Implement request signing with HMAC-SHA256

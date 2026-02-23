# Setup & Configuration Guide

Complete guide to setting up and configuring the IIT PMRecruit AI backend.

## Prerequisites

- n8n account: https://iitprecruitaiproject.app.n8n.cloud
- OpenAI API key (ChatGPT-4 or better)
- Google Cloud project with Calendar API enabled
- SMTP credentials (for email notifications)

## Step 1: Access the Workflow

1. Go to: https://iitprecruitaiproject.app.n8n.cloud
2. Login with your credentials
3. Navigate to: Workflows → IIT PMRecruit AI
4. Open the workflow: https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9

## Step 2: Configure Environment Variables

In n8n, set the following credentials and variables:

### OpenAI Configuration

1. Click "Credentials" in the left sidebar
2. Create a new credential of type "OpenAI"
3. Add your OpenAI API key
4. Save and test connection

**Required for**:
- Agent 1: Resume parsing with GPT-4
- Agent 2: Candidate scoring logic

### Google Calendar Configuration

1. Create a Google Cloud project
2. Enable Calendar API
3. Create a service account
4. Download JSON key file
5. In n8n, create Google Calendar credential
6. Upload the JSON key
7. Test connection to your calendar

**Required for**:
- Agent 3: Finding available interview slots

### Email (SMTP) Configuration

1. In n8n, create SMTP credential
2. Add email provider settings:

**Gmail**:
```
Host: smtp.gmail.com
Port: 587
User: your-email@gmail.com
Password: your-app-password (not regular password)
```

**Other providers**: Configure accordingly

**Required for**:
- Agent 3: Sending interview invitations
- Agent 2b: Sending rejection emails

## Step 3: Configure Webhook Nodes

The workflow contains two webhook endpoints that need configuration:

### Webhook 1: Screening Pipeline

1. In the workflow, find the "Screening Pipeline" webhook node
2. Configure:
   - **Path**: `/webhook/screening-pipeline`
   - **Method**: POST
   - **Response Mode**: First Successful Response
3. Activate the webhook

### Webhook 2: Interview Scheduling

1. Find the "Schedule Interview" webhook node
2. Configure:
   - **Path**: `/webhook/schedule-interview`
   - **Method**: POST
   - **Response Mode**: First Successful Response
3. Activate the webhook

## Step 4: Set Workflow Variables

In the workflow settings, define these variables:

```
OPENAI_MODEL=gpt-4
CALENDAR_ID=your-calendar-id@gmail.com
SCORING_THRESHOLD_QUALIFIED=65
SCORING_THRESHOLD_BORDERLINE=50
```

## Step 5: Configure AI Agents

### Agent 1: Resume Parser

Edit the OpenAI chat node for resume parsing:

**System Prompt**:
```
You are a professional recruiter with 20 years of experience.
Your task is to extract structured information from a resume.

Extract the following information and return as JSON:
- Full name
- Email
- Phone
- Current job title
- Years of experience
- List of skills with years of experience each
- Education (degree, institution, year)
- Certifications
- Work history (company, title, duration)
- Languages
- Links (github, linkedin, portfolio)
- Visa status
- Soft skills

Be thorough and accurate. If information is not available, use null.
```

**Temperature**: 0.3 (for consistent parsing)

### Agent 2: Candidate Scorer

Edit the OpenAI chat node for scoring:

**System Prompt**:
```
You are an expert talent acquisition specialist.
Your task is to evaluate a candidate's fit for a specific job role.

Analyze the candidate profile against job requirements using these weighted criteria:
1. Must-Have Skills Match (40% weight)
2. Experience Level & Depth (25% weight)
3. Adjacent Skills & Learning Ability (20% weight)
4. Cultural Fit & Soft Skills (15% weight)

Score each dimension from 0-100, then calculate weighted total.

Determine status:
- Qualified/High: >= 80
- Qualified/Medium: 65-79
- Borderline: 50-64
- Rejected: < 50

Also provide:
- List of strengths
- List of gaps/areas for improvement
- Confidence level (High/Medium/Low)

Return as JSON.
```

**Temperature**: 0.3

### Agent 3: Interview Scheduler

Configure the Google Calendar integration:

1. Set the calendar to check
2. Define business hours: 9 AM - 5 PM
3. Set timezone: ET (Eastern Time)
4. Block existing events
5. Create 1-hour meeting slots

### Agent 2b: Rejection Email

Configure the SMTP email node:

**Subject Template**:
```
Update on Your [JOB_TITLE] Application
```

**Body Template**:
```
Dear [CANDIDATE_NAME],

Thank you for applying for the [JOB_TITLE] position at our company. 
We appreciate the time you invested in your application.

[PERSONALIZED_FEEDBACK_BASED_ON_GAPS]

While we won't be moving forward at this time, we encourage you to 
apply for future opportunities that may be a better fit for your skills.

Best of luck with your career!

Best regards,
IIT PMRecruit AI Recruitment Team
```

## Step 6: Test the Workflow

### Test Resume Parsing (Agent 1)

1. In the workflow, click "Test"
2. In the "Screening Pipeline" webhook node, send:

```json
{
  "resume_text": "John Doe\njohn@example.com\n\nSoftware Engineer with 5 years of experience in React and TypeScript.\n\nSkills: React, TypeScript, Node.js, AWS\n\nEducation: BS Computer Science, UC Berkeley 2018",
  "job_description": "Senior Frontend Engineer - Need React, TypeScript, 5+ years experience",
  "job_id": "test-001"
}
```

3. Verify Agent 1 extracts data correctly
4. Check output in execution history

### Test Candidate Scoring (Agent 2)

1. Continue test with Agent 1 output
2. Verify score is calculated (should be ~85 for this example)
3. Check status is "Qualified/High"

### Test Scheduling (Agent 3)

1. Only runs if score >= 65
2. Check Google Calendar connection
3. Verify available slots are returned

### Test Rejection Email (Agent 2b)

1. Modify test data to get score < 50
2. Verify rejection email is drafted
3. Check email preview in execution

## Step 7: Monitor Executions

1. In the workflow, click "Executions"
2. View all webhook calls
3. Click any execution to see:
   - Request payload
   - Response data
   - Errors (if any)
   - Execution time

## Deployment Checklist

- [ ] OpenAI API credentials configured
- [ ] Google Calendar API enabled and configured
- [ ] SMTP credentials configured
- [ ] Webhook paths configured
- [ ] All nodes tested and working
- [ ] Error handling configured
- [ ] Logging enabled
- [ ] Frontend webhook URLs updated
- [ ] Backup created of workflow

## Production Configuration

### Enable Webhook Authentication

For security, enable request validation:

1. In workflow settings, enable "Webhook Auth"
2. Generate API key
3. Share API key with frontend team
4. Frontend must send key in header:

```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_API_KEY'
}
```

### Set Up Monitoring

1. Enable n8n alerts:
   - Slack notifications for failed executions
   - Email reports on performance metrics
2. Monitor API quotas:
   - OpenAI token usage
   - Google Calendar rate limits

### Performance Optimization

1. Set request timeout: 120 seconds
2. Enable retries: 3 attempts
3. Cache candidate profiles (24 hours)
4. Batch process resumes if possible

## Troubleshooting

### "Invalid OpenAI API Key"
- Check key is copied correctly
- Verify key has not expired
- Check account has available credits

### "Calendar API Error"
- Verify service account has calendar access
- Check calendar_id format
- Ensure API is enabled in Google Cloud Console

### "Email Send Failed"
- Test SMTP credentials with external tool
- Check recipient email is valid
- Review spam folder for test emails

### "Timeout on GPT-4 Response"
- Increase timeout value
- Check OpenAI API status
- Reduce resume/job description length

## Support

For technical support or workflow modifications:
1. Check n8n documentation: https://docs.n8n.io
2. Access workflow editor: https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9
3. Review execution logs for errors
4. Test webhook endpoints with curl

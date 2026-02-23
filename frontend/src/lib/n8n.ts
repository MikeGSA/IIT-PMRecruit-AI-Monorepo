/**
 * n8n.ts — API layer for the unified multi-agent pipeline.
 *
 * Calls local Next.js API routes (/api/screen, /api/schedule) which
 * proxy to n8n server-side, avoiding CORS issues in the browser.
 */

import type { ScreeningResult, SchedulingResult } from '@/types';

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateWebhookUrls(): { valid: boolean; error?: string } {
  if (!process.env.NEXT_PUBLIC_N8N_PIPELINE_WEBHOOK) {
    return { valid: false, error: 'NEXT_PUBLIC_N8N_PIPELINE_WEBHOOK not configured' };
  }
  if (!process.env.NEXT_PUBLIC_N8N_SCHEDULING_WEBHOOK) {
    return { valid: false, error: 'NEXT_PUBLIC_N8N_SCHEDULING_WEBHOOK not configured' };
  }
  return { valid: true };
}

// ─── Full Multi-Agent Pipeline ────────────────────────────────────────────────

export interface RunPipelinePayload {
  resume_text:              string;
  job_description:          string;
  job_id:                   string;
  interviewer_calendar_id?: string;
}

export async function runPipeline(payload: RunPipelinePayload): Promise<ScreeningResult> {
  if (!payload.resume_text?.trim()) throw new Error('Resume text is required');
  if (!payload.job_description?.trim()) throw new Error('Job description is required');

  const res = await fetch('/api/screen', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      interviewer_calendar_id: payload.interviewer_calendar_id ?? 'primary',
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Pipeline failed (${res.status})`);
  return data as ScreeningResult;
}

// ─── Standalone Scheduling ────────────────────────────────────────────────────

export interface ScheduleInterviewPayload {
  candidate_email:          string;
  candidate_name:           string;
  job_title:                string;
  job_id:                   string;
  interviewer_calendar_id?: string;
}

export async function scheduleInterview(
  payload: ScheduleInterviewPayload
): Promise<SchedulingResult> {
  if (!payload.candidate_email?.trim()) throw new Error('Candidate email is required');
  if (!payload.candidate_name?.trim()) throw new Error('Candidate name is required');

  const res = await fetch('/api/schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      interviewer_calendar_id: payload.interviewer_calendar_id ?? 'primary',
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Scheduling failed (${res.status})`);
  return data as SchedulingResult;
}

/**
 * Static Data
 * ===========
 * Data that doesn't require database access.
 * Safe to import in client components.
 */

import type { Stage, StageInfo, EmailTemplate } from "@/types";

export const STAGES: StageInfo[] = [
  {
    id: "applied",
    label: "Applied",
    description: "New applications awaiting initial review",
    color: "stage-applied",
  },
  {
    id: "review",
    label: "Under Review",
    description: "Applications being evaluated by the hiring team",
    color: "stage-review",
  },
  {
    id: "interview",
    label: "Interview",
    description: "Candidates in the interview process",
    color: "stage-interview",
  },
  {
    id: "offer",
    label: "Offer",
    description: "Candidates who have received an offer",
    color: "stage-offer",
  },
  {
    id: "rejected",
    label: "Rejected",
    description: "Candidates who were not selected",
    color: "stage-rejected",
  },
];

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "template-review",
    name: "Application Received",
    subject: "Thanks for applying to {{role}} at Talent Flow",
    body: `Dear {{firstName}},

Thank you for your interest in the {{role}} position at Talent Flow. We've received your application and our team is currently reviewing it.

We appreciate the time you took to apply and will be in touch within the next 1-2 weeks with an update on your application status.

Best regards,
The Talent Flow Team`,
    stage: "review",
  },
  {
    id: "template-interview",
    name: "Interview Invitation",
    subject: "Interview Invitation - {{role}} at Talent Flow",
    body: `Dear {{firstName}},

Great news! After reviewing your application for the {{role}} position, we'd love to invite you for an interview.

Please let us know your availability for the coming week, and we'll schedule a time that works for you.

We look forward to speaking with you!

Best regards,
The Talent Flow Team`,
    stage: "interview",
  },
  {
    id: "template-offer",
    name: "Offer Letter",
    subject: "Job Offer - {{role}} at Talent Flow",
    body: `Dear {{firstName}},

We are thrilled to offer you the position of {{role}} at Talent Flow!

Your skills, experience, and enthusiasm made a strong impression on our team, and we believe you'll be a fantastic addition.

Please find the formal offer details attached. We'd appreciate your response within 5 business days.

Welcome aboard!

Best regards,
The Talent Flow Team`,
    stage: "offer",
  },
  {
    id: "template-rejected",
    name: "Application Update",
    subject: "Update on your {{role}} application at Talent Flow",
    body: `Dear {{firstName}},

Thank you for your interest in the {{role}} position at Talent Flow and for taking the time to apply.

After careful consideration, we've decided to move forward with other candidates whose experience more closely matches our current needs.

We encourage you to apply for future openings that match your skills. We'll keep your resume on file for potential opportunities.

We wish you the best in your job search.

Best regards,
The Talent Flow Team`,
    stage: "rejected",
  },
];

export function getStages(): StageInfo[] {
  return STAGES;
}

export function getEmailTemplates(): EmailTemplate[] {
  return EMAIL_TEMPLATES;
}

export function getEmailTemplateForStage(stage: Stage): EmailTemplate | undefined {
  return EMAIL_TEMPLATES.find((t) => t.stage === stage);
}

export function getCurrentUser() {
  return {
    id: "user-1",
    name: "Sarah Chen",
    email: "sarah.chen@rspca.org.uk",
    role: "admin",
  };
}


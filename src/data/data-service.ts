/**
 * Data Service Layer
 * ==================
 * Provides CRUD operations for the recruitment platform.
 * Uses Prisma with PostgreSQL for persistent data storage.
 * 
 * NOTE: This file can only be imported by server components/actions.
 */

import "server-only";
import { prisma } from "@/lib/db";
import type { Role, Candidate, Note, Score, Stage, StageInfo, ScoreCategory, EmailTemplate } from "@/types";
import { RoleType, RoleStatus, NoteType, Stage as PrismaStage } from "@prisma/client";

// ============================================
// TYPE CONVERTERS
// ============================================

function mapRoleType(type: RoleType): Role["type"] {
  const mapping: Record<RoleType, Role["type"]> = {
    full_time: "full-time",
    part_time: "part-time",
    contract: "contract",
    internship: "internship",
  };
  return mapping[type];
}

function mapRoleTypeToDb(type: Role["type"]): RoleType {
  const mapping: Record<Role["type"], RoleType> = {
    "full-time": RoleType.full_time,
    "part-time": RoleType.part_time,
    contract: RoleType.contract,
    internship: RoleType.internship,
  };
  return mapping[type];
}

function mapRoleStatus(status: RoleStatus): Role["status"] {
  return status as Role["status"];
}

function mapRoleStatusToDb(status: Role["status"]): RoleStatus {
  return status as RoleStatus;
}

function mapNoteType(type: NoteType): Note["type"] {
  return type as Note["type"];
}

function mapNoteTypeToDb(type: Note["type"]): NoteType {
  return type as NoteType;
}

// ============================================
// ROLES
// ============================================

export async function getRoles(): Promise<Role[]> {
  const dbRoles = await prisma.role.findMany({
    orderBy: { createdAt: "desc" },
  });

  return dbRoles.map((r) => ({
    id: r.id,
    title: r.title,
    department: r.department,
    location: r.location,
    type: mapRoleType(r.type),
    description: r.description,
    requirements: r.requirements,
    salary: r.salaryMin && r.salaryMax
      ? { min: r.salaryMin, max: r.salaryMax, currency: r.salaryCurrency || "USD" }
      : undefined,
    status: mapRoleStatus(r.status),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function getRoleById(id: string): Promise<Role | null> {
  const r = await prisma.role.findUnique({
    where: { id },
  });

  if (!r) return null;

  return {
    id: r.id,
    title: r.title,
    department: r.department,
    location: r.location,
    type: mapRoleType(r.type),
    description: r.description,
    requirements: r.requirements,
    salary: r.salaryMin && r.salaryMax
      ? { min: r.salaryMin, max: r.salaryMax, currency: r.salaryCurrency || "USD" }
      : undefined,
    status: mapRoleStatus(r.status),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export async function getOpenRoles(): Promise<Role[]> {
  const dbRoles = await prisma.role.findMany({
    where: { status: RoleStatus.open },
    orderBy: { createdAt: "desc" },
  });

  return dbRoles.map((r) => ({
    id: r.id,
    title: r.title,
    department: r.department,
    location: r.location,
    type: mapRoleType(r.type),
    description: r.description,
    requirements: r.requirements,
    salary: r.salaryMin && r.salaryMax
      ? { min: r.salaryMin, max: r.salaryMax, currency: r.salaryCurrency || "USD" }
      : undefined,
    status: mapRoleStatus(r.status),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));
}

export async function createRole(
  roleData: Omit<Role, "id" | "createdAt" | "updatedAt">
): Promise<Role> {
  const r = await prisma.role.create({
    data: {
      title: roleData.title,
      department: roleData.department,
      location: roleData.location,
      type: mapRoleTypeToDb(roleData.type),
      description: roleData.description,
      requirements: roleData.requirements,
      salaryMin: roleData.salary?.min,
      salaryMax: roleData.salary?.max,
      salaryCurrency: roleData.salary?.currency || "USD",
      status: mapRoleStatusToDb(roleData.status),
    },
  });

  return {
    id: r.id,
    title: r.title,
    department: r.department,
    location: r.location,
    type: mapRoleType(r.type),
    description: r.description,
    requirements: r.requirements,
    salary: r.salaryMin && r.salaryMax
      ? { min: r.salaryMin, max: r.salaryMax, currency: r.salaryCurrency || "USD" }
      : undefined,
    status: mapRoleStatus(r.status),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export async function updateRole(
  id: string,
  updates: Partial<Role>
): Promise<Role | null> {
  try {
    const r = await prisma.role.update({
      where: { id },
      data: {
        ...(updates.title && { title: updates.title }),
        ...(updates.department && { department: updates.department }),
        ...(updates.location && { location: updates.location }),
        ...(updates.type && { type: mapRoleTypeToDb(updates.type) }),
        ...(updates.description && { description: updates.description }),
        ...(updates.requirements && { requirements: updates.requirements }),
        ...(updates.salary && {
          salaryMin: updates.salary.min,
          salaryMax: updates.salary.max,
          salaryCurrency: updates.salary.currency,
        }),
        ...(updates.status && { status: mapRoleStatusToDb(updates.status) }),
      },
    });

    return {
      id: r.id,
      title: r.title,
      department: r.department,
      location: r.location,
      type: mapRoleType(r.type),
      description: r.description,
      requirements: r.requirements,
      salary: r.salaryMin && r.salaryMax
        ? { min: r.salaryMin, max: r.salaryMax, currency: r.salaryCurrency || "USD" }
        : undefined,
      status: mapRoleStatus(r.status),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  } catch {
    return null;
  }
}

// ============================================
// CANDIDATES
// ============================================

export async function getCandidates(): Promise<Candidate[]> {
  const dbCandidates = await prisma.candidate.findMany({
    include: {
      notes: true,
      scores: {
        include: { category: true },
      },
      questionAnswers: true,
    },
    orderBy: { appliedAt: "desc" },
  });

  return dbCandidates.map((c) => ({
    id: c.id,
    roleId: c.roleId,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone || undefined,
    linkedIn: c.linkedIn || undefined,
    portfolio: c.portfolio || undefined,
    resumeUrl: c.resumeUrl || undefined,
    coverLetter: c.coverLetter || undefined,
    stage: c.stage as Stage,
    tags: c.tags,
    appliedAt: c.appliedAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    questionAnswers: c.questionAnswers?.length > 0
      ? c.questionAnswers.map((qa) => ({
          questionId: qa.questionId,
          question: "", // Question text would come from role.questions
          answer: qa.answer,
        }))
      : undefined,
    notes: c.notes.map((n) => ({
      id: n.id,
      candidateId: n.candidateId,
      authorId: n.authorId,
      authorName: n.authorName,
      content: n.content,
      type: mapNoteType(n.type),
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
    })),
    scores: c.scores.map((s) => ({
      id: s.id,
      candidateId: s.candidateId,
      categoryId: s.categoryId,
      categoryName: s.category.name,
      value: s.value,
      maxValue: s.category.maxScore,
      evaluatorId: s.evaluatorId,
      evaluatorName: s.evaluatorName,
      comment: s.comment || undefined,
      createdAt: s.createdAt.toISOString(),
    })),
  }));
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  const c = await prisma.candidate.findUnique({
    where: { id },
    include: {
      notes: true,
      scores: {
        include: { category: true },
      },
      questionAnswers: {
        include: { question: true },
      },
    },
  });

  if (!c) return null;

  return {
    id: c.id,
    roleId: c.roleId,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone || undefined,
    linkedIn: c.linkedIn || undefined,
    portfolio: c.portfolio || undefined,
    resumeUrl: c.resumeUrl || undefined,
    coverLetter: c.coverLetter || undefined,
    stage: c.stage as Stage,
    tags: c.tags,
    appliedAt: c.appliedAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    questionAnswers: c.questionAnswers.map((qa) => ({
      questionId: qa.questionId,
      question: qa.question.question,
      answer: qa.answer,
    })),
    notes: c.notes.map((n) => ({
      id: n.id,
      candidateId: n.candidateId,
      authorId: n.authorId,
      authorName: n.authorName,
      content: n.content,
      type: mapNoteType(n.type),
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
    })),
    scores: c.scores.map((s) => ({
      id: s.id,
      candidateId: s.candidateId,
      categoryId: s.categoryId,
      categoryName: s.category.name,
      value: s.value,
      maxValue: s.category.maxScore,
      evaluatorId: s.evaluatorId,
      evaluatorName: s.evaluatorName,
      comment: s.comment || undefined,
      createdAt: s.createdAt.toISOString(),
    })),
  };
}

export async function getCandidatesByRole(roleId: string): Promise<Candidate[]> {
  const dbCandidates = await prisma.candidate.findMany({
    where: { roleId },
    include: {
      notes: true,
      scores: { include: { category: true } },
    },
    orderBy: { appliedAt: "desc" },
  });

  return dbCandidates.map((c) => ({
    id: c.id,
    roleId: c.roleId,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone || undefined,
    linkedIn: c.linkedIn || undefined,
    portfolio: c.portfolio || undefined,
    resumeUrl: c.resumeUrl || undefined,
    coverLetter: c.coverLetter || undefined,
    stage: c.stage as Stage,
    tags: c.tags,
    appliedAt: c.appliedAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    notes: c.notes.map((n) => ({
      id: n.id,
      candidateId: n.candidateId,
      authorId: n.authorId,
      authorName: n.authorName,
      content: n.content,
      type: mapNoteType(n.type),
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
    })),
    scores: c.scores.map((s) => ({
      id: s.id,
      candidateId: s.candidateId,
      categoryId: s.categoryId,
      categoryName: s.category.name,
      value: s.value,
      maxValue: s.category.maxScore,
      evaluatorId: s.evaluatorId,
      evaluatorName: s.evaluatorName,
      comment: s.comment || undefined,
      createdAt: s.createdAt.toISOString(),
    })),
  }));
}

export async function getCandidatesByStage(stage: Stage): Promise<Candidate[]> {
  const dbCandidates = await prisma.candidate.findMany({
    where: { stage: stage as PrismaStage },
    include: {
      notes: true,
      scores: { include: { category: true } },
    },
    orderBy: { appliedAt: "desc" },
  });

  return dbCandidates.map((c) => ({
    id: c.id,
    roleId: c.roleId,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone || undefined,
    linkedIn: c.linkedIn || undefined,
    portfolio: c.portfolio || undefined,
    resumeUrl: c.resumeUrl || undefined,
    coverLetter: c.coverLetter || undefined,
    stage: c.stage as Stage,
    tags: c.tags,
    appliedAt: c.appliedAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    notes: c.notes.map((n) => ({
      id: n.id,
      candidateId: n.candidateId,
      authorId: n.authorId,
      authorName: n.authorName,
      content: n.content,
      type: mapNoteType(n.type),
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
    })),
    scores: c.scores.map((s) => ({
      id: s.id,
      candidateId: s.candidateId,
      categoryId: s.categoryId,
      categoryName: s.category.name,
      value: s.value,
      maxValue: s.category.maxScore,
      evaluatorId: s.evaluatorId,
      evaluatorName: s.evaluatorName,
      comment: s.comment || undefined,
      createdAt: s.createdAt.toISOString(),
    })),
  }));
}

export async function createCandidate(
  candidateData: Omit<Candidate, "id" | "appliedAt" | "updatedAt" | "notes" | "scores">
): Promise<Candidate> {
  const c = await prisma.candidate.create({
    data: {
      roleId: candidateData.roleId,
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
      phone: candidateData.phone,
      linkedIn: candidateData.linkedIn,
      portfolio: candidateData.portfolio,
      resumeUrl: candidateData.resumeUrl,
      coverLetter: candidateData.coverLetter,
      stage: candidateData.stage as PrismaStage,
      tags: candidateData.tags || [],
    },
    include: {
      notes: true,
      scores: { include: { category: true } },
    },
  });

  return {
    id: c.id,
    roleId: c.roleId,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone || undefined,
    linkedIn: c.linkedIn || undefined,
    portfolio: c.portfolio || undefined,
    resumeUrl: c.resumeUrl || undefined,
    coverLetter: c.coverLetter || undefined,
    stage: c.stage as Stage,
    tags: c.tags,
    appliedAt: c.appliedAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    notes: [],
    scores: [],
  };
}

export async function updateCandidateStage(
  candidateId: string,
  newStage: Stage
): Promise<Candidate | null> {
  try {
    const c = await prisma.candidate.update({
      where: { id: candidateId },
      data: { stage: newStage as PrismaStage },
      include: {
        notes: true,
        scores: { include: { category: true } },
      },
    });

    return {
      id: c.id,
      roleId: c.roleId,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone || undefined,
      linkedIn: c.linkedIn || undefined,
      portfolio: c.portfolio || undefined,
      resumeUrl: c.resumeUrl || undefined,
      coverLetter: c.coverLetter || undefined,
      stage: c.stage as Stage,
      tags: c.tags,
      appliedAt: c.appliedAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      notes: c.notes.map((n) => ({
        id: n.id,
        candidateId: n.candidateId,
        authorId: n.authorId,
        authorName: n.authorName,
        content: n.content,
        type: mapNoteType(n.type),
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      })),
      scores: c.scores.map((s) => ({
        id: s.id,
        candidateId: s.candidateId,
        categoryId: s.categoryId,
        categoryName: s.category.name,
        value: s.value,
        maxValue: s.category.maxScore,
        evaluatorId: s.evaluatorId,
        evaluatorName: s.evaluatorName,
        comment: s.comment || undefined,
        createdAt: s.createdAt.toISOString(),
      })),
    };
  } catch {
    return null;
  }
}

export async function updateCandidate(
  id: string,
  updates: Partial<Candidate>
): Promise<Candidate | null> {
  try {
    const c = await prisma.candidate.update({
      where: { id },
      data: {
        ...(updates.firstName && { firstName: updates.firstName }),
        ...(updates.lastName && { lastName: updates.lastName }),
        ...(updates.email && { email: updates.email }),
        ...(updates.phone !== undefined && { phone: updates.phone }),
        ...(updates.linkedIn !== undefined && { linkedIn: updates.linkedIn }),
        ...(updates.portfolio !== undefined && { portfolio: updates.portfolio }),
        ...(updates.resumeUrl !== undefined && { resumeUrl: updates.resumeUrl }),
        ...(updates.coverLetter !== undefined && { coverLetter: updates.coverLetter }),
        ...(updates.stage && { stage: updates.stage as PrismaStage }),
        ...(updates.tags && { tags: updates.tags }),
      },
      include: {
        notes: true,
        scores: { include: { category: true } },
      },
    });

    return {
      id: c.id,
      roleId: c.roleId,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone || undefined,
      linkedIn: c.linkedIn || undefined,
      portfolio: c.portfolio || undefined,
      resumeUrl: c.resumeUrl || undefined,
      coverLetter: c.coverLetter || undefined,
      stage: c.stage as Stage,
      tags: c.tags,
      appliedAt: c.appliedAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      notes: c.notes.map((n) => ({
        id: n.id,
        candidateId: n.candidateId,
        authorId: n.authorId,
        authorName: n.authorName,
        content: n.content,
        type: mapNoteType(n.type),
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      })),
      scores: c.scores.map((s) => ({
        id: s.id,
        candidateId: s.candidateId,
        categoryId: s.categoryId,
        categoryName: s.category.name,
        value: s.value,
        maxValue: s.category.maxScore,
        evaluatorId: s.evaluatorId,
        evaluatorName: s.evaluatorName,
        comment: s.comment || undefined,
        createdAt: s.createdAt.toISOString(),
      })),
    };
  } catch {
    return null;
  }
}

// ============================================
// NOTES
// ============================================

// Current user for notes/scores (in production, get from auth)
const CURRENT_USER = {
  id: "user-1",
  name: "Sarah Chen",
};

export async function addNote(
  candidateId: string,
  content: string,
  type: Note["type"] = "general"
): Promise<Note | null> {
  try {
    const n = await prisma.note.create({
      data: {
        candidateId,
        authorId: CURRENT_USER.id,
        authorName: CURRENT_USER.name,
        content,
        type: mapNoteTypeToDb(type),
      },
    });

    return {
      id: n.id,
      candidateId: n.candidateId,
      authorId: n.authorId,
      authorName: n.authorName,
      content: n.content,
      type: mapNoteType(n.type),
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
    };
  } catch {
    return null;
  }
}

export async function updateNote(
  candidateId: string,
  noteId: string,
  content: string
): Promise<Note | null> {
  try {
    const n = await prisma.note.update({
      where: { id: noteId, candidateId },
      data: { content },
    });

    return {
      id: n.id,
      candidateId: n.candidateId,
      authorId: n.authorId,
      authorName: n.authorName,
      content: n.content,
      type: mapNoteType(n.type),
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
    };
  } catch {
    return null;
  }
}

export async function deleteNote(
  candidateId: string,
  noteId: string
): Promise<boolean> {
  try {
    await prisma.note.delete({
      where: { id: noteId, candidateId },
    });
    return true;
  } catch {
    return false;
  }
}

// ============================================
// SCORES
// ============================================

export async function addScore(
  candidateId: string,
  categoryId: string,
  value: number,
  comment?: string
): Promise<Score | null> {
  try {
    const category = await prisma.scoreCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) return null;

    const s = await prisma.score.upsert({
      where: {
        candidateId_categoryId_evaluatorId: {
          candidateId,
          categoryId,
          evaluatorId: CURRENT_USER.id,
        },
      },
      update: {
        value: Math.min(value, category.maxScore),
        comment,
      },
      create: {
        candidateId,
        categoryId,
        value: Math.min(value, category.maxScore),
        evaluatorId: CURRENT_USER.id,
        evaluatorName: CURRENT_USER.name,
        comment,
      },
      include: { category: true },
    });

    return {
      id: s.id,
      candidateId: s.candidateId,
      categoryId: s.categoryId,
      categoryName: s.category.name,
      value: s.value,
      maxValue: s.category.maxScore,
      evaluatorId: s.evaluatorId,
      evaluatorName: s.evaluatorName,
      comment: s.comment || undefined,
      createdAt: s.createdAt.toISOString(),
    };
  } catch {
    return null;
  }
}

export async function getScoreCategories(): Promise<ScoreCategory[]> {
  const categories = await prisma.scoreCategory.findMany({
    orderBy: { order: "asc" },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    maxScore: c.maxScore,
  }));
}

// ============================================
// STATIC DATA (kept in-memory for simplicity)
// ============================================

const STAGES: StageInfo[] = [
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

const EMAIL_TEMPLATES: EmailTemplate[] = [
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
  return CURRENT_USER;
}

// ============================================
// AI ASSISTANT (Simulated)
// ============================================

export async function generateJobDescription(
  title: string,
  department: string
): Promise<string> {
  // Simulate AI processing time
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  return `[AI Generated Job Description]

About the Role:
We're looking for a talented ${title} to join our ${department} team. This is an exciting opportunity to make a real impact in a fast-growing company.

What You'll Do:
• Lead and contribute to key initiatives in ${department}
• Collaborate with cross-functional teams to deliver exceptional results
• Help shape the future direction of our products and services
• Mentor and grow alongside talented colleagues

What We're Looking For:
• Relevant experience in ${department.toLowerCase()} roles
• Strong communication and collaboration skills
• A growth mindset and passion for learning
• Creative problem-solving abilities

Why Join Us:
• Competitive compensation and benefits
• Flexible work arrangements
• Professional development opportunities
• Inclusive and supportive team culture`;
}

export async function summarizeCandidateNotes(
  candidateId: string
): Promise<string> {
  // Simulate AI processing time
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  const notes = await prisma.note.findMany({
    where: { candidateId },
  });

  if (notes.length === 0) {
    return "No notes available to summarize.";
  }

  return `[AI Summary]

Based on ${notes.length} note(s) from the hiring team:

Key Observations:
• Overall sentiment appears positive based on interviewer feedback
• Technical skills have been noted as a strength
• Communication abilities highlighted as above average

Recommendations:
• Continue to the next stage of the interview process
• Consider scheduling a team culture fit interview

Note: This is a simulated AI summary. In production, this would analyze the actual note content.`;
}

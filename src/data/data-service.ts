/**
 * Data Service Layer
 * ==================
 * Provides CRUD operations for the recruitment platform.
 * Currently uses in-memory mock data, can be easily swapped for a real database.
 */

import type { Role, Candidate, Note, Score, Stage } from "@/types";
import {
  ROLES,
  CANDIDATES,
  STAGES,
  SCORE_CATEGORIES,
  EMAIL_TEMPLATES,
  CURRENT_USER,
} from "./mock-data";
import { delay, generateId } from "@/lib/utils";

// Simulate network latency
const SIMULATED_DELAY = 300;

// In-memory data stores (mutable copies of mock data)
let roles = [...ROLES];
let candidates = [...CANDIDATES];

/**
 * Reset data to initial state (useful for testing)
 */
export function resetData(): void {
  roles = [...ROLES];
  candidates = [...CANDIDATES];
}

// ============================================
// ROLES
// ============================================

export async function getRoles(): Promise<Role[]> {
  await delay(SIMULATED_DELAY);
  return [...roles];
}

export async function getRoleById(id: string): Promise<Role | null> {
  await delay(SIMULATED_DELAY);
  return roles.find((r) => r.id === id) ?? null;
}

export async function getOpenRoles(): Promise<Role[]> {
  await delay(SIMULATED_DELAY);
  return roles.filter((r) => r.status === "open");
}

export async function createRole(
  roleData: Omit<Role, "id" | "createdAt" | "updatedAt">
): Promise<Role> {
  await delay(SIMULATED_DELAY);
  const newRole: Role = {
    ...roleData,
    id: `role-${generateId()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  roles.push(newRole);
  return newRole;
}

export async function updateRole(
  id: string,
  updates: Partial<Role>
): Promise<Role | null> {
  await delay(SIMULATED_DELAY);
  const index = roles.findIndex((r) => r.id === id);
  if (index === -1) return null;

  roles[index] = {
    ...roles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return roles[index];
}

// ============================================
// CANDIDATES
// ============================================

export async function getCandidates(): Promise<Candidate[]> {
  await delay(SIMULATED_DELAY);
  return [...candidates];
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
  await delay(SIMULATED_DELAY);
  return candidates.find((c) => c.id === id) ?? null;
}

export async function getCandidatesByRole(roleId: string): Promise<Candidate[]> {
  await delay(SIMULATED_DELAY);
  return candidates.filter((c) => c.roleId === roleId);
}

export async function getCandidatesByStage(stage: Stage): Promise<Candidate[]> {
  await delay(SIMULATED_DELAY);
  return candidates.filter((c) => c.stage === stage);
}

export async function createCandidate(
  candidateData: Omit<Candidate, "id" | "appliedAt" | "updatedAt" | "notes" | "scores">
): Promise<Candidate> {
  await delay(SIMULATED_DELAY);
  const newCandidate: Candidate = {
    ...candidateData,
    id: `cand-${generateId()}`,
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: [],
    scores: [],
  };
  candidates.push(newCandidate);
  return newCandidate;
}

export async function updateCandidateStage(
  candidateId: string,
  newStage: Stage
): Promise<Candidate | null> {
  await delay(SIMULATED_DELAY);
  const index = candidates.findIndex((c) => c.id === candidateId);
  if (index === -1) return null;

  candidates[index] = {
    ...candidates[index],
    stage: newStage,
    updatedAt: new Date().toISOString(),
  };
  return candidates[index];
}

export async function updateCandidate(
  id: string,
  updates: Partial<Candidate>
): Promise<Candidate | null> {
  await delay(SIMULATED_DELAY);
  const index = candidates.findIndex((c) => c.id === id);
  if (index === -1) return null;

  candidates[index] = {
    ...candidates[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return candidates[index];
}

// ============================================
// NOTES
// ============================================

export async function addNote(
  candidateId: string,
  content: string,
  type: Note["type"] = "general"
): Promise<Note | null> {
  await delay(SIMULATED_DELAY);
  const candidateIndex = candidates.findIndex((c) => c.id === candidateId);
  if (candidateIndex === -1) return null;

  const newNote: Note = {
    id: `note-${generateId()}`,
    candidateId,
    authorId: CURRENT_USER.id,
    authorName: CURRENT_USER.name,
    content,
    type,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  candidates[candidateIndex].notes.push(newNote);
  candidates[candidateIndex].updatedAt = new Date().toISOString();

  return newNote;
}

export async function updateNote(
  candidateId: string,
  noteId: string,
  content: string
): Promise<Note | null> {
  await delay(SIMULATED_DELAY);
  const candidate = candidates.find((c) => c.id === candidateId);
  if (!candidate) return null;

  const noteIndex = candidate.notes.findIndex((n) => n.id === noteId);
  if (noteIndex === -1) return null;

  candidate.notes[noteIndex] = {
    ...candidate.notes[noteIndex],
    content,
    updatedAt: new Date().toISOString(),
  };

  return candidate.notes[noteIndex];
}

export async function deleteNote(
  candidateId: string,
  noteId: string
): Promise<boolean> {
  await delay(SIMULATED_DELAY);
  const candidate = candidates.find((c) => c.id === candidateId);
  if (!candidate) return false;

  const noteIndex = candidate.notes.findIndex((n) => n.id === noteId);
  if (noteIndex === -1) return false;

  candidate.notes.splice(noteIndex, 1);
  return true;
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
  await delay(SIMULATED_DELAY);
  const candidateIndex = candidates.findIndex((c) => c.id === candidateId);
  if (candidateIndex === -1) return null;

  const category = SCORE_CATEGORIES.find((cat) => cat.id === categoryId);
  if (!category) return null;

  // Check if score already exists for this category from this evaluator
  const existingScoreIndex = candidates[candidateIndex].scores.findIndex(
    (s) => s.categoryId === categoryId && s.evaluatorId === CURRENT_USER.id
  );

  const newScore: Score = {
    id: `score-${generateId()}`,
    candidateId,
    categoryId,
    categoryName: category.name,
    value: Math.min(value, category.maxScore),
    maxValue: category.maxScore,
    evaluatorId: CURRENT_USER.id,
    evaluatorName: CURRENT_USER.name,
    comment,
    createdAt: new Date().toISOString(),
  };

  if (existingScoreIndex !== -1) {
    // Update existing score
    candidates[candidateIndex].scores[existingScoreIndex] = newScore;
  } else {
    // Add new score
    candidates[candidateIndex].scores.push(newScore);
  }

  candidates[candidateIndex].updatedAt = new Date().toISOString();
  return newScore;
}

// ============================================
// STATIC DATA ACCESSORS
// ============================================

export function getStages() {
  return STAGES;
}

export function getScoreCategories() {
  return SCORE_CATEGORIES;
}

export function getEmailTemplates() {
  return EMAIL_TEMPLATES;
}

export function getEmailTemplateForStage(stage: Stage) {
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
  await delay(1000); // Simulate AI processing time
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
  await delay(800);
  const candidate = candidates.find((c) => c.id === candidateId);
  if (!candidate || candidate.notes.length === 0) {
    return "No notes available to summarize.";
  }

  return `[AI Summary]

Based on ${candidate.notes.length} note(s) from the hiring team:

Key Observations:
• Overall sentiment appears positive based on interviewer feedback
• Technical skills have been noted as a strength
• Communication abilities highlighted as above average

Recommendations:
• Continue to the next stage of the interview process
• Consider scheduling a team culture fit interview

Note: This is a simulated AI summary. In production, this would analyze the actual note content.`;
}


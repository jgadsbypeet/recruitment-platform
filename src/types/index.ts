/**
 * Recruitment Platform Type Definitions
 * =====================================
 * Core domain types for the ATS system
 */

/**
 * Candidate stages in the recruitment pipeline
 */
export type Stage = "applied" | "review" | "interview" | "offer" | "rejected";

/**
 * Stage metadata for display purposes
 */
export interface StageInfo {
  id: Stage;
  label: string;
  description: string;
  color: string;
  emailTemplate?: EmailTemplate;
}

/**
 * Email template structure for automated communications
 */
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  stage: Stage;
}

/**
 * Custom application question for a role
 */
export interface ApplicationQuestion {
  id: string;
  question: string;
  type: "text" | "textarea" | "select" | "radio";
  required: boolean;
  options?: string[]; // For select/radio types
  placeholder?: string;
  maxLength?: number;
}

/**
 * Answer to a custom application question
 */
export interface QuestionAnswer {
  questionId: string;
  question: string;
  answer: string;
}

/**
 * Role/Position in the organization
 */
export interface Role {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  description: string;
  requirements: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  status: "open" | "closed" | "draft";
  questions?: ApplicationQuestion[]; // Custom application questions
  createdAt: string;
  updatedAt: string;
}

/**
 * Candidate/Applicant profile
 */
export interface Candidate {
  id: string;
  roleId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  portfolio?: string;
  resumeUrl?: string;
  coverLetter?: string;
  questionAnswers?: QuestionAnswer[]; // Answers to custom questions
  stage: Stage;
  appliedAt: string;
  updatedAt: string;
  notes: Note[];
  scores: Score[];
  tags?: string[];
}

/**
 * Interview/Evaluation note
 */
export interface Note {
  id: string;
  candidateId: string;
  authorId: string;
  authorName: string;
  content: string;
  type: "general" | "interview" | "reference" | "internal";
  createdAt: string;
  updatedAt: string;
}

/**
 * Scoring rubric item
 */
export interface ScoreCategory {
  id: string;
  name: string;
  description: string;
  maxScore: number;
}

/**
 * Individual score entry for a candidate
 */
export interface Score {
  id: string;
  candidateId: string;
  categoryId: string;
  categoryName: string;
  value: number;
  maxValue: number;
  evaluatorId: string;
  evaluatorName: string;
  comment?: string;
  createdAt: string;
}

/**
 * User/Admin account
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "recruiter" | "interviewer" | "viewer";
  avatar?: string;
}

/**
 * Application form data structure
 */
export interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  linkedIn?: string;
  portfolio?: string;
  coverLetter?: string;
  resumeFile?: File;
}

/**
 * Pipeline view configuration
 */
export interface PipelineConfig {
  stages: StageInfo[];
  viewMode: "kanban" | "table";
  sortBy: "appliedAt" | "updatedAt" | "name";
  sortOrder: "asc" | "desc";
  filters: {
    roleId?: string;
    stage?: Stage[];
    search?: string;
  };
}

/**
 * Toast notification type
 */
export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
  duration?: number;
}

/**
 * AI Assistant response simulation
 */
export interface AIAssistantResponse {
  type: "job-description" | "summary" | "suggestion";
  content: string;
  generatedAt: string;
}


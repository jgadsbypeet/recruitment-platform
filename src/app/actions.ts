"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { Stage, Note, Role, ScoreCategory } from "@/types";
import { NoteType, Stage as PrismaStage, RoleType, RoleStatus } from "@prisma/client";

// Current user (in production, get from auth)
const CURRENT_USER = {
  id: "user-1",
  name: "Sarah Chen",
  email: "sarah.chen@rspca.org.uk",
  role: "admin" as const,
};

export async function updateCandidateStageAction(
  candidateId: string,
  newStage: Stage
) {
  try {
    const candidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: { stage: newStage as PrismaStage },
    });
    
    revalidatePath("/admin");
    revalidatePath("/admin/candidates");
    
    return { success: true, candidate };
  } catch (error) {
    console.error("Failed to update candidate stage:", error);
    return { success: false, error: "Failed to update stage" };
  }
}

export async function addNoteAction(
  candidateId: string,
  content: string,
  type: Note["type"] = "general"
) {
  try {
    const noteTypeMap: Record<Note["type"], NoteType> = {
      general: NoteType.general,
      interview: NoteType.interview,
      reference: NoteType.reference,
      internal: NoteType.internal,
    };

    const note = await prisma.note.create({
      data: {
        candidateId,
        authorId: CURRENT_USER.id,
        authorName: CURRENT_USER.name,
        content,
        type: noteTypeMap[type],
      },
    });
    
    revalidatePath("/admin");
    
    return {
      success: true,
      note: {
        id: note.id,
        candidateId: note.candidateId,
        authorId: note.authorId,
        authorName: note.authorName,
        content: note.content,
        type: type,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Failed to add note:", error);
    return { success: false, error: "Failed to add note" };
  }
}

export async function addScoreAction(
  candidateId: string,
  categoryId: string,
  value: number,
  comment?: string
) {
  try {
    const category = await prisma.scoreCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    const score = await prisma.score.upsert({
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
    
    revalidatePath("/admin");
    
    return {
      success: true,
      score: {
        id: score.id,
        candidateId: score.candidateId,
        categoryId: score.categoryId,
        categoryName: score.category.name,
        value: score.value,
        maxValue: score.category.maxScore,
        evaluatorId: score.evaluatorId,
        evaluatorName: score.evaluatorName,
        comment: score.comment || undefined,
        createdAt: score.createdAt.toISOString(),
      },
    };
  } catch (error) {
    console.error("Failed to add score:", error);
    return { success: false, error: "Failed to add score" };
  }
}

export async function createRoleAction(
  roleData: Omit<Role, "id" | "createdAt" | "updatedAt">
) {
  try {
    const roleTypeMap: Record<Role["type"], RoleType> = {
      "full-time": RoleType.full_time,
      "part-time": RoleType.part_time,
      contract: RoleType.contract,
      internship: RoleType.internship,
    };

    const roleStatusMap: Record<Role["status"], RoleStatus> = {
      open: RoleStatus.open,
      closed: RoleStatus.closed,
      draft: RoleStatus.draft,
    };

    const role = await prisma.role.create({
      data: {
        title: roleData.title,
        department: roleData.department,
        location: roleData.location,
        type: roleTypeMap[roleData.type],
        description: roleData.description,
        requirements: roleData.requirements,
        salaryMin: roleData.salary?.min,
        salaryMax: roleData.salary?.max,
        salaryCurrency: roleData.salary?.currency || "USD",
        status: roleStatusMap[roleData.status],
      },
    });
    
    revalidatePath("/admin/roles");
    revalidatePath("/careers");
    
    return { success: true, role };
  } catch (error) {
    console.error("Failed to create role:", error);
    return { success: false, error: "Failed to create role" };
  }
}

export async function generateJobDescriptionAction(
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

export async function getScoreCategoriesAction(): Promise<ScoreCategory[]> {
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

export async function createCandidateAction(
  candidateData: {
    roleId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    linkedIn?: string;
    portfolio?: string;
    coverLetter?: string;
    stage: Stage;
  }
) {
  try {
    const candidate = await prisma.candidate.create({
      data: {
        roleId: candidateData.roleId,
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        email: candidateData.email,
        phone: candidateData.phone,
        linkedIn: candidateData.linkedIn,
        portfolio: candidateData.portfolio,
        coverLetter: candidateData.coverLetter,
        stage: candidateData.stage as PrismaStage,
        tags: [],
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/candidates");

    return { success: true, candidate };
  } catch (error) {
    console.error("Failed to create candidate:", error);
    return { success: false, error: "Failed to submit application" };
  }
}

export async function summarizeCandidateNotesAction(candidateId: string): Promise<string> {
  // Simulate AI processing
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    include: { notes: true, scores: { include: { category: true } } },
  });
  
  if (!candidate) {
    return "Unable to generate summary: Candidate not found.";
  }
  
  const notesSummary = candidate.notes.length > 0
    ? `Based on ${candidate.notes.length} note(s), `
    : "No notes available. ";
  
  const scoresSummary = candidate.scores.length > 0
    ? `Evaluation scores indicate ${candidate.scores.map(s => `${s.category.name}: ${s.value}/${s.category.maxScore}`).join(", ")}.`
    : "No evaluation scores yet.";
  
  return `[AI Generated Summary]

${notesSummary}this candidate appears to be a strong prospect for the role.

${scoresSummary}

Key Highlights:
• ${candidate.firstName} ${candidate.lastName} has shown consistent engagement throughout the process
• Application materials demonstrate relevant experience
• Recommended next steps: Continue evaluation with structured interview

Note: This is a simulated AI summary. In production, this would use advanced NLP to synthesize all candidate data.`;
}

export async function getCandidateByIdAction(id: string) {
  const c = await prisma.candidate.findUnique({
    where: { id },
    include: {
      notes: true,
      scores: {
        include: { category: true },
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
    notes: c.notes.map((n) => ({
      id: n.id,
      candidateId: n.candidateId,
      authorId: n.authorId,
      authorName: n.authorName,
      content: n.content,
      type: n.type as Note["type"],
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


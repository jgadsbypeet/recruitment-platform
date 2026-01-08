import { z } from "zod";

/**
 * Application Form Validation Schema
 * WCAG 2.1 AA requires clear error messages
 */
export const applicationSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or less"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-\+\(\)]+$/.test(val),
      "Please enter a valid phone number"
    ),
  linkedIn: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.includes("linkedin.com"),
      "Please enter a valid LinkedIn URL"
    ),
  portfolio: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      "Please enter a valid URL (starting with http:// or https://)"
    ),
  coverLetter: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 5000,
      "Cover letter must be 5000 characters or less"
    ),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;

/**
 * Note Form Validation Schema
 */
export const noteSchema = z.object({
  content: z
    .string()
    .min(1, "Note content is required")
    .max(2000, "Note must be 2000 characters or less"),
  type: z.enum(["general", "interview", "reference", "internal"]).default("general"),
});

export type NoteFormValues = z.infer<typeof noteSchema>;

/**
 * Score Form Validation Schema
 */
export const scoreSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  value: z.number().min(0).max(5),
  comment: z.string().optional(),
});

export type ScoreFormValues = z.infer<typeof scoreSchema>;


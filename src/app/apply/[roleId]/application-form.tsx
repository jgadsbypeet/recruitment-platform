"use client";

import { useState, useId } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { applicationSchema } from "@/lib/validation";
import { createCandidateAction } from "@/app/actions";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { ApplicationQuestion, QuestionAnswer } from "@/types";

interface ApplicationFormProps {
  roleId: string;
  roleTitle: string;
  questions?: ApplicationQuestion[];
}

export function ApplicationForm({ roleId, roleTitle, questions = [] }: ApplicationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [questionErrors, setQuestionErrors] = useState<Record<string, string>>({});
  
  // Generate unique IDs for form fields (a11y)
  const formId = useId();
  const errorRegionId = `${formId}-errors`;

  // Build dynamic schema for custom questions
  const dynamicSchema = applicationSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(dynamicSchema),
    mode: "onBlur",
  });

  // Validate custom questions
  const validateQuestions = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    for (const question of questions) {
      const answer = questionAnswers[question.id]?.trim() || "";
      
      if (question.required && !answer) {
        newErrors[question.id] = "This question is required";
        isValid = false;
      } else if (question.maxLength && answer.length > question.maxLength) {
        newErrors[question.id] = `Answer must be ${question.maxLength} characters or less`;
        isValid = false;
      }
    }

    setQuestionErrors(newErrors);
    return isValid;
  };

  const onSubmit = async (data: z.infer<typeof applicationSchema>) => {
    // Validate custom questions first
    if (!validateQuestions()) {
      toast({
        title: "Please complete all required questions",
        description: "Some questions need to be answered before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Build question answers array
      const answers: QuestionAnswer[] = questions.map((q) => ({
        questionId: q.id,
        question: q.question,
        answer: questionAnswers[q.id] || "",
      })).filter((a) => a.answer);

      await createCandidateAction({
        roleId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        linkedIn: data.linkedIn,
        portfolio: data.portfolio,
        coverLetter: data.coverLetter,
        questionAnswers: answers.length > 0 ? answers : undefined,
        stage: "applied",
      });

      setIsSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: `Thank you for applying to ${roleTitle}. We'll be in touch soon.`,
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle question answer changes
  const handleQuestionChange = (questionId: string, value: string) => {
    setQuestionAnswers((prev) => ({ ...prev, [questionId]: value }));
    // Clear error when user starts typing
    if (questionErrors[questionId]) {
      setQuestionErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  // Show success state
  if (isSubmitted) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Application Received!</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Thank you for your interest in the {roleTitle} position. 
          We have received your application and will review it carefully.
        </p>
        <Button variant="outline" onClick={() => router.push("/careers")}>
          View Other Positions
        </Button>
      </div>
    );
  }

  // Calculate error count for screen reader announcement
  const errorCount = Object.keys(errors).length + Object.keys(questionErrors).length;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-describedby={errorCount > 0 ? errorRegionId : undefined}
    >
      {/* Error Summary for Screen Readers */}
      {errorCount > 0 && (
        <div
          id={errorRegionId}
          role="alert"
          aria-live="assertive"
          className="mb-6 p-4 rounded-lg border border-destructive bg-destructive/10"
        >
          <p className="font-medium text-destructive">
            Please fix {errorCount} {errorCount === 1 ? "error" : "errors"} before submitting:
          </p>
          <ul className="mt-2 list-disc list-inside text-sm text-destructive">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                <a href={`#${formId}-${field}`} className="underline hover:no-underline">
                  {error?.message}
                </a>
              </li>
            ))}
            {Object.entries(questionErrors).map(([questionId, error]) => (
              <li key={questionId}>
                <a href={`#${formId}-${questionId}`} className="underline hover:no-underline">
                  {error}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-6">
        {/* Name Row */}
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField
            id={`${formId}-firstName`}
            label="First Name"
            required
            error={errors.firstName?.message}
          >
            <Input
              id={`${formId}-firstName`}
              {...register("firstName")}
              error={!!errors.firstName}
              aria-describedby={errors.firstName ? `${formId}-firstName-error` : undefined}
              autoComplete="given-name"
            />
          </FormField>

          <FormField
            id={`${formId}-lastName`}
            label="Last Name"
            required
            error={errors.lastName?.message}
          >
            <Input
              id={`${formId}-lastName`}
              {...register("lastName")}
              error={!!errors.lastName}
              aria-describedby={errors.lastName ? `${formId}-lastName-error` : undefined}
              autoComplete="family-name"
            />
          </FormField>
        </div>

        {/* Email */}
        <FormField
          id={`${formId}-email`}
          label="Email Address"
          required
          error={errors.email?.message}
        >
          <Input
            id={`${formId}-email`}
            type="email"
            {...register("email")}
            error={!!errors.email}
            aria-describedby={errors.email ? `${formId}-email-error` : undefined}
            autoComplete="email"
          />
        </FormField>

        {/* Phone */}
        <FormField
          id={`${formId}-phone`}
          label="Phone Number"
          hint="Optional - we will only use this for scheduling interviews"
          error={errors.phone?.message}
        >
          <Input
            id={`${formId}-phone`}
            type="tel"
            {...register("phone")}
            error={!!errors.phone}
            aria-describedby={`${formId}-phone-hint${errors.phone ? ` ${formId}-phone-error` : ""}`}
            autoComplete="tel"
          />
        </FormField>

        {/* LinkedIn */}
        <FormField
          id={`${formId}-linkedIn`}
          label="LinkedIn Profile"
          hint="Optional - paste your LinkedIn profile URL"
          error={errors.linkedIn?.message}
        >
          <Input
            id={`${formId}-linkedIn`}
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            {...register("linkedIn")}
            error={!!errors.linkedIn}
            aria-describedby={`${formId}-linkedIn-hint${errors.linkedIn ? ` ${formId}-linkedIn-error` : ""}`}
          />
        </FormField>

        {/* Portfolio */}
        <FormField
          id={`${formId}-portfolio`}
          label="Portfolio / Website"
          hint="Optional - share your work or personal site"
          error={errors.portfolio?.message}
        >
          <Input
            id={`${formId}-portfolio`}
            type="url"
            placeholder="https://yoursite.com"
            {...register("portfolio")}
            error={!!errors.portfolio}
            aria-describedby={`${formId}-portfolio-hint${errors.portfolio ? ` ${formId}-portfolio-error` : ""}`}
          />
        </FormField>

        {/* Custom Questions Section */}
        {questions.length > 0 && (
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Additional Questions</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Please answer the following questions from the hiring team.
            </p>
            <div className="space-y-6">
              {questions.map((question) => (
                <CustomQuestionField
                  key={question.id}
                  question={question}
                  formId={formId}
                  value={questionAnswers[question.id] || ""}
                  error={questionErrors[question.id]}
                  onChange={(value) => handleQuestionChange(question.id, value)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Cover Letter - only show if no custom questions */}
        {questions.length === 0 && (
          <FormField
            id={`${formId}-coverLetter`}
            label="Cover Letter"
            hint="Optional - tell us why you are interested in this role"
            error={errors.coverLetter?.message}
          >
            <Textarea
              id={`${formId}-coverLetter`}
              rows={6}
              placeholder="I am excited about this opportunity because..."
              {...register("coverLetter")}
              error={!!errors.coverLetter}
              aria-describedby={`${formId}-coverLetter-hint${errors.coverLetter ? ` ${formId}-coverLetter-error` : ""}`}
            />
          </FormField>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">
            By submitting, you agree to our privacy policy and consent to be contacted about this role.
          </p>
        </div>
      </div>
    </form>
  );
}

// Custom Question Field Component
interface CustomQuestionFieldProps {
  question: ApplicationQuestion;
  formId: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

function CustomQuestionField({ question, formId, value, error, onChange }: CustomQuestionFieldProps) {
  const id = `${formId}-${question.id}`;

  return (
    <FormField
      id={id}
      label={question.question}
      required={question.required}
      hint={question.maxLength ? `Maximum ${question.maxLength} characters` : undefined}
      error={error}
    >
      {question.type === "textarea" ? (
        <Textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          rows={4}
          maxLength={question.maxLength}
          error={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : question.type === "select" && question.options ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger id={id} error={!!error}>
            <SelectValue placeholder="Select an option..." />
          </SelectTrigger>
          <SelectContent>
            {question.options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          maxLength={question.maxLength}
          error={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      {question.maxLength && value && (
        <p className="text-xs text-muted-foreground text-right">
          {value.length} / {question.maxLength}
        </p>
      )}
    </FormField>
  );
}

// Accessible form field wrapper component
interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

function FormField({ id, label, required, hint, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-1">
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">*</span>
        )}
        {required && <span className="sr-only">(required)</span>}
      </Label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className={cn(
            "text-sm text-destructive flex items-center gap-1",
            "animate-in fade-in slide-in-from-top-1"
          )}
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

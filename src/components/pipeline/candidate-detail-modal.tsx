"use client";

import { useState, useEffect, useRef } from "react";
import {
  Mail,
  Phone,
  Linkedin,
  Globe,
  FileText,
  Calendar,
  Sparkles,
  X,
  ExternalLink,
} from "lucide-react";
import type { Candidate, Role, StageInfo, Stage } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatDate, getInitials } from "@/lib/utils";
import { NotesSection } from "./notes-section";
import { ScoringSection } from "./scoring-section";
import { EmailTemplateModal } from "./email-template-modal";

interface CandidateDetailModalProps {
  candidate: Candidate;
  role?: Role;
  stages: StageInfo[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStageChange: (candidateId: string, newStage: Stage) => void;
  onCandidateUpdate: (candidate: Candidate) => void;
}

// Stage color mapping
const stageBadgeVariants: Record<Stage, "applied" | "review" | "interview" | "offer" | "rejected"> = {
  applied: "applied",
  review: "review",
  interview: "interview",
  offer: "offer",
  rejected: "rejected",
};

export function CandidateDetailModal({
  candidate,
  role,
  stages,
  open,
  onOpenChange,
  onStageChange,
  onCandidateUpdate,
}: CandidateDetailModalProps) {
  const [showEmailTemplate, setShowEmailTemplate] = useState(false);
  const [pendingStageChange, setPendingStageChange] = useState<Stage | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store the previously focused element when modal opens
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [open]);

  // Return focus when modal closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
    onOpenChange(isOpen);
  };

  // Handle stage change with email template prompt
  const handleStageSelect = (newStage: Stage) => {
    if (newStage === candidate.stage) return;

    // Show email template for certain stage changes
    const showTemplate =
      newStage === "interview" ||
      newStage === "offer" ||
      newStage === "rejected";

    if (showTemplate) {
      setPendingStageChange(newStage);
      setShowEmailTemplate(true);
    } else {
      onStageChange(candidate.id, newStage);
    }
  };

  // Confirm stage change after email template
  const handleConfirmStageChange = (sendEmail: boolean) => {
    if (pendingStageChange) {
      onStageChange(candidate.id, pendingStageChange);
    }
    setShowEmailTemplate(false);
    setPendingStageChange(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-semibold flex-shrink-0"
                aria-hidden="true"
              >
                {getInitials(`${candidate.firstName} ${candidate.lastName}`)}
              </div>

              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl font-serif">
                  {candidate.firstName} {candidate.lastName}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  Applied for{" "}
                  <span className="font-medium text-foreground">
                    {role?.title ?? "Unknown Role"}
                  </span>
                </DialogDescription>

                {/* Stage Badge & Selector */}
                <div className="flex items-center gap-3 mt-3">
                  <Badge variant={stageBadgeVariants[candidate.stage]}>
                    {stages.find((s) => s.id === candidate.stage)?.label}
                  </Badge>
                  <Select
                    value={candidate.stage}
                    onValueChange={(value) => handleStageSelect(value as Stage)}
                  >
                    <SelectTrigger className="w-[180px] h-8" aria-label="Change status">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Main Content - Scrollable */}
          <div className="flex-1 overflow-y-auto mt-6">
            <Tabs defaultValue="profile" className="h-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notes">
                  Notes ({candidate.notes.length})
                </TabsTrigger>
                <TabsTrigger value="scoring">
                  Scoring ({candidate.scores.length})
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                {/* Contact Info */}
                <section aria-labelledby="contact-heading">
                  <h3 id="contact-heading" className="font-semibold mb-3">
                    Contact Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <ContactItem
                      icon={Mail}
                      label="Email"
                      value={candidate.email}
                      href={`mailto:${candidate.email}`}
                    />
                    {candidate.phone && (
                      <ContactItem
                        icon={Phone}
                        label="Phone"
                        value={candidate.phone}
                        href={`tel:${candidate.phone}`}
                      />
                    )}
                    {candidate.linkedIn && (
                      <ContactItem
                        icon={Linkedin}
                        label="LinkedIn"
                        value="View Profile"
                        href={candidate.linkedIn}
                        external
                      />
                    )}
                    {candidate.portfolio && (
                      <ContactItem
                        icon={Globe}
                        label="Portfolio"
                        value="View Site"
                        href={candidate.portfolio}
                        external
                      />
                    )}
                  </div>
                </section>

                {/* Timeline */}
                <section aria-labelledby="timeline-heading">
                  <h3 id="timeline-heading" className="font-semibold mb-3">
                    Timeline
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Applied: {formatDate(candidate.appliedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Last Updated: {formatDate(candidate.updatedAt)}</span>
                    </div>
                  </div>
                </section>

                {/* Cover Letter */}
                {candidate.coverLetter && (
                  <section aria-labelledby="cover-letter-heading">
                    <h3 id="cover-letter-heading" className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Cover Letter
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap">
                      {candidate.coverLetter}
                    </div>
                  </section>
                )}

                {/* Application Answers */}
                {candidate.questionAnswers && candidate.questionAnswers.length > 0 && (
                  <section aria-labelledby="answers-heading">
                    <h3 id="answers-heading" className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Application Responses
                    </h3>
                    <div className="space-y-4">
                      {candidate.questionAnswers.map((qa, index) => (
                        <div key={qa.questionId} className="bg-muted/50 rounded-lg p-4">
                          <p className="text-sm font-medium mb-2">{qa.question}</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {qa.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Tags */}
                {candidate.tags && candidate.tags.length > 0 && (
                  <section aria-labelledby="tags-heading">
                    <h3 id="tags-heading" className="font-semibold mb-3">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {candidate.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}

                {/* AI Summary Button */}
                <section>
                  <AIAssistantPlaceholder candidateId={candidate.id} />
                </section>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes">
                <NotesSection
                  candidate={candidate}
                  onCandidateUpdate={onCandidateUpdate}
                />
              </TabsContent>

              {/* Scoring Tab */}
              <TabsContent value="scoring">
                <ScoringSection
                  candidate={candidate}
                  onCandidateUpdate={onCandidateUpdate}
                />
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Template Modal */}
      {showEmailTemplate && pendingStageChange && (
        <EmailTemplateModal
          candidate={candidate}
          role={role}
          newStage={pendingStageChange}
          stages={stages}
          open={showEmailTemplate}
          onOpenChange={setShowEmailTemplate}
          onConfirm={handleConfirmStageChange}
        />
      )}
    </>
  );
}

// Contact item component
interface ContactItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}

function ContactItem({ icon: Icon, label, value, href, external }: ContactItemProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
    >
      <Icon className="w-5 h-5 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
          {value}
        </p>
      </div>
      {external && <ExternalLink className="w-4 h-4 text-muted-foreground" />}
    </a>
  );
}

// AI Assistant placeholder component
function AIAssistantPlaceholder({ candidateId }: { candidateId: string }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    // Simulate AI processing
    const { summarizeCandidateNotes } = await import("@/data/data-service");
    const result = await summarizeCandidateNotes(candidateId);
    setSummary(result);
    setIsGenerating(false);
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">AI Assistant</h3>
        <Badge variant="secondary" className="text-xs">Beta</Badge>
      </div>
      
      {summary ? (
        <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap">
          {summary}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-3">
          Get an AI-generated summary of this candidate based on notes and evaluation scores.
        </p>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleGenerateSummary}
        disabled={isGenerating}
        className="mt-3"
      >
        {isGenerating ? (
          <>
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            Generating...
          </>
        ) : summary ? (
          "Regenerate Summary"
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Summary
          </>
        )}
      </Button>
    </div>
  );
}


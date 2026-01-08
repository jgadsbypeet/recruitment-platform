"use client";

import { useState } from "react";
import { Mail, Copy, Check, Send } from "lucide-react";
import type { Candidate, Role, StageInfo, Stage } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getEmailTemplateForStage } from "@/data/static-data";
import { toast } from "@/hooks/use-toast";

interface EmailTemplateModalProps {
  candidate: Candidate;
  role?: Role;
  newStage: Stage;
  stages: StageInfo[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (sendEmail: boolean) => void;
}

export function EmailTemplateModal({
  candidate,
  role,
  newStage,
  stages,
  open,
  onOpenChange,
  onConfirm,
}: EmailTemplateModalProps) {
  const [copied, setCopied] = useState(false);
  const template = getEmailTemplateForStage(newStage);
  const stageLabel = stages.find((s) => s.id === newStage)?.label ?? newStage;

  // Replace template variables
  const processTemplate = (text: string) => {
    return text
      .replace(/\{\{firstName\}\}/g, candidate.firstName)
      .replace(/\{\{lastName\}\}/g, candidate.lastName)
      .replace(/\{\{role\}\}/g, role?.title ?? "the position")
      .replace(/\{\{email\}\}/g, candidate.email);
  };

  const emailSubject = template ? processTemplate(template.subject) : "";
  const emailBody = template ? processTemplate(template.body) : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(emailBody);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Email template copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = () => {
    // Open default email client with template
    const mailtoLink = `mailto:${candidate.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, "_blank");
    onConfirm(true);
  };

  const handleSkip = () => {
    onConfirm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Mail className="w-5 h-5 text-primary" />
            <Badge variant="secondary">{stageLabel}</Badge>
          </div>
          <DialogTitle>Send Status Update Email?</DialogTitle>
          <DialogDescription>
            Would you like to send an email to {candidate.firstName} about their status change?
            You can use the template below or skip and update status only.
          </DialogDescription>
        </DialogHeader>

        {template ? (
          <div className="space-y-4">
            {/* Email Preview */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 border-b">
                <p className="text-sm">
                  <span className="text-muted-foreground">To:</span>{" "}
                  <span className="font-medium">{candidate.email}</span>
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Subject:</span>{" "}
                  <span className="font-medium">{emailSubject}</span>
                </p>
              </div>
              <div className="p-4 bg-card max-h-64 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-sans">
                  {emailBody}
                </pre>
              </div>
            </div>

            {/* Copy Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Email Body
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No email template available for this stage.</p>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="ghost" onClick={handleSkip}>
            Skip Email
          </Button>
          {template && (
            <Button onClick={handleSendEmail}>
              <Send className="w-4 h-4 mr-2" />
              Open Email Client
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


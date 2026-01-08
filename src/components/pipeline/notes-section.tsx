"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, MessageSquare, User, Clock } from "lucide-react";
import type { Candidate, Note } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { noteSchema, type NoteFormValues } from "@/lib/validation";
import { addNoteAction, getCandidateByIdAction } from "@/app/actions";
import { toast } from "@/hooks/use-toast";
import { formatRelativeTime, cn } from "@/lib/utils";

interface NotesSectionProps {
  candidate: Candidate;
  onCandidateUpdate: (candidate: Candidate) => void;
}

const noteTypeLabels: Record<Note["type"], string> = {
  general: "General",
  interview: "Interview",
  reference: "Reference",
  internal: "Internal",
};

const noteTypeColors: Record<Note["type"], string> = {
  general: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  interview: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  reference: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  internal: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
};

export function NotesSection({ candidate, onCandidateUpdate }: NotesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      type: "general",
    },
  });

  const noteType = watch("type");

  const onSubmit = async (data: NoteFormValues) => {
    setIsSubmitting(true);
    try {
      await addNoteAction(candidate.id, data.content, data.type);
      const updatedCandidate = await getCandidateByIdAction(candidate.id);
      if (updatedCandidate) {
        onCandidateUpdate(updatedCandidate);
      }
      toast({
        title: "Note Added",
        description: "Your note has been saved successfully.",
        variant: "success",
      });
      reset();
      setIsAdding(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Note Form */}
      {isAdding ? (
        <form onSubmit={handleSubmit(onSubmit)} className="border rounded-lg p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note-type">Note Type</Label>
            <Select
              value={noteType}
              onValueChange={(value) => setValue("type", value as Note["type"])}
            >
              <SelectTrigger id="note-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="interview">Interview Feedback</SelectItem>
                <SelectItem value="reference">Reference Check</SelectItem>
                <SelectItem value="internal">Internal Note</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note-content">
              Note Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="note-content"
              {...register("content")}
              error={!!errors.content}
              aria-describedby={errors.content ? "note-content-error" : undefined}
              rows={4}
              placeholder="Add your notes about this candidate..."
            />
            {errors.content && (
              <p id="note-content-error" className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Note"}
            </Button>
          </div>
        </form>
      ) : (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      )}

      {/* Notes List */}
      {candidate.notes.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No notes yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add notes to track feedback and observations
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {candidate.notes
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
        </div>
      )}
    </div>
  );
}

function NoteCard({ note }: { note: Note }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm">{note.authorName}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatRelativeTime(note.createdAt)}
            </p>
          </div>
        </div>
        <Badge className={cn("text-xs", noteTypeColors[note.type])}>
          {noteTypeLabels[note.type]}
        </Badge>
      </div>
      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
    </div>
  );
}


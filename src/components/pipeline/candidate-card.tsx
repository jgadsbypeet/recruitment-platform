"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  MoreHorizontal,
  Mail,
  FileText,
  MessageSquare,
  Star,
  GripVertical,
} from "lucide-react";
import type { Candidate, StageInfo, Stage } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatRelativeTime, getInitials, calculateAverageScore } from "@/lib/utils";

interface CandidateCardProps {
  candidate: Candidate;
  roleTitle: string;
  stages: StageInfo[];
  onStageChange: (candidateId: string, newStage: Stage) => void;
  onOpenDetail: (candidate: Candidate) => void;
  isDragging?: boolean;
}

export function CandidateCard({
  candidate,
  roleTitle,
  stages,
  onStageChange,
  onOpenDetail,
  isDragging,
}: CandidateCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isDraggingFromHook,
  } = useDraggable({
    id: candidate.id,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  const isBeingDragged = isDragging || isDraggingFromHook;
  const avgScore = calculateAverageScore(candidate.scores);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-card rounded-lg border shadow-sm transition-all",
        isBeingDragged && "opacity-50 shadow-lg rotate-2 scale-105",
        !isBeingDragged && "hover:shadow-md"
      )}
    >
      {/* Card Content - Clickable */}
      <button
        className="w-full text-left p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset rounded-t-lg"
        onClick={() => onOpenDetail(candidate)}
        aria-label={`View details for ${candidate.firstName} ${candidate.lastName}`}
      >
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            aria-label="Drag to move candidate"
            role="button"
            tabIndex={0}
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium flex-shrink-0"
            aria-hidden="true"
          >
            {getInitials(`${candidate.firstName} ${candidate.lastName}`)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">
              {candidate.firstName} {candidate.lastName}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{roleTitle}</p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{formatRelativeTime(candidate.appliedAt)}</span>
          
          {/* Score Badge */}
          {avgScore > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Star className="w-3 h-3 fill-current" />
                  {avgScore}%
                </span>
              </TooltipTrigger>
              <TooltipContent>Average evaluation score</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Indicators */}
        <div className="mt-3 flex items-center gap-2">
          {candidate.notes.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="gap-1 text-xs">
                  <MessageSquare className="w-3 h-3" />
                  {candidate.notes.length}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{candidate.notes.length} note(s)</TooltipContent>
            </Tooltip>
          )}
          {candidate.coverLetter && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="text-xs">
                  <FileText className="w-3 h-3" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Has cover letter</TooltipContent>
            </Tooltip>
          )}
          {candidate.email && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="text-xs">
                  <Mail className="w-3 h-3" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{candidate.email}</TooltipContent>
            </Tooltip>
          )}
        </div>
      </button>

      {/* Actions - Keyboard Accessible */}
      <div className="px-4 pb-3 pt-0 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              aria-label={`Actions for ${candidate.firstName} ${candidate.lastName}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onOpenDetail(candidate)}>
              View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Move to Stage</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {stages.map((stage) => (
                  <DropdownMenuItem
                    key={stage.id}
                    disabled={stage.id === candidate.stage}
                    onClick={() => onStageChange(candidate.id, stage.id)}
                  >
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full mr-2",
                        stage.id === "applied" && "bg-blue-500",
                        stage.id === "review" && "bg-yellow-500",
                        stage.id === "interview" && "bg-purple-500",
                        stage.id === "offer" && "bg-green-500",
                        stage.id === "rejected" && "bg-red-500"
                      )}
                    />
                    {stage.label}
                    {stage.id === candidate.stage && " (current)"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => window.open(`mailto:${candidate.email}`, "_blank")}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}


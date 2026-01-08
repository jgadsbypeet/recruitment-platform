"use client";

import { useDroppable } from "@dnd-kit/core";
import { Users } from "lucide-react";
import type { Candidate, StageInfo, Stage } from "@/types";
import { CandidateCard } from "./candidate-card";
import { cn } from "@/lib/utils";

interface PipelineColumnProps {
  stage: StageInfo;
  candidates: Candidate[];
  getRoleTitle: (roleId: string) => string;
  stages: StageInfo[];
  onStageChange: (candidateId: string, newStage: Stage) => void;
  onOpenDetail: (candidate: Candidate) => void;
}

// Stage color mapping
const stageColors: Record<Stage, string> = {
  applied: "bg-blue-500",
  review: "bg-yellow-500",
  interview: "bg-purple-500",
  offer: "bg-green-500",
  rejected: "bg-red-500",
};

export function PipelineColumn({
  stage,
  candidates,
  getRoleTitle,
  stages,
  onStageChange,
  onOpenDetail,
}: PipelineColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-80 flex-shrink-0 bg-muted/30 rounded-lg flex flex-col transition-colors",
        isOver && "bg-muted/50 ring-2 ring-primary/20"
      )}
      role="region"
      aria-label={`${stage.label} stage with ${candidates.length} candidates`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div
            className={cn("w-3 h-3 rounded-full", stageColors[stage.id])}
            aria-hidden="true"
          />
          <h2 className="font-semibold">{stage.label}</h2>
          <span
            className="ml-auto bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full"
            aria-label={`${candidates.length} candidates`}
          >
            {candidates.length}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{stage.description}</p>
      </div>

      {/* Candidate List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {candidates.length === 0 ? (
          <EmptyState stage={stage} />
        ) : (
          candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              roleTitle={getRoleTitle(candidate.roleId)}
              stages={stages}
              onStageChange={onStageChange}
              onOpenDetail={onOpenDetail}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Empty state component
function EmptyState({ stage }: { stage: StageInfo }) {
  return (
    <div className="text-center py-8 px-4">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
        <Users className="w-6 h-6 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">
        No candidates in{" "}
        <span className="font-medium">{stage.label}</span>
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        Drag candidates here or use the status menu
      </p>
    </div>
  );
}


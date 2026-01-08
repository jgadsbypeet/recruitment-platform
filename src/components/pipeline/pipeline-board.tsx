"use client";

import { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Candidate, StageInfo, Role, Stage } from "@/types";
import { PipelineColumn } from "./pipeline-column";
import { CandidateCard } from "./candidate-card";
import { CandidateDetailModal } from "./candidate-detail-modal";
import { updateCandidateStageAction } from "@/app/actions";
import { toast } from "@/hooks/use-toast";

interface PipelineBoardProps {
  candidates: Candidate[];
  stages: StageInfo[];
  roles: Role[];
}

export function PipelineBoard({ candidates: initialCandidates, stages, roles }: PipelineBoardProps) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Sync candidates when the filtered list changes (e.g., from URL filter)
  useEffect(() => {
    setCandidates(initialCandidates);
  }, [initialCandidates]);

  // Configure sensors for both pointer and keyboard accessibility
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Get candidates grouped by stage
  const getCandidatesByStage = useCallback(
    (stageId: Stage) => {
      return candidates.filter((c) => c.stage === stageId);
    },
    [candidates]
  );

  // Get role title for a candidate
  const getRoleTitle = useCallback(
    (roleId: string) => {
      return roles.find((r) => r.id === roleId)?.title ?? "Unknown Role";
    },
    [roles]
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const candidate = candidates.find((c) => c.id === active.id);
    if (candidate) {
      setActiveCandidate(candidate);
    }
  };

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCandidate(null);

    if (!over) return;

    const candidateId = active.id as string;
    const newStage = over.id as Stage;

    // Find the candidate and check if stage changed
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate || candidate.stage === newStage) return;

    // Optimistic update
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );

    try {
      await updateCandidateStageAction(candidateId, newStage);
      toast({
        title: "Status Updated",
        description: `${candidate.firstName} moved to ${stages.find((s) => s.id === newStage)?.label}`,
        variant: "success",
      });
    } catch (error) {
      // Revert on error
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? { ...c, stage: candidate.stage } : c))
      );
      toast({
        title: "Update Failed",
        description: "Could not update candidate status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle stage change via dropdown (keyboard accessible alternative)
  const handleStageChange = async (candidateId: string, newStage: Stage) => {
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate || candidate.stage === newStage) return;

    // Optimistic update
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );

    try {
      await updateCandidateStageAction(candidateId, newStage);
      toast({
        title: "Status Updated",
        description: `${candidate.firstName} moved to ${stages.find((s) => s.id === newStage)?.label}`,
        variant: "success",
      });
    } catch (error) {
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? { ...c, stage: candidate.stage } : c))
      );
      toast({
        title: "Update Failed",
        description: "Could not update candidate status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle opening candidate detail
  const handleOpenDetail = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  // Update candidate in local state after changes
  const handleCandidateUpdate = (updatedCandidate: Candidate) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === updatedCandidate.id ? updatedCandidate : c))
    );
    setSelectedCandidate(updatedCandidate);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          className="h-full p-6 overflow-x-auto"
          role="region"
          aria-label="Recruitment pipeline board"
        >
          <div className="flex gap-4 h-full min-w-max">
            {stages.map((stage) => (
              <PipelineColumn
                key={stage.id}
                stage={stage}
                candidates={getCandidatesByStage(stage.id)}
                getRoleTitle={getRoleTitle}
                stages={stages}
                onStageChange={handleStageChange}
                onOpenDetail={handleOpenDetail}
              />
            ))}
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeCandidate ? (
            <CandidateCard
              candidate={activeCandidate}
              roleTitle={getRoleTitle(activeCandidate.roleId)}
              stages={stages}
              onStageChange={() => {}}
              onOpenDetail={() => {}}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          role={roles.find((r) => r.id === selectedCandidate.roleId)}
          stages={stages}
          open={!!selectedCandidate}
          onOpenChange={(open) => !open && setSelectedCandidate(null)}
          onStageChange={handleStageChange}
          onCandidateUpdate={handleCandidateUpdate}
        />
      )}
    </>
  );
}


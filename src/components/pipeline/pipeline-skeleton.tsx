import { Skeleton } from "@/components/ui/skeleton";
import type { StageInfo } from "@/types";

interface PipelineSkeletonProps {
  stages: StageInfo[];
}

export function PipelineSkeleton({ stages }: PipelineSkeletonProps) {
  return (
    <div 
      className="h-full p-6 overflow-x-auto"
      role="status"
      aria-label="Loading pipeline data"
    >
      <div className="flex gap-4 h-full min-w-max">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className="w-80 flex-shrink-0 bg-muted/30 rounded-lg p-4"
          >
            {/* Column Header */}
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-6 ml-auto rounded-full" />
            </div>

            {/* Skeleton Cards */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card rounded-lg border p-4 space-y-3"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading candidate pipeline...</span>
    </div>
  );
}


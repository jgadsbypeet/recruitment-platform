import { Suspense } from "react";
import { getCandidates, getRoles, getStages } from "@/data/data-service";
import { PipelineBoard } from "@/components/pipeline/pipeline-board";
import { PipelineSkeleton } from "@/components/pipeline/pipeline-skeleton";
import { RoleFilter } from "@/components/pipeline/role-filter";

interface AdminPageProps {
  searchParams: Promise<{
    role?: string;
  }>;
}

export const dynamic = "force-dynamic"; // Disable caching for this page

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const [candidates, roles, stages] = await Promise.all([
    getCandidates(),
    getRoles(),
    getStages(),
  ]);

  // Filter by role if specified
  const filteredCandidates = params.role
    ? candidates.filter((c) => c.roleId === params.role)
    : candidates;

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col">
      {/* Page Header */}
      <div className="border-b bg-card/50 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-serif">Recruitment Pipeline</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? "s" : ""} 
              {params.role ? " for selected role" : " across all roles"}
            </p>
          </div>
          <Suspense fallback={<div className="w-[200px] h-10 bg-muted rounded animate-pulse" />}>
            <RoleFilter roles={roles} currentRoleId={params.role} />
          </Suspense>
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<PipelineSkeleton stages={stages} />}>
          <PipelineBoard
            candidates={filteredCandidates}
            stages={stages}
            roles={roles}
          />
        </Suspense>
      </div>
    </div>
  );
}


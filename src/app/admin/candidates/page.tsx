import { Suspense } from "react";
import { Mail, Phone, Linkedin, Globe, Calendar, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCandidates, getRoles } from "@/data/data-service";
import { getStages } from "@/data/static-data";
import { formatRelativeTime, getInitials, calculateAverageScore } from "@/lib/utils";
import { StageFilter } from "@/components/pipeline/stage-filter";
import type { Stage } from "@/types";

export const dynamic = "force-dynamic";

interface CandidatesPageProps {
  searchParams: Promise<{
    stage?: Stage;
  }>;
}

export default async function CandidatesPage({ searchParams }: CandidatesPageProps) {
  const params = await searchParams;
  const [candidates, roles, stages] = await Promise.all([
    getCandidates(),
    getRoles(),
    getStages(),
  ]);

  // Filter by stage if specified
  const filteredCandidates = params.stage
    ? candidates.filter((c) => c.stage === params.stage)
    : candidates;

  // Sort by most recent
  const sortedCandidates = [...filteredCandidates].sort(
    (a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
  );

  // Get role title helper
  const getRoleTitle = (roleId: string) =>
    roles.find((r) => r.id === roleId)?.title ?? "Unknown";

  // Stage badge variants
  const stageBadgeVariants: Record<Stage, "applied" | "review" | "interview" | "offer" | "rejected"> = {
    applied: "applied",
    review: "review",
    interview: "interview",
    offer: "offer",
    rejected: "rejected",
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-serif">All Candidates</h1>
          <p className="text-muted-foreground mt-1">
            {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <Suspense fallback={<div className="w-[180px] h-10 bg-muted rounded animate-pulse" />}>
          <StageFilter stages={stages} currentStage={params.stage} />
        </Suspense>
      </div>

      {/* Candidates Table */}
      {sortedCandidates.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No candidates found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {params.stage
              ? "No candidates match the selected filter."
              : "Candidates will appear here when they apply."}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="text-left px-4 py-3 text-sm font-medium">
                    Candidate
                  </th>
                  <th scope="col" className="text-left px-4 py-3 text-sm font-medium">
                    Role
                  </th>
                  <th scope="col" className="text-left px-4 py-3 text-sm font-medium">
                    Status
                  </th>
                  <th scope="col" className="text-left px-4 py-3 text-sm font-medium">
                    Applied
                  </th>
                  <th scope="col" className="text-left px-4 py-3 text-sm font-medium">
                    Score
                  </th>
                  <th scope="col" className="text-left px-4 py-3 text-sm font-medium">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sortedCandidates.map((candidate) => {
                  const avgScore = calculateAverageScore(candidate.scores);
                  return (
                    <tr
                      key={candidate.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium flex-shrink-0"
                            aria-hidden="true"
                          >
                            {getInitials(`${candidate.firstName} ${candidate.lastName}`)}
                          </div>
                          <div>
                            <p className="font-medium">
                              {candidate.firstName} {candidate.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">{candidate.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">{getRoleTitle(candidate.roleId)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={stageBadgeVariants[candidate.stage]}>
                          {stages.find((s) => s.id === candidate.stage)?.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatRelativeTime(candidate.appliedAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {avgScore > 0 ? (
                          <span className="text-sm font-medium">{avgScore}%</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                          >
                            <a
                              href={`mailto:${candidate.email}`}
                              aria-label={`Email ${candidate.firstName}`}
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          </Button>
                          {candidate.phone && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              asChild
                            >
                              <a
                                href={`tel:${candidate.phone}`}
                                aria-label={`Call ${candidate.firstName}`}
                              >
                                <Phone className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          {candidate.linkedIn && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              asChild
                            >
                              <a
                                href={candidate.linkedIn}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${candidate.firstName}'s LinkedIn`}
                              >
                                <Linkedin className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                          {candidate.portfolio && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              asChild
                            >
                              <a
                                href={candidate.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${candidate.firstName}'s portfolio`}
                              >
                                <Globe className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}


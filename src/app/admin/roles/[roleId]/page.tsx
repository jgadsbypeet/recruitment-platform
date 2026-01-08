import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  ExternalLink,
  Pencil,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRoleById, getCandidatesByRole } from "@/data/data-service";
import { formatDate, formatSalary } from "@/lib/utils";
import { GenderScoreCard } from "@/components/admin/gender-score-card";

interface RoleDetailPageProps {
  params: {
    roleId: string;
  };
}

export default async function RoleDetailPage({ params }: RoleDetailPageProps) {
  const [role, candidates] = await Promise.all([
    getRoleById(params.roleId),
    getCandidatesByRole(params.roleId),
  ]);

  if (!role) {
    notFound();
  }

  const statusColors = {
    open: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  };

  // Combine description and requirements for analysis
  const fullJobText = `${role.title}\n${role.description}\n${role.requirements.join("\n")}`;

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      {/* Back Button */}
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/admin/roles">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Roles
        </Link>
      </Button>

      {/* Role Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={statusColors[role.status]}>{role.status}</Badge>
            <Badge variant="secondary">{role.department}</Badge>
            <Badge variant="outline">{role.type}</Badge>
          </div>
          <h1 className="text-3xl font-bold font-serif">{role.title}</h1>
          <div className="flex flex-wrap gap-4 mt-3 text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {role.location}
            </span>
            {role.salary && (
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {formatSalary(role.salary.min, role.salary.max, role.salary.currency)}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {candidates.length} applicant{candidates.length !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Created {formatDate(role.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/apply/${role.id}`} target="_blank">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Public Page
            </Link>
          </Button>
          <Button disabled>
            <Pencil className="w-4 h-4 mr-2" />
            Edit Role
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line text-muted-foreground">
                {role.description}
              </p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                {role.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Custom Questions */}
          {role.questions && role.questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Custom Application Questions
                </CardTitle>
                <CardDescription>
                  These questions will be shown to candidates when they apply.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-3">
                  {role.questions.map((q, index) => (
                    <li key={q.id} className="text-muted-foreground">
                      <span className="font-medium text-foreground">{q.question}</span>
                      <div className="ml-6 mt-1 flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {q.type}
                        </Badge>
                        {q.required && (
                          <Badge variant="secondary" className="text-xs">
                            Required
                          </Badge>
                        )}
                        {q.maxLength && (
                          <Badge variant="outline" className="text-xs">
                            Max {q.maxLength} chars
                          </Badge>
                        )}
                      </div>
                      {q.options && (
                        <div className="ml-6 mt-2 flex flex-wrap gap-1">
                          {q.options.map((opt) => (
                            <Badge key={opt} variant="secondary" className="text-xs">
                              {opt}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Gender Score Analysis */}
          <GenderScoreCard text={fullJobText} title="Inclusivity Score" />

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pipeline Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { stage: "Applied", count: candidates.filter((c) => c.stage === "applied").length },
                  { stage: "Review", count: candidates.filter((c) => c.stage === "review").length },
                  { stage: "Interview", count: candidates.filter((c) => c.stage === "interview").length },
                  { stage: "Offer", count: candidates.filter((c) => c.stage === "offer").length },
                  { stage: "Rejected", count: candidates.filter((c) => c.stage === "rejected").length },
                ].map((item) => (
                  <div key={item.stage} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.stage}</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href={`/admin?role=${role.id}`}>View in Pipeline</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


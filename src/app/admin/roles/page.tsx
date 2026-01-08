import Link from "next/link";
import { Plus, MapPin, Users, DollarSign, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getRoles, getCandidates } from "@/data/data-service";
import { formatDate, formatSalary } from "@/lib/utils";
import { analyzeGenderCoding, getGenderScoreLabel } from "@/lib/gender-decoder";
import { CreateRoleModal } from "@/components/admin/create-role-modal";

export const dynamic = "force-dynamic"; // Ensure fresh data after creating roles

export default async function RolesPage() {
  const [roles, candidates] = await Promise.all([getRoles(), getCandidates()]);

  // Count candidates per role
  const candidateCountByRole = candidates.reduce((acc, c) => {
    acc[c.roleId] = (acc[c.roleId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusColors = {
    open: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    closed: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-serif">Roles</h1>
          <p className="text-muted-foreground mt-1">
            Manage your open positions and job listings
          </p>
        </div>
        <CreateRoleModal />
      </div>

      {/* Roles Grid */}
      {roles.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No roles yet</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Create your first role to start accepting applications.
          </p>
          <CreateRoleModal />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card key={role.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <Badge className={statusColors[role.status]}>
                    {role.status}
                  </Badge>
                  <Badge variant="secondary">{role.type}</Badge>
                </div>
                <CardTitle className="mt-2">{role.title}</CardTitle>
                <CardDescription className="flex flex-wrap gap-3 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {role.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {candidateCountByRole[role.id] || 0} applicants
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {role.salary && (
                  <p className="text-sm flex items-center gap-1 text-muted-foreground mb-2">
                    <DollarSign className="w-3.5 h-3.5" />
                    {formatSalary(role.salary.min, role.salary.max, role.salary.currency)}
                  </p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {role.description}
                </p>
                {/* Inclusivity Score Indicator */}
                <div className="mt-3">
                  <InclusivityBadge description={role.description} requirements={role.requirements} />
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Created {formatDate(role.createdAt)}
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/roles/${role.id}`}>Details</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin?role=${role.id}`}>Pipeline</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Small inclusivity badge component
function InclusivityBadge({ description, requirements }: { description: string; requirements: string[] }) {
  const fullText = `${description}\n${requirements.join("\n")}`;
  const analysis = analyzeGenderCoding(fullText);
  
  const colorMap = {
    "strongly-masculine": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "masculine": "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300",
    "neutral": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "feminine": "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300",
    "strongly-feminine": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  };
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className={`text-xs gap-1 cursor-help ${colorMap[analysis.rating]}`}>
          <BarChart3 className="w-3 h-3" />
          {getGenderScoreLabel(analysis.rating)}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <p className="text-xs">{analysis.summary}</p>
      </TooltipContent>
    </Tooltip>
  );
}


import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase, DollarSign, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRoleById } from "@/data/data-service";
import { formatSalary } from "@/lib/utils";
import { ApplicationForm } from "./application-form";

interface ApplyPageProps {
  params: {
    roleId: string;
  };
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const role = await getRoleById(params.roleId);

  if (!role || role.status !== "open") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl tracking-tight">Talent Flow</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/careers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Careers
            </Link>
          </Button>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Role Information */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary">{role.department}</Badge>
                <Badge variant="outline">{role.type}</Badge>
              </div>
              <CardTitle className="text-3xl font-serif">{role.title}</CardTitle>
              <CardDescription className="flex flex-wrap gap-4 mt-3 text-base">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  {role.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" aria-hidden="true" />
                  {role.type}
                </span>
                {role.salary && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" aria-hidden="true" />
                    {formatSalary(role.salary.min, role.salary.max, role.salary.currency)}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="font-semibold text-lg mb-2">About the Role</h2>
                <p className="text-muted-foreground whitespace-pre-line">{role.description}</p>
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-2">Requirements</h2>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {role.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Application Form */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Apply for this position</CardTitle>
              <CardDescription>
                Fill out the form below to submit your application. 
                Fields marked with <span className="text-destructive">*</span> are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApplicationForm roleId={role.id} roleTitle={role.title} questions={role.questions} />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-card mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Your data is handled securely and in accordance with our privacy policy.
          </p>
        </div>
      </footer>
    </div>
  );
}


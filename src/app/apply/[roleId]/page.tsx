import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase, PawPrint, Heart } from "lucide-react";
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
    <div className="min-h-screen bg-[#FFF2E2]">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#260071] flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-[#260071] tracking-tight leading-none">RSPCA</span>
              <span className="text-[10px] text-[#260071]/70 tracking-wide">CAREERS</span>
            </div>
          </Link>
          <Button variant="ghost" asChild className="text-[#260071]">
            <Link href="/careers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Role Information */}
          <Card className="mb-8 bg-white border-t-4 border-t-[#2722F8]">
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge className="bg-[#260071]">{role.department}</Badge>
                <Badge variant="outline" className="border-[#2722F8] text-[#2722F8]">{role.type}</Badge>
              </div>
              <CardTitle className="text-3xl text-[#260071]">{role.title}</CardTitle>
              <CardDescription className="flex flex-wrap gap-4 mt-3 text-base text-[#260071]/60">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  {role.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4" aria-hidden="true" />
                  {role.type}
                </span>
                {role.salary && (
                  <span className="flex items-center gap-1.5">
                    {formatSalary(role.salary.min, role.salary.max, role.salary.currency)}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h2 className="font-semibold text-lg mb-2 text-[#260071]">About the Role</h2>
                <p className="text-[#260071]/70 whitespace-pre-line">{role.description}</p>
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-2 text-[#260071]">Requirements</h2>
                <ul className="space-y-2 text-[#260071]/70">
                  {role.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <PawPrint className="w-4 h-4 text-[#EE5335] mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Application Form */}
          <Card className="bg-white">
            <CardHeader className="border-b bg-[#260071] text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-[#EE5335]" fill="#EE5335" />
                <div>
                  <CardTitle className="text-white">Apply for this position</CardTitle>
                  <CardDescription className="text-white/70">
                    Join us in making a difference for animals
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-[#260071]/60 mb-6">
                Fields marked with <span className="text-[#EE5335] font-medium">*</span> are required.
              </p>
              <ApplicationForm roleId={role.id} roleTitle={role.title} questions={role.questions} />
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-white mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-[#260071]/70 mb-2">
            Your data is handled securely in accordance with our privacy policy and GDPR.
          </p>
          <p className="text-xs text-[#260071]/50">
            RSPCA — Registered charity no. 219099
          </p>
        </div>
      </footer>
    </div>
  );
}

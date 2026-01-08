import Link from "next/link";
import { ArrowLeft, MapPin, Clock, DollarSign, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOpenRoles } from "@/data/data-service";
import { formatSalary } from "@/lib/utils";

export default async function CareersPage() {
  const roles = await getOpenRoles();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-xl tracking-tight">Talent Flow</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main id="main-content" className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 font-serif">Open Positions</h1>
          <p className="text-lg text-muted-foreground">
            Join our team and help build products that make a difference.
            We're looking for talented people who share our values.
          </p>
        </div>

        {/* Roles List */}
        {roles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No open positions</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              We don't have any open roles right now, but check back soon! 
              We're always looking for great people to join our team.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {roles.map((role) => (
              <Card key={role.id} className="transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary">{role.department}</Badge>
                    <Badge variant="outline">{role.type}</Badge>
                  </div>
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                  <CardDescription className="flex flex-wrap gap-4 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" aria-hidden="true" />
                      <span>{role.location}</span>
                    </span>
                    {role.salary && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" aria-hidden="true" />
                        <span>{formatSalary(role.salary.min, role.salary.max, role.salary.currency)}</span>
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">
                    {role.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {role.requirements.length} requirements
                  </p>
                  <Button asChild>
                    <Link href={`/apply/${role.id}`}>
                      Apply Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Equal Opportunity Employer — We celebrate diversity and are committed to creating an inclusive environment.
          </p>
        </div>
      </footer>
    </div>
  );
}


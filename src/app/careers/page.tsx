import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Briefcase, ArrowRight, PawPrint, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getOpenRoles } from "@/data/data-service";
import { formatSalary } from "@/lib/utils";

export default async function CareersPage() {
  const roles = await getOpenRoles();

  return (
    <div className="min-h-screen bg-background">
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
          <div className="inline-flex items-center gap-2 bg-[#A0DCFE]/30 text-[#260071] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4 text-[#EE5335]" fill="#EE5335" />
            {roles.length} {roles.length === 1 ? 'opportunity' : 'opportunities'} available
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#260071]">
            Current Vacancies
          </h1>
          <p className="text-lg text-[#260071]/70">
            Join our team of passionate animal lovers and help us rescue, rehabilitate 
            and rehome animals across England and Wales.
          </p>
        </div>

        {/* Roles List */}
        {roles.length === 0 ? (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-[#A0DCFE]/20 flex items-center justify-center mx-auto mb-6">
              <PawPrint className="w-10 h-10 text-[#260071]" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-[#260071]">No open positions</h2>
            <p className="text-[#260071]/70 mb-6">
              We don't have any open roles right now, but check back soon! 
              We're always looking for compassionate people to join our team.
            </p>
            <Button asChild className="bg-[#2722F8] hover:bg-[#260071]">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {roles.map((role) => (
              <Card key={role.id} className="transition-all hover:shadow-xl border-l-4 border-l-[#2722F8] bg-white">
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge className="bg-[#260071] hover:bg-[#260071]/90">{role.department}</Badge>
                    <Badge variant="outline" className="border-[#2722F8] text-[#2722F8]">{role.type}</Badge>
                  </div>
                  <CardTitle className="text-2xl text-[#260071]">{role.title}</CardTitle>
                  <CardDescription className="flex flex-wrap gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-[#260071]/60">
                      <MapPin className="w-4 h-4" aria-hidden="true" />
                      <span>{role.location}</span>
                    </span>
                    {role.salary && (
                      <span className="flex items-center gap-1.5 text-[#260071]/60">
                        <Briefcase className="w-4 h-4" aria-hidden="true" />
                        <span>{formatSalary(role.salary.min, role.salary.max, role.salary.currency)}</span>
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-[#260071]/70 line-clamp-3">
                    {role.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-[#260071]/60">
                    <Clock className="w-4 h-4" />
                    <span>Apply now</span>
                  </div>
                  <Button asChild className="bg-[#EE5335] hover:bg-[#EE5335]/90">
                    <Link href={`/apply/${role.id}`}>
                      Apply
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {roles.length > 0 && (
          <div className="max-w-3xl mx-auto mt-16 text-center p-8 rounded-2xl bg-[#260071]">
            <PawPrint className="w-12 h-12 text-[#A0DCFE] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Don't see the right role?
            </h2>
            <p className="text-white/70 mb-6">
              We're always interested in hearing from passionate animal advocates. 
              Check back regularly for new opportunities.
            </p>
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-[#260071]">
              <Link href="/">
                Learn More About RSPCA
              </Link>
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-white mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-[#260071]/70 mb-2">
            The RSPCA is committed to equality of opportunity and welcomes applications from all sections of the community.
          </p>
          <p className="text-xs text-[#260071]/50">
            RSPCA — Registered charity no. 219099
          </p>
        </div>
      </footer>
    </div>
  );
}

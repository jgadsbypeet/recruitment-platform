import Link from "next/link";
import { ArrowRight, Heart, Users, Shield, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {/* RSPCA Logo placeholder - replace with actual logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#260071] flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-[#260071] tracking-tight leading-none">RSPCA</span>
                <span className="text-[10px] text-[#260071]/70 tracking-wide">CAREERS</span>
              </div>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/careers" className="text-sm font-medium text-[#260071]/70 hover:text-[#260071] transition-colors">
              View Jobs
            </Link>
            <Button asChild className="bg-[#2722F8] hover:bg-[#260071]">
              <Link href="/admin">
                Staff Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main id="main-content">
        <section className="py-16 md:py-24 relative overflow-hidden">
          {/* Background decoration with RSPCA colors */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-[#2722F8]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#A0DCFE]/30 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#EE5335]/5 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-[#ECE94E]/30 text-[#260071] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4 text-[#EE5335]" fill="#EE5335" />
              Join our mission to help animals
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-[#260071]">
              Make a difference.
              <br />
              <span className="text-[#2722F8]">Every single day.</span>
            </h1>
            <p className="text-xl text-[#260071]/70 max-w-2xl mx-auto mb-10">
              For over 200 years, we've been rescuing, rehabilitating and rehoming animals in need. 
              Join our team and help us create a world where all animals are treated with compassion and respect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-[#2722F8] hover:bg-[#260071] text-lg px-8">
                <Link href="/careers">
                  Explore Opportunities
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-[#260071] text-[#260071] hover:bg-[#260071] hover:text-white text-lg px-8">
                <Link href="/admin">
                  Staff Portal
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-[#260071] text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#A0DCFE]">200+</div>
                <div className="text-sm mt-1 text-white/70">Years of service</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#ECE94E]">1,700+</div>
                <div className="text-sm mt-1 text-white/70">Dedicated staff</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#A0DCFE]">100k+</div>
                <div className="text-sm mt-1 text-white/70">Animals helped yearly</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#EE5335]">∞</div>
                <div className="text-sm mt-1 text-white/70">Love for animals</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-[#A0DCFE]/10">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#260071]">
              Why work with us?
            </h2>
            <p className="text-center text-[#260071]/70 mb-12 max-w-2xl mx-auto">
              Join a team that's passionate about animal welfare and making a real difference in the world.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-none shadow-lg bg-white">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-[#2722F8]/10 flex items-center justify-center mb-4">
                    <Heart className="w-7 h-7 text-[#2722F8]" />
                  </div>
                  <CardTitle className="text-[#260071]">Meaningful Work</CardTitle>
                  <CardDescription className="text-[#260071]/60">
                    Every role contributes to animal welfare and rescue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-[#260071]/70 space-y-2">
                    <li className="flex items-center gap-2">
                      <PawPrint className="w-4 h-4 text-[#EE5335]" />
                      Direct impact on animal lives
                    </li>
                    <li className="flex items-center gap-2">
                      <PawPrint className="w-4 h-4 text-[#EE5335]" />
                      Community engagement
                    </li>
                    <li className="flex items-center gap-2">
                      <PawPrint className="w-4 h-4 text-[#EE5335]" />
                      Education & awareness programs
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-white">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-[#EE5335]/10 flex items-center justify-center mb-4">
                    <Users className="w-7 h-7 text-[#EE5335]" />
                  </div>
                  <CardTitle className="text-[#260071]">Supportive Team</CardTitle>
                  <CardDescription className="text-[#260071]/60">
                    Work alongside passionate, caring colleagues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-[#260071]/70 space-y-2">
                    <li className="flex items-center gap-2">
                      <PawPrint className="w-4 h-4 text-[#EE5335]" />
                      Collaborative environment
                    </li>
                    <li className="flex items-center gap-2">
                      <PawPrint className="w-4 h-4 text-[#EE5335]" />
                      Training & development
                    </li>
                    <li className="flex items-center gap-2">
                      <PawPrint className="w-4 h-4 text-[#EE5335]" />
                      Mental health support
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg bg-white">
                <CardHeader>
                  <div className="w-14 h-14 rounded-2xl bg-[#ECE94E]/30 flex items-center justify-center mb-4">
                    <Shield className="w-7 h-7 text-[#260071]" />
                  </div>
                  <CardTitle className="text-[#260071]">Great Benefits</CardTitle>
                  <CardDescription className="text-[#260071]/60">
                    Comprehensive package to support your wellbeing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-[#260071]/70 space-y-2">
                    <li className="flex items-center gap-2">
                      <PawPrint className="w-4 h-4 text-[#EE5335]" />
                      Competitive salary
                    </li>
                    <li className="flex items-center gap-2">
                      <PawPrint className="w-4 h-4 text-[#EE5335]" />
                      Flexible working options
                    </li>
                    <li className="flex items-center gap-2">
                      <PawPrint className="w-4 h-4 text-[#EE5335]" />
                      Generous holiday allowance
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#260071] relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#2722F8]/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#EE5335]/10 rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-4 text-center">
            <PawPrint className="w-16 h-16 text-[#A0DCFE] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to make a difference?
            </h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto text-lg">
              Browse our current vacancies and find your perfect role helping animals in need.
            </p>
            <Button size="lg" asChild className="bg-[#EE5335] hover:bg-[#EE5335]/90 text-lg px-10">
              <Link href="/careers">
                View All Jobs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#260071] flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-[#260071]">RSPCA</span>
                <p className="text-xs text-[#260071]/60">Royal Society for the Prevention of Cruelty to Animals</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-[#260071]/70">
                © {new Date().getFullYear()} RSPCA. Registered charity no. 219099
              </p>
              <p className="text-xs text-[#260071]/50 mt-1">
                Careers portal built with accessibility at its core
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

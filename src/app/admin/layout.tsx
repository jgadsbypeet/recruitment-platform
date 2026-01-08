import Link from "next/link";
import { Sparkles, Users, Briefcase, Settings, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/data/data-service";
import { getInitials } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-xl tracking-tight">Talent Flow</span>
            </Link>
            
            {/* Main Navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin" className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Pipeline
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/roles" className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Roles
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/candidates" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Candidates
                </Link>
              </Button>
            </nav>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/settings" aria-label="Settings">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium"
                aria-hidden="true"
              >
                {getInitials(user.name)}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>
    </div>
  );
}


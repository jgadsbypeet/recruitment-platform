import { User, Bell, Shield, Palette, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser } from "@/data/data-service";

export default function SettingsPage() {
  const user = getCurrentUser();

  const settingsSections = [
    {
      icon: User,
      title: "Profile",
      description: "Manage your account details and preferences",
      badge: null,
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Configure email and in-app notifications",
      badge: null,
    },
    {
      icon: Shield,
      title: "Team & Permissions",
      description: "Manage team members and access levels",
      badge: "Admin only",
    },
    {
      icon: Palette,
      title: "Appearance",
      description: "Customize themes and display settings",
      badge: null,
    },
    {
      icon: Database,
      title: "Data Export",
      description: "Export candidate data and reports",
      badge: null,
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8 max-w-3xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-serif">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and application preferences
        </p>
      </div>

      {/* Current User Info */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Current User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold">
              {user.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="secondary" className="mt-1 capitalize">
                {user.role}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      <div className="space-y-4">
        {settingsSections.map((section) => (
          <Card
            key={section.title}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <CardHeader className="flex flex-row items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <section.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-base flex items-center gap-2">
                  {section.title}
                  {section.badge && (
                    <Badge variant="outline" className="text-xs">
                      {section.badge}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="mt-0.5">
                  {section.description}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Info Notice */}
      <div className="mt-8 p-4 rounded-lg bg-muted/50 text-center">
        <p className="text-sm text-muted-foreground">
          This is a demo application. Settings pages are placeholders 
          for illustration purposes.
        </p>
      </div>
    </div>
  );
}


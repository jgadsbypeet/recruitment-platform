"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Role } from "@/types";

interface RoleFilterProps {
  roles: Role[];
  currentRoleId?: string;
}

export function RoleFilter({ roles, currentRoleId }: RoleFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRoleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "all") {
      params.delete("role");
    } else {
      params.set("role", value);
    }
    
    router.push(`/admin?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Filter className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
      <Select
        value={currentRoleId || "all"}
        onValueChange={handleRoleChange}
      >
        <SelectTrigger className="w-[200px]" aria-label="Filter by role">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.id}>
              {role.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}


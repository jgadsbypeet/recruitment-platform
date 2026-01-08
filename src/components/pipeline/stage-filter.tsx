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
import type { StageInfo } from "@/types";

interface StageFilterProps {
  stages: StageInfo[];
  currentStage?: string;
  basePath?: string;
}

export function StageFilter({ stages, currentStage, basePath = "/admin/candidates" }: StageFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStageChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "all") {
      params.delete("stage");
    } else {
      params.set("stage", value);
    }
    
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Filter className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
      <Select
        value={currentStage || "all"}
        onValueChange={handleStageChange}
      >
        <SelectTrigger className="w-[180px]" aria-label="Filter by stage">
          <SelectValue placeholder="All Stages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stages</SelectItem>
          {stages.map((stage) => (
            <SelectItem key={stage.id} value={stage.id}>
              {stage.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}


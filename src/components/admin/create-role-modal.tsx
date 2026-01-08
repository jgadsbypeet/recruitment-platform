"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Loader2, Trash2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRole, generateJobDescription } from "@/data/data-service";
import { toast } from "@/hooks/use-toast";
import { GenderScoreCard } from "./gender-score-card";

const roleSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  department: z.string().min(1, "Department is required"),
  location: z.string().min(1, "Location is required"),
  type: z.enum(["full-time", "part-time", "contract", "internship"]),
  description: z.string().min(50, "Description must be at least 50 characters"),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
});

type RoleFormValues = z.infer<typeof roleSchema>;

export function CreateRoleModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [description, setDescription] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      type: "full-time",
    },
  });

  const title = watch("title");
  const department = watch("department");
  const watchedDescription = watch("description");

  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const handleGenerateDescription = async () => {
    if (!title || !department) {
      toast({
        title: "Missing Information",
        description: "Please enter a job title and department first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateJobDescription(title, department);
      setValue("description", generated);
      setDescription(generated);
      toast({
        title: "Description Generated",
        description: "AI has generated a job description. Feel free to edit it.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data: RoleFormValues) => {
    setIsSubmitting(true);
    
    try {
      const filteredRequirements = requirements.filter((r) => r.trim());
      
      await createRole({
        title: data.title,
        department: data.department,
        location: data.location,
        type: data.type,
        description: data.description,
        requirements: filteredRequirements.length > 0 ? filteredRequirements : ["No specific requirements listed"],
        salary: data.salaryMin && data.salaryMax ? {
          min: parseInt(data.salaryMin),
          max: parseInt(data.salaryMax),
          currency: "USD",
        } : undefined,
        status: "open",
      });

      toast({
        title: "Role Created!",
        description: `${data.title} has been created and is now open for applications.`,
        variant: "success",
      });

      // Reset form and close
      reset();
      setRequirements([""]);
      setDescription("");
      setOpen(false);
      
      // Refresh the page to show new role
      router.refresh();
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Could not create the role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      reset();
      setRequirements([""]);
      setDescription("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Role</DialogTitle>
          <DialogDescription>
            Add a new position to your job board. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Job Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="e.g., Senior Software Engineer"
                error={!!errors.title}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">
                Department <span className="text-destructive">*</span>
              </Label>
              <Input
                id="department"
                {...register("department")}
                placeholder="e.g., Engineering"
                error={!!errors.department}
              />
              {errors.department && (
                <p className="text-sm text-destructive">{errors.department.message}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="e.g., Remote (US) or New York, NY"
                error={!!errors.location}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">
                Employment Type <span className="text-destructive">*</span>
              </Label>
              <Select
                defaultValue="full-time"
                onValueChange={(value) => setValue("type", value as RoleFormValues["type"])}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary Range */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salaryMin">Salary Min (USD)</Label>
              <Input
                id="salaryMin"
                type="number"
                {...register("salaryMin")}
                placeholder="e.g., 100000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryMax">Salary Max (USD)</Label>
              <Input
                id="salaryMax"
                type="number"
                {...register("salaryMax")}
                placeholder="e.g., 150000"
              />
            </div>
          </div>

          {/* Description with AI Generate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">
                Job Description <span className="text-destructive">*</span>
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateDescription}
                disabled={isGenerating || !title || !department}
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                AI Generate
              </Button>
            </div>
            <Textarea
              id="description"
              {...register("description")}
              rows={6}
              placeholder="Describe the role, responsibilities, and what makes it exciting..."
              error={!!errors.description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Inclusivity Preview */}
          {watchedDescription && watchedDescription.length > 50 && (
            <GenderScoreCard 
              text={`${title || ""}\n${watchedDescription}\n${requirements.join("\n")}`} 
              title="Inclusivity Preview"
            />
          )}

          {/* Requirements */}
          <div className="space-y-3">
            <Label>Requirements</Label>
            {requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={req}
                  onChange={(e) => handleRequirementChange(index, e.target.value)}
                  placeholder={`Requirement ${index + 1}`}
                />
                {requirements.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveRequirement(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddRequirement}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Requirement
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Role"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


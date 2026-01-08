"use client";

import { useState } from "react";
import { Star, Plus, User, BarChart3 } from "lucide-react";
import type { Candidate, Score } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addScore, getCandidateById, getScoreCategories } from "@/data/data-service";
import { toast } from "@/hooks/use-toast";
import { cn, calculateAverageScore } from "@/lib/utils";

interface ScoringSectionProps {
  candidate: Candidate;
  onCandidateUpdate: (candidate: Candidate) => void;
}

export function ScoringSection({ candidate, onCandidateUpdate }: ScoringSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedScore, setSelectedScore] = useState(0);
  const [comment, setComment] = useState("");

  const categories = getScoreCategories();
  const avgScore = calculateAverageScore(candidate.scores);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || selectedScore === 0) return;

    setIsSubmitting(true);
    try {
      await addScore(candidate.id, selectedCategory, selectedScore, comment || undefined);
      const updatedCandidate = await getCandidateById(candidate.id);
      if (updatedCandidate) {
        onCandidateUpdate(updatedCandidate);
      }
      toast({
        title: "Score Added",
        description: "Evaluation score has been saved.",
        variant: "success",
      });
      setSelectedCategory("");
      setSelectedScore(0);
      setComment("");
      setIsAdding(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Average Score Display */}
      {candidate.scores.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Score</p>
            <p className="text-2xl font-bold">{avgScore}%</p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {candidate.scores.length} evaluation{candidate.scores.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}

      {/* Add Score Form */}
      {isAdding ? (
        <form onSubmit={handleSubmit} className="border rounded-lg p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="score-category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger id="score-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCategory && (
              <p className="text-xs text-muted-foreground">
                {categories.find((c) => c.id === selectedCategory)?.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              Score <span className="text-destructive">*</span>
            </Label>
            <StarRating
              value={selectedScore}
              onChange={setSelectedScore}
              max={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="score-comment">Comment (optional)</Label>
            <Textarea
              id="score-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Add any additional context..."
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setSelectedCategory("");
                setSelectedScore(0);
                setComment("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedCategory || selectedScore === 0}
            >
              {isSubmitting ? "Saving..." : "Save Score"}
            </Button>
          </div>
        </form>
      ) : (
        <Button onClick={() => setIsAdding(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Evaluation Score
        </Button>
      )}

      {/* Scores List */}
      {candidate.scores.length === 0 ? (
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No evaluations yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add scores using the standard rubric categories
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {candidate.scores
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((score) => (
              <ScoreCard key={score.id} score={score} />
            ))}
        </div>
      )}

      {/* Scoring Rubric Reference */}
      <div className="border rounded-lg p-4">
        <h4 className="font-semibold mb-3 text-sm">Scoring Rubric</h4>
        <div className="space-y-2 text-sm">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-start gap-2">
              <span className="font-medium text-muted-foreground w-32 flex-shrink-0">
                {cat.name}:
              </span>
              <span className="text-muted-foreground">{cat.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Star Rating Component
interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
}

function StarRating({ value, onChange, max }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div
      className="flex gap-1"
      role="radiogroup"
      aria-label="Score rating"
    >
      {Array.from({ length: max }, (_, i) => i + 1).map((starValue) => (
        <button
          key={starValue}
          type="button"
          role="radio"
          aria-checked={value === starValue}
          aria-label={`${starValue} out of ${max} stars`}
          className={cn(
            "p-1 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "hover:bg-muted"
          )}
          onClick={() => onChange(starValue)}
          onMouseEnter={() => setHoverValue(starValue)}
          onMouseLeave={() => setHoverValue(0)}
        >
          <Star
            className={cn(
              "w-6 h-6 transition-colors",
              (hoverValue >= starValue || (hoverValue === 0 && value >= starValue))
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground"
            )}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground self-center">
        {value > 0 ? `${value} / ${max}` : "Select a rating"}
      </span>
    </div>
  );
}

// Score Card Component
function ScoreCard({ score }: { score: Score }) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm">{score.evaluatorName}</p>
            <p className="text-xs text-muted-foreground">{score.categoryName}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: score.maxValue }, (_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < score.value
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>
      {score.comment && (
        <p className="text-sm text-muted-foreground mt-2">{score.comment}</p>
      )}
    </div>
  );
}


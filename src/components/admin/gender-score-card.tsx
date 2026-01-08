"use client";

import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  analyzeGenderCoding,
  getGenderScoreColor,
  getGenderScoreLabel,
  type GenderAnalysisResult,
} from "@/lib/gender-decoder";
import { cn } from "@/lib/utils";

interface GenderScoreCardProps {
  text: string;
  title?: string;
}

export function GenderScoreCard({ text, title = "Inclusivity Analysis" }: GenderScoreCardProps) {
  const [analysis, setAnalysis] = useState<GenderAnalysisResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (text) {
      const result = analyzeGenderCoding(text);
      setAnalysis(result);
    }
  }, [text]);

  if (!analysis) {
    return null;
  }

  const getIcon = () => {
    switch (analysis.rating) {
      case "neutral":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "strongly-masculine":
      case "strongly-feminine":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getScoreBarPosition = () => {
    // Convert -100 to +100 score to 0-100% position
    return ((analysis.score + 100) / 200) * 100;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className={cn("font-medium", getGenderScoreColor(analysis.rating))}
          >
            {getGenderScoreLabel(analysis.rating)}
          </Badge>
        </div>
        <CardDescription>{analysis.summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Masculine</span>
            <span>Neutral</span>
            <span>Feminine</span>
          </div>
          <div className="relative h-3 bg-gradient-to-r from-blue-200 via-green-200 to-purple-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 bottom-0 w-3 bg-foreground rounded-full border-2 border-background shadow-md transition-all"
              style={{ left: `calc(${getScoreBarPosition()}% - 6px)` }}
              role="img"
              aria-label={`Score indicator at ${analysis.score}`}
            />
          </div>
        </div>

        {/* Word Counts */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
            <span className="text-muted-foreground">Masculine words</span>
            <span className="font-semibold text-blue-700 dark:text-blue-300">
              {analysis.totalMasculineCount}
            </span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
            <span className="text-muted-foreground">Feminine words</span>
            <span className="font-semibold text-purple-700 dark:text-purple-300">
              {analysis.totalFeminineCount}
            </span>
          </div>
        </div>

        {/* Suggestions */}
        {analysis.suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Recommendations</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expandable Details */}
        {(analysis.masculineWords.length > 0 || analysis.feminineWords.length > 0) && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full justify-between"
            >
              <span>View detected words</span>
              {showDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>

            {showDetails && (
              <div className="mt-3 space-y-3 text-sm">
                {analysis.masculineWords.length > 0 && (
                  <div>
                    <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                      Masculine-coded words found:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.masculineWords.map((w) => (
                        <Badge
                          key={w.word}
                          variant="outline"
                          className="text-xs bg-blue-50 dark:bg-blue-950/30"
                        >
                          {w.word}
                          {w.count > 1 && ` (${w.count})`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {analysis.feminineWords.length > 0 && (
                  <div>
                    <p className="font-medium text-purple-700 dark:text-purple-300 mb-1">
                      Feminine-coded words found:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {analysis.feminineWords.map((w) => (
                        <Badge
                          key={w.word}
                          variant="outline"
                          className="text-xs bg-purple-50 dark:bg-purple-950/30"
                        >
                          {w.word}
                          {w.count > 1 && ` (${w.count})`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


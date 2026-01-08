/**
 * Gender Decoder / Bias Analyzer
 * ===============================
 * Analyzes text for gendered language to promote more inclusive job descriptions.
 * Based on research by Danielle Gaucher, Justin Friesen, and Aaron C. Kay (2011)
 * "Evidence That Gendered Wording in Job Advertisements Exists and Sustains Gender Inequality"
 */

// Masculine-coded words (research-based)
const MASCULINE_CODED_WORDS = [
  "active",
  "adventurous",
  "aggressive",
  "ambitious",
  "analytical",
  "assertive",
  "athletic",
  "autonomous",
  "battle",
  "boast",
  "challenge",
  "champion",
  "competitive",
  "confident",
  "courageous",
  "decide",
  "decisive",
  "defend",
  "determine",
  "dominant",
  "dominate",
  "driven",
  "fearless",
  "fight",
  "force",
  "greedy",
  "head-strong",
  "headstrong",
  "hierarchy",
  "hostile",
  "impulsive",
  "independent",
  "individual",
  "intellect",
  "lead",
  "leader",
  "logic",
  "ninja",
  "objective",
  "opinion",
  "outspoken",
  "persist",
  "principle",
  "reckless",
  "rockstar",
  "self-confident",
  "selfconfident",
  "self-reliant",
  "selfreliant",
  "self-sufficient",
  "selfsufficient",
  "stubborn",
  "superior",
  "tackle",
  "thriving",
  "unreasonable",
  "warrior",
];

// Feminine-coded words (research-based)
const FEMININE_CODED_WORDS = [
  "affectionate",
  "agree",
  "caring",
  "child",
  "cheer",
  "collaborate",
  "collaborative",
  "commit",
  "communal",
  "compassion",
  "compassionate",
  "connect",
  "considerate",
  "cooperate",
  "cooperative",
  "depend",
  "emotional",
  "empath",
  "empathy",
  "feel",
  "flatterer",
  "gentle",
  "honest",
  "inclusive",
  "interdependent",
  "interpersonal",
  "kind",
  "kinship",
  "loyal",
  "modesty",
  "nag",
  "nurtur",
  "pleasant",
  "polite",
  "quiet",
  "respond",
  "sensitive",
  "share",
  "sharing",
  "submissive",
  "support",
  "supportive",
  "sympathy",
  "tender",
  "together",
  "trust",
  "understand",
  "warm",
  "whin",
  "yield",
];

// Neutral alternatives for common biased terms
const NEUTRAL_ALTERNATIVES: Record<string, string[]> = {
  aggressive: ["proactive", "driven", "results-oriented"],
  rockstar: ["high-performer", "skilled professional", "expert"],
  ninja: ["specialist", "expert", "skilled"],
  dominant: ["influential", "impactful", "effective"],
  competitive: ["motivated", "goal-oriented", "ambitious"],
  assertive: ["confident", "self-assured", "decisive"],
  chairman: ["chairperson", "chair", "head"],
  manpower: ["workforce", "staff", "team"],
  mankind: ["humanity", "people", "humankind"],
  guys: ["team", "folks", "everyone"],
  salesman: ["salesperson", "sales representative", "sales professional"],
  spokesman: ["spokesperson", "representative"],
  fireman: ["firefighter"],
  policeman: ["police officer"],
  businessman: ["business professional", "entrepreneur"],
  manmade: ["artificial", "synthetic", "manufactured"],
};

export interface GenderCodedWord {
  word: string;
  coding: "masculine" | "feminine";
  count: number;
  alternatives?: string[];
}

export interface GenderAnalysisResult {
  score: number; // -100 (very masculine) to +100 (very feminine), 0 is neutral
  rating: "strongly-masculine" | "masculine" | "neutral" | "feminine" | "strongly-feminine";
  masculineWords: GenderCodedWord[];
  feminineWords: GenderCodedWord[];
  totalMasculineCount: number;
  totalFeminineCount: number;
  suggestions: string[];
  summary: string;
}

/**
 * Analyzes text for gendered language
 */
export function analyzeGenderCoding(text: string): GenderAnalysisResult {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\W+/);
  
  const masculineWords: GenderCodedWord[] = [];
  const feminineWords: GenderCodedWord[] = [];
  
  // Count masculine-coded words
  for (const codedWord of MASCULINE_CODED_WORDS) {
    const regex = new RegExp(`\\b${codedWord}\\w*\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      masculineWords.push({
        word: codedWord,
        coding: "masculine",
        count: matches.length,
        alternatives: NEUTRAL_ALTERNATIVES[codedWord],
      });
    }
  }
  
  // Count feminine-coded words
  for (const codedWord of FEMININE_CODED_WORDS) {
    const regex = new RegExp(`\\b${codedWord}\\w*\\b`, "gi");
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      feminineWords.push({
        word: codedWord,
        coding: "feminine",
        count: matches.length,
      });
    }
  }
  
  // Calculate totals
  const totalMasculineCount = masculineWords.reduce((sum, w) => sum + w.count, 0);
  const totalFeminineCount = feminineWords.reduce((sum, w) => sum + w.count, 0);
  const totalCodedWords = totalMasculineCount + totalFeminineCount;
  
  // Calculate score (-100 to +100)
  let score = 0;
  if (totalCodedWords > 0) {
    score = Math.round(((totalFeminineCount - totalMasculineCount) / totalCodedWords) * 100);
  }
  
  // Determine rating
  let rating: GenderAnalysisResult["rating"];
  if (score <= -60) {
    rating = "strongly-masculine";
  } else if (score <= -20) {
    rating = "masculine";
  } else if (score >= 60) {
    rating = "strongly-feminine";
  } else if (score >= 20) {
    rating = "feminine";
  } else {
    rating = "neutral";
  }
  
  // Generate suggestions
  const suggestions: string[] = [];
  
  if (rating === "strongly-masculine" || rating === "masculine") {
    suggestions.push(
      "This job description uses more masculine-coded language, which research shows can discourage women and non-binary individuals from applying."
    );
    
    // Add specific word suggestions
    const wordsWithAlternatives = masculineWords.filter((w) => w.alternatives);
    if (wordsWithAlternatives.length > 0) {
      for (const word of wordsWithAlternatives.slice(0, 3)) {
        suggestions.push(
          `Consider replacing "${word.word}" with: ${word.alternatives!.join(", ")}`
        );
      }
    }
    
    suggestions.push(
      "Try adding collaborative language like 'team', 'support', 'together', or 'community'."
    );
  } else if (rating === "strongly-feminine" || rating === "feminine") {
    suggestions.push(
      "This description uses more feminine-coded language. While inclusive, balance with some achievement-oriented terms may broaden appeal."
    );
  } else {
    suggestions.push(
      "Great job! This description uses balanced, inclusive language that should appeal to candidates of all genders."
    );
  }
  
  // Generate summary
  let summary: string;
  if (totalCodedWords === 0) {
    summary = "No gendered language detected. This is a neutral job description.";
  } else if (rating === "neutral") {
    summary = `Good balance! Found ${totalMasculineCount} masculine-coded and ${totalFeminineCount} feminine-coded terms.`;
  } else if (rating === "masculine" || rating === "strongly-masculine") {
    summary = `This description leans masculine with ${totalMasculineCount} masculine-coded vs ${totalFeminineCount} feminine-coded terms.`;
  } else {
    summary = `This description leans feminine with ${totalFeminineCount} feminine-coded vs ${totalMasculineCount} masculine-coded terms.`;
  }
  
  return {
    score,
    rating,
    masculineWords: masculineWords.sort((a, b) => b.count - a.count),
    feminineWords: feminineWords.sort((a, b) => b.count - a.count),
    totalMasculineCount,
    totalFeminineCount,
    suggestions,
    summary,
  };
}

/**
 * Get a color class based on the rating
 */
export function getGenderScoreColor(rating: GenderAnalysisResult["rating"]): string {
  switch (rating) {
    case "strongly-masculine":
      return "text-blue-600 dark:text-blue-400";
    case "masculine":
      return "text-blue-500 dark:text-blue-300";
    case "neutral":
      return "text-green-600 dark:text-green-400";
    case "feminine":
      return "text-purple-500 dark:text-purple-300";
    case "strongly-feminine":
      return "text-purple-600 dark:text-purple-400";
  }
}

/**
 * Get a human-readable label for the rating
 */
export function getGenderScoreLabel(rating: GenderAnalysisResult["rating"]): string {
  switch (rating) {
    case "strongly-masculine":
      return "Strongly Masculine-Coded";
    case "masculine":
      return "Masculine-Coded";
    case "neutral":
      return "Gender Neutral";
    case "feminine":
      return "Feminine-Coded";
    case "strongly-feminine":
      return "Strongly Feminine-Coded";
  }
}


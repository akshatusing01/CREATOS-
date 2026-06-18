/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProfileMemory {
  language: string;
  niche: string;
  tone: string;
  style: string;
  hookStyle: string;
  ctaStyle: string;
  rewriteStrength: string;
}

export interface Scripts {
  originalCleaned: string;
  improved: string;
  viral: string;
  storytelling: string;
  short: string;
  longer: string;
  hookFirst: string;
}

export interface Hooks {
  curiosity: string[];
  shock: string[];
  negative: string[];
  story: string[];
  question: string[];
  contrarian: string[];
  scrollStopper: string[];
}

export interface CTAs {
  follow: string[];
  comment: string[];
  save: string[];
  share: string[];
  part2: string[];
  dm: string[];
}

export interface Captions {
  shortFormat: string;
  viralFormat: string;
  emotionalFormat: string;
  seoFriendly: string;
  storytelling: string;
}

export interface Hashtags {
  broad: string[];
  niche: string[];
  topicSpecific: string[];
  platformFriendlySets: string[][];
}

export interface Keywords {
  primary: string[];
  related: string[];
  longTail: string[];
  searchPhrases: string[];
}

export interface Titles {
  titleIdeas: string[];
  headlines: string[];
  scrollStopping: string[];
}

export interface ThumbnailText {
  short: string[];
  punchy: string[];
  curiosityBased: string[];
}

export interface ViralScore {
  hookStrength: number;
  curiosity: number;
  retention: number;
  clarity: number;
  viralityPotential: number;
  overallScore: number;
  explanation: string;
}

export interface RetentionAnalysis {
  pipeline: {
    hook: string;
    setup: string;
    tension: string;
    payoff: string;
    cta: string;
  };
  weaknesses: string[];
  suggestions: string[];
}

export interface StyleNotes {
  style: string;
  audienceMatch: string;
  pacing: string;
  tone: string;
  emotionalEnergy: string;
  strongestAngle: string;
}

export interface FullVersionItem {
  title: string;
  script: string;
  caption: string;
  hook: string;
}

export interface FullVersions {
  conservative: FullVersionItem;
  viral: FullVersionItem;
  storytelling: FullVersionItem;
  concise: FullVersionItem;
}

export interface ContentPackage {
  scripts: Scripts;
  hooks: Hooks;
  ctas: CTAs;
  captions: Captions;
  hashtags: Hashtags;
  keywords: Keywords;
  titles: Titles;
  thumbnailText: ThumbnailText;
  viralScore: ViralScore;
  retentionAnalysis: RetentionAnalysis;
  styleNotes: StyleNotes;
  fullVersions: FullVersions;
  notes?: string;
}

export interface SavedProject {
  id: string;
  name: string;
  timestamp: string;
  inputText: string;
  config: {
    contentType: string;
    language: string;
    niche: string;
    tone: string;
    platform: string;
    rewriteStrength: string;
    goal: string;
    style: string;
  };
  packageData: ContentPackage;
}

// ==========================================
// Creator Intelligence Data Contract Types
// ==========================================

export interface IntelAccount {
  platform: string;
  username: string;
  profileUrl: string;
  niche: string;
  audienceType: string;
  contentPillars: string[];
  toneOfVoice: string;
  visualStyle: string;
  postingFrequency: string;
  consistencyScore: number;
  dataConfidence: number;
}

export interface IntelCreatorDNA {
  summary: string;
  bestFormat: string;
  bestHookType: string;
  bestCtaType: string;
  bestLengthRange: string;
  mainBottleneck: string;
  biggestOpportunity: string;
  nextFocusArea: string;
}

export interface IntelScoreItem {
  score: number;
  reason: string;
  fix: string;
}

export interface IntelPerformanceScores {
  hookStrength: IntelScoreItem;
  retentionPotential: IntelScoreItem;
  flowClarity: IntelScoreItem;
  emotionalPull: IntelScoreItem;
  ctaStrength: IntelScoreItem;
  packagingStrength: IntelScoreItem;
  audienceMatch: IntelScoreItem;
  overallQuality: IntelScoreItem;
}

export interface IntelWinnerItem {
  postId: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  score: number;
  whyItWorked: string;
  hookType: string;
  emotionalTrigger: string;
  retentionDrivers: string[];
  ctaType: string;
  patternTags: string[];
}

export interface IntelFailureItem {
  postId: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  score: number;
  whyItUnderperformed: string;
  problemAreas: string[];
  fixSuggestions: string[];
  betterVersionDirection: string;
}

export interface IntelScriptBreakdownItem {
  score: number;
  present: boolean;
  notes: string;
  fix: string;
}

export interface IntelScriptBreakdown {
  hook: IntelScriptBreakdownItem;
  setup: IntelScriptBreakdownItem;
  problem: IntelScriptBreakdownItem;
  curiosityGap: IntelScriptBreakdownItem;
  proof: IntelScriptBreakdownItem;
  value: IntelScriptBreakdownItem;
  story: IntelScriptBreakdownItem;
  transition: IntelScriptBreakdownItem;
  cta: IntelScriptBreakdownItem;
  closing: IntelScriptBreakdownItem;
}

export interface IntelGrowthCoach {
  keepDoing: string[];
  stopDoing: string[];
  improveFirst: string[];
  testNext: string[];
  bottleneck: string;
  highestLeverageFix: string;
  nextImprovementLayer: string;
}

export interface IntelContentStrategy {
  nextTopics: string[];
  anglesToTry: string[];
  formatsToTry: string[];
  formatsToAvoid: string[];
  contentGaps: string[];
  opportunities: string[];
}

export interface IntelScriptDoctor {
  originalScript: string;
  strengths: string[];
  weaknesses: string[];
  rewrite: string;
  shortRewrite: string;
  hookOptions: string[];
  ctaOptions: string[];
  notes: string;
}

export interface IntelHistoryReportMeta {
  reportId: string;
  createdAt: string;
  saved: boolean;
}

export interface CreatorIntelligenceReport {
  workspace: "creator_intelligence";
  account: IntelAccount;
  creatorDNA: IntelCreatorDNA;
  performanceScores: IntelPerformanceScores;
  winnerAnalysis: IntelWinnerItem[];
  failureAnalysis: IntelFailureItem[];
  scriptBreakdown: IntelScriptBreakdown;
  growthCoach: IntelGrowthCoach;
  contentStrategy: IntelContentStrategy;
  scriptDoctor: IntelScriptDoctor;
  history: IntelHistoryReportMeta;
  confidence: {
    overall: number;
    notes: string;
  };
}

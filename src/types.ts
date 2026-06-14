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

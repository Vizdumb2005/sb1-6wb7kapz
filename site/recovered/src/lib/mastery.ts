// ============================================================
// DBMS Quiz 2 Prep — Mastery Calculation Logic
// ============================================================

import { SubskillMastery, Attempt, ErrorNotebookEntry, ReviewItem, SPACED_INTERVALS } from './types';

/**
 * Mastery Rule (transparent to the learner):
 * A subskill becomes Mastered when:
 *   - At least 80% accuracy over the last 5+ questions
 *   - At least 2 of those correct answers were achieved without hints
 * Status progression: learning → practising → mastered
 */

export function computeMastery(attempts: Attempt[], hintsUsedByAttempt: number[]): SubskillMastery {
  const recent = attempts.slice(-10);
  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter(a => a.isCorrect).length;
  const recentResults = recent.map(a => a.isCorrect);
  const hintFreeCorrect = attempts.filter((a, i) => a.isCorrect && hintsUsedByAttempt[i] === 0).length;

  const recentCorrect = recent.filter(a => a.isCorrect).length;
  const recentCount = recent.length;
  const accuracy = recentCount > 0 ? (recentCorrect / recentCount) * 100 : 0;

  let status: SubskillMastery['status'] = 'learning';
  if (recentCount >= 5 && accuracy >= 80 && hintFreeCorrect >= 2) {
    status = 'mastered';
  } else if (recentCount >= 2) {
    status = 'practising';
  }

  return {
    totalAttempts,
    correctAttempts,
    recentResults,
    hintFreeCorrect,
    mastery: Math.round(accuracy),
    status,
    lastAttemptDate: attempts.length > 0 ? attempts[attempts.length - 1].timestamp : null,
    subskill: '',
    moduleId: '',
  };
}

export function isMastered(sm: SubskillMastery): boolean {
  return sm.status === 'mastered';
}

export function getModuleMastery(
  subskillMasteries: Record<string, SubskillMastery>,
  moduleSubskills: string[]
): number {
  if (moduleSubskills.length === 0) return 0;
  const values = moduleSubskills
    .map(sk => subskillMasteries[sk]?.mastery ?? 0);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export function getModuleStatus(
  subskillMasteries: Record<string, SubskillMastery>,
  moduleSubskills: string[],
  reviewDue: boolean
): 'not-started' | 'learning' | 'practising' | 'mastered' | 'review-due' {
  if (moduleSubskills.length === 0) return 'not-started';

  const anyStarted = moduleSubskills.some(sk => 
    (subskillMasteries[sk]?.totalAttempts ?? 0) > 0
  );
  if (!anyStarted) return 'not-started';
  if (reviewDue) return 'review-due';

  const avgMastery = getModuleMastery(subskillMasteries, moduleSubskills);
  if (avgMastery >= 80) return 'mastered';
  if (avgMastery >= 40) return 'practising';
  return 'learning';
}

/** Compute exam readiness: weighted by topic priority */
export function computeExamReadiness(
  subskillMasteries: Record<string, SubskillMastery>,
  moduleSubskillsMap: Record<string, string[]>,
  modulePriorities: Record<string, string>
): number {
  const weights: Record<string, number> = { P0: 4, P1: 2, P2: 1 };
  let totalWeight = 0;
  let weightedSum = 0;

  for (const [moduleId, subskills] of Object.entries(moduleSubskillsMap)) {
    const priority = modulePriorities[moduleId] || 'P2';
    const w = weights[priority] * subskills.length;
    const m = getModuleMastery(subskillMasteries, subskills);
    totalWeight += w;
    weightedSum += m * w;
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

/** Get the next review interval after a successful review */
export function getNextInterval(currentInterval: number): number {
  const idx = SPACED_INTERVALS.indexOf(currentInterval as typeof SPACED_INTERVALS[number]);
  if (idx >= 0 && idx < SPACED_INTERVALS.length - 1) {
    return SPACED_INTERVALS[idx + 1];
  }
  return SPACED_INTERVALS[SPACED_INTERVALS.length - 1];
}

/** Check if a review item is due */
export function isReviewDue(item: ReviewItem): boolean {
  return Date.now() >= item.nextReviewDate;
}

/** Create an error notebook entry from a wrong attempt */
export function createErrorEntry(
  questionId: string,
  questionStem: string,
  moduleId: string,
  subskill: string,
  userAnswer: string | string[] | number | null,
  correctAnswer: string,
  misconception: string,
  repairLesson: string,
  fullExplanation: string,
  wasConfidentButWrong: boolean
): ErrorNotebookEntry {
  return {
    questionId,
    questionStem,
    moduleId,
    subskill,
    userAnswer,
    correctAnswer,
    misconception,
    repairLesson,
    fullExplanation,
    timestamp: Date.now(),
    nextReviewDate: Date.now() + 1 * 24 * 60 * 60 * 1000, // 1 day
    wasConfidentButWrong,
  };
}

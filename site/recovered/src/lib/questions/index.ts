// ============================================================
// Question Bank Index — Central Registry
// ============================================================

import { Question, DiagnosticQuestion } from '../types';
import { allFdQuestions } from './fd';
import { allNormalizationQuestions } from './normalization';
import { allDecompositionQuestions } from './decomposition';
import { allDiskQuestions } from './disk';
import { allLruQuestions } from './lru';
import { allBstQuestions } from './bst';
import { allSqlQuestions } from './sql';
import { allErQuestions } from './er';
import { diagnosticQuestions } from './diagnostic';
import { mockExamConfigs, getMockExam } from './mock';

const allQuestions: Question[] = [
  ...allFdQuestions,
  ...allNormalizationQuestions,
  ...allDecompositionQuestions,
  ...allDiskQuestions,
  ...allLruQuestions,
  ...allBstQuestions,
  ...allSqlQuestions,
  ...allErQuestions,
];

export function getAllQuestions(): Question[] {
  return allQuestions;
}

export function getQuestionsByModule(moduleId: string): Question[] {
  return allQuestions.filter(q => q.moduleId === moduleId);
}

export function getQuestionsBySubskill(subskill: string): Question[] {
  return allQuestions.filter(q => q.subskill === subskill);
}

export function getQuestionsByDifficulty(difficulty: string): Question[] {
  return allQuestions.filter(q => q.difficulty === difficulty);
}

export interface QuestionFilter {
  moduleId?: string;
  subskill?: string;
  difficulty?: string;
  format?: string;
  excludeIds?: Set<string>;
}

export function getRandomQuestions(count: number, filters?: QuestionFilter): Question[] {
  let pool = [...allQuestions];

  if (filters?.moduleId) {
    pool = pool.filter(q => q.moduleId === filters.moduleId);
  }
  if (filters?.subskill) {
    pool = pool.filter(q => q.subskill === filters.subskill);
  }
  if (filters?.difficulty) {
    pool = pool.filter(q => q.difficulty === filters.difficulty);
  }
  if (filters?.format) {
    pool = pool.filter(q => q.format === filters.format);
  }
  if (filters?.excludeIds) {
    pool = pool.filter(q => !filters.excludeIds!.has(q.id));
  }

  // Shuffle and pick
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getQuestionById(id: string): Question | undefined {
  return allQuestions.find(q => q.id === id);
}

export function getDiagnosticQuestions(): DiagnosticQuestion[] {
  return diagnosticQuestions;
}

export { mockExamConfigs, getMockExam };

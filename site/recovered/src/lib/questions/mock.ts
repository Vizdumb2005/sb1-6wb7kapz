// ============================================================
// Mock Exam Configurations
// ============================================================

import { Question, MockType } from '../types';
import { allFdQuestions } from './fd';
import { allNormalizationQuestions } from './normalization';
import { allDecompositionQuestions } from './decomposition';
import { allDiskQuestions } from './disk';
import { allLruQuestions } from './lru';
import { allBstQuestions } from './bst';
import { allSqlQuestions } from './sql';
import { allErQuestions } from './er';

function pickQuestions(questions: Question[], count: number, excludeIds: Set<string> = new Set()): Question[] {
  const eligible = questions.filter(q => !excludeIds.has(q.id) && q.source !== 'worked-example' && q.source !== 'guided');
  const shuffled = [...eligible].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function buildMock(used: Set<string>): Set<string> {
  return used;
}

const usedIds = new Set<string>();

// Diagnostic Mini-Mock: 10 questions, 10 minutes
export const diagnosticMiniMock: Question[] = [
  ...pickQuestions(allFdQuestions, 2, usedIds),
  ...pickQuestions(allNormalizationQuestions, 1, usedIds),
  ...pickQuestions(allDiskQuestions, 2, usedIds),
  ...pickQuestions(allLruQuestions, 1, usedIds),
  ...pickQuestions(allBstQuestions, 2, usedIds),
  ...pickQuestions(allSqlQuestions, 1, usedIds),
  ...pickQuestions(allErQuestions, 1, usedIds),
];

diagnosticMiniMock.forEach(q => usedIds.add(q.id));

// Mixed Practice Mock: 20 questions, 20 minutes
export const mixedPracticeMock: Question[] = [
  ...pickQuestions(allFdQuestions, 3, usedIds),
  ...pickQuestions(allNormalizationQuestions, 2, usedIds),
  ...pickQuestions(allDecompositionQuestions, 2, usedIds),
  ...pickQuestions(allDiskQuestions, 3, usedIds),
  ...pickQuestions(allLruQuestions, 2, usedIds),
  ...pickQuestions(allBstQuestions, 3, usedIds),
  ...pickQuestions(allSqlQuestions, 3, usedIds),
  ...pickQuestions(allErQuestions, 2, usedIds),
];

mixedPracticeMock.forEach(q => usedIds.add(q.id));

// Full 50-mark Mock: ~15 questions, 50 minutes, weighted to PYQ pattern
export const fullMock: Question[] = [
  ...pickQuestions(allFdQuestions, 3, usedIds),
  ...pickQuestions(allNormalizationQuestions, 2, usedIds),
  ...pickQuestions(allDecompositionQuestions, 2, usedIds),
  ...pickQuestions(allDiskQuestions, 2, usedIds),
  ...pickQuestions(allLruQuestions, 1, usedIds),
  ...pickQuestions(allBstQuestions, 3, usedIds),
  ...pickQuestions(allSqlQuestions, 2, usedIds),
  ...pickQuestions(allErQuestions, 1, usedIds),
];

fullMock.forEach(q => usedIds.add(q.id));

export interface MockExamConfig {
  id: string;
  title: string;
  type: MockType;
  timeLimitMinutes: number;
  questions: Question[];
  description: string;
}

export const mockExamConfigs: MockExamConfig[] = [
  {
    id: 'diagnostic-mini',
    title: '10-Minute Diagnostic Mini-Mock',
    type: 'diagnostic',
    timeLimitMinutes: 10,
    questions: diagnosticMiniMock,
    description: 'Quick diagnostic across all topics to gauge your current level.',
  },
  {
    id: 'mixed-practice',
    title: '20-Minute Mixed Practice',
    type: 'mini-mock',
    timeLimitMinutes: 20,
    questions: mixedPracticeMock,
    description: 'Mixed practice with questions from every topic at exam difficulty.',
  },
  {
    id: 'full-mock',
    title: '50-Mark Quiz 2 Style Mock',
    type: 'full-mock',
    timeLimitMinutes: 50,
    questions: fullMock,
    description: 'Full-length mock exam weighted to match the actual Quiz 2 PYQ pattern.',
  },
];

export function getMockExam(configId: string): MockExamConfig | undefined {
  return mockExamConfigs.find(c => c.id === configId);
}

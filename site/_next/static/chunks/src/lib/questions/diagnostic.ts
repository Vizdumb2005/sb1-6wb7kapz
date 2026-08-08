// ============================================================
// Diagnostic Questions — 12 mixed questions for initial assessment
// ============================================================

import { DiagnosticQuestion, Question } from '../types';
import { allFdQuestions } from './fd';
import { allNormalizationQuestions } from './normalization';
import { allDiskQuestions } from './disk';
import { allLruQuestions } from './lru';
import { allBstQuestions } from './bst';
import { allSqlQuestions } from './sql';
import { allErQuestions } from './er';

function pickBySubskill(questions: Question[], subskill: string, count: number): DiagnosticQuestion[] {
  const filtered = questions.filter(q => q.subskill === subskill && q.source !== 'worked-example' && q.source !== 'guided');
  const picked = filtered.slice(0, count);
  return picked.map(q => ({ question: q, topic: q.moduleId }));
}

function pickFromModule(questions: Question[], count: number): DiagnosticQuestion[] {
  const filtered = questions.filter(q => q.source !== 'worked-example' && q.source !== 'guided');
  const picked = filtered.slice(0, count);
  return picked.map(q => ({ question: q, topic: q.moduleId }));
}

export const diagnosticQuestions: DiagnosticQuestion[] = [
  // 4 FD/normalization
  ...pickBySubskill(allFdQuestions, 'closure-computation', 1),
  ...pickBySubskill(allFdQuestions, 'candidate-key-finding', 1),
  ...pickBySubskill(allFdQuestions, 'superkey-counting', 1),
  ...pickFromModule(allNormalizationQuestions, 1),
  // 2 SQL/psycopg2
  ...pickFromModule(allSqlQuestions, 2),
  // 2 disk/buffer
  ...pickFromModule(allDiskQuestions, 1),
  ...pickFromModule(allLruQuestions, 1),
  // 2 BST
  ...pickFromModule(allBstQuestions, 2),
  // 2 theory/ER
  ...pickFromModule(allErQuestions, 2),
].slice(0, 12);

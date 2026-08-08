// ============================================================
// DBMS Quiz 2 Prep — Core Type Definitions
// ============================================================

// --- Question Types ---

export type QuestionFormat = 'mcq' | 'msq' | 'numeric-sa';

export type Difficulty = 'Foundation' | 'Exam' | 'Challenge';

export type QuestionSource = 'PYQ-inspired' | 'worked-example' | 'guided' | 'mastery-check';

export interface Hint {
  level: 1 | 2 | 3;
  text: string;
}

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface BaseQuestion {
  id: string;
  moduleId: string;
  subskill: string;
  format: QuestionFormat;
  difficulty: Difficulty;
  source: QuestionSource;
  stem: string;
  hints: Hint[];
  fullExplanation: string;
  commonMisconception: string;
  askConfidence?: boolean; // only for selected questions
}

export interface MCQQuestion extends BaseQuestion {
  format: 'mcq';
  options: MCQOption[];
}

export interface MSQQuestion extends BaseQuestion {
  format: 'msq';
  options: MCQOption[]; // multiple can be correct
}

export interface NumericSAQuestion extends BaseQuestion {
  format: 'numeric-sa';
  correctAnswer: number;
  tolerance?: number; // e.g. 0.01 for ±0.01 tolerance
  unit?: string;
  expectedFormat?: string; // e.g. "integer", "1 decimal"
}

export type Question = MCQQuestion | MSQQuestion | NumericSAQuestion;

// --- Module / Topic Types ---

export type ModuleStatus = 'not-started' | 'learning' | 'practising' | 'mastered' | 'review-due';

export interface ModuleDef {
  id: string;
  title: string;
  shortTitle: string;
  priority: 'P0' | 'P1' | 'P2';
  description: string;
  whyItMatters: string;
  objectives: string[];
  subskills: string[];
}

// --- User Attempt Types ---

export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface Attempt {
  questionId: string;
  timestamp: number;
  isCorrect: boolean;
  selectedAnswer: string | string[] | number | null;
  hintsUsed: number;
  confidence?: ConfidenceLevel;
  timeSpentMs?: number;
}

export interface ErrorNotebookEntry {
  questionId: string;
  questionStem: string;
  moduleId: string;
  subskill: string;
  userAnswer: string | string[] | number | null;
  correctAnswer: string;
  misconception: string;
  repairLesson: string;
  fullExplanation: string;
  timestamp: number;
  nextReviewDate: number;
  wasConfidentButWrong: boolean;
}

// --- Mastery Types ---

export interface SubskillMastery {
  subskill: string;
  moduleId: string;
  totalAttempts: number;
  correctAttempts: number;
  recentResults: boolean[]; // last N results (max 10)
  hintFreeCorrect: number; // correct without hints
  mastery: number; // 0-100
  status: 'learning' | 'practising' | 'mastered';
  lastAttemptDate: number | null;
}

// --- Review Types ---

export interface ReviewItem {
  questionId: string;
  moduleId: string;
  subskill: string;
  reason: 'incorrect' | 'low-confidence' | 'spaced-review' | 'confident-wrong';
  nextReviewDate: number;
  interval: number; // days: 1, 3, or 7
  reviewCount: number;
}

// --- Spaced Repetition ---

export const SPACED_INTERVALS = [1, 3, 7] as const; // days

// --- Mock Exam Types ---

export type MockType = 'diagnostic' | 'mini-mock' | 'full-mock';

export interface MockExamResult {
  id: string;
  type: MockType;
  timestamp: number;
  totalQuestions: number;
  correctCount: number;
  scoreByTopic: Record<string, { correct: number; total: number }>;
  scoreByFormat: Record<string, { correct: number; total: number }>;
  attempts: Attempt[];
}

// --- Onboarding Types ---

export interface OnboardingData {
  completed: boolean;
  examDate?: string;
  studyTimePerDay?: number; // minutes
  topicConfidence: Record<string, number>; // 1-5 rating
  diagnosticScore: number;
  diagnosticResults: Attempt[];
  studyPath: Record<string, 'start-here' | 'need-review' | 'already-strong'>;
}

// --- Store Types ---

export interface AppState {
  // Onboarding
  onboarding: OnboardingData;

  // Module progress
  moduleStatus: Record<string, ModuleStatus>;
  moduleCurrentStep: Record<string, number>; // which step/section in module

  // Attempts & Mastery
  attempts: Record<string, Attempt[]>; // questionId -> attempts[]
  subskillMastery: Record<string, SubskillMastery>;

  // Error Notebook
  errorNotebook: ErrorNotebookEntry[];

  // Review Queue
  reviewQueue: ReviewItem[];

  // Mock Results
  mockResults: MockExamResult[];

  // Settings
  settings: {
    reducedMotion: boolean;
    fontSize: 'normal' | 'large' | 'xlarge';
    highContrast: boolean;
  };

  // Navigation
  currentPage: string;
  currentModule: string | null;
}

// --- Module Content Section Types ---

export interface ModuleSection {
  id: string;
  title: string;
  type: 'intro' | 'lesson' | 'worked-example' | 'guided-practice' | 'independent-practice' | 'mastery-check' | 'summary';
  content: LessonContent[];
}

export interface LessonContent {
  type: 'text' | 'formula-card' | 'code-block' | 'comparison-table' | 'warning' | 'tip' | 'interactive-lab';
  content: string;
  title?: string;
  labType?: 'fd-lab' | 'normalization-tree' | 'decomposition' | 'disk-calc' | 'lru-sim' | 'bst-play' | 'sql-sandbox';
  items?: { left: string; right: string }[]; // for comparison tables
  code?: string;
  language?: string;
}

// --- Diagnostic Question Pool ---
export interface DiagnosticQuestion {
  question: Question;
  topic: string;
}

// ============================================================
// DBMS Quiz 2 Prep — Zustand Store with localStorage Persistence
// ============================================================

import { create } from 'zustand';
import { AppState, Attempt, ErrorNotebookEntry, ReviewItem, ModuleStatus, OnboardingData, MockExamResult, ConfidenceLevel } from './types';
import { computeMastery, createErrorEntry, getNextInterval, isReviewDue } from './mastery';
import { modules } from './modules';

const STORAGE_KEY = 'dbms-quiz2-prep-state';

const defaultOnboarding: OnboardingData = {
  completed: false,
  topicConfidence: {},
  diagnosticScore: 0,
  diagnosticResults: [],
  studyPath: {},
};

const defaultSettings: AppState['settings'] = {
  reducedMotion: false,
  fontSize: 'normal',
  highContrast: false,
};

function getInitialState(): AppState {
  if (typeof window === 'undefined') {
    return {
      onboarding: defaultOnboarding,
      moduleStatus: {},
      moduleCurrentStep: {},
      attempts: {},
      subskillMastery: {},
      errorNotebook: [],
      reviewQueue: [],
      mockResults: [],
      settings: defaultSettings,
      currentPage: 'dashboard',
      currentModule: null,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...getDefaultState(), ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load saved state:', e);
  }
  return getDefaultState();
}

function getDefaultState(): AppState {
  return {
    onboarding: defaultOnboarding,
    moduleStatus: {},
    moduleCurrentStep: {},
    attempts: {},
    subskillMastery: {},
    errorNotebook: [],
    reviewQueue: [],
    mockResults: [],
    settings: defaultSettings,
    currentPage: 'dashboard',
    currentModule: null,
  };
}

function persist(state: AppState) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to persist state:', e);
    }
  }
}

interface AppActions {
  // Navigation
  navigate: (page: string, moduleId?: string | null) => void;

  // Onboarding
  setOnboarding: (data: Partial<OnboardingData>) => void;
  completeOnboarding: () => void;

  // Attempts
  recordAttempt: (attempt: Attempt) => void;
  recordAttemptWithMeta: (attempt: Attempt, subskill: string, moduleId: string, questionStem: string, correctAnswerStr: string, misconception: string, repairLesson: string, fullExplanation: string) => void;

  // Error Notebook
  addToErrorNotebook: (entry: ErrorNotebookEntry) => void;
  removeFromErrorNotebook: (questionId: string) => void;

  // Review Queue
  addToReviewQueue: (item: ReviewItem) => void;
  getDueReviewItems: () => ReviewItem[];
  markReviewComplete: (questionId: string) => void;

  // Module progress
  updateModuleStatus: (moduleId: string, status: ModuleStatus) => void;
  setModuleStep: (moduleId: string, step: number) => void;

  // Mock
  addMockResult: (result: MockExamResult) => void;

  // Settings
  updateSettings: (settings: Partial<AppState['settings']>) => void;

  // Reset
  resetAll: () => void;
  exportData: () => string;

  // Computed helpers
  getModuleMastery: (moduleId: string) => number;
  getModuleStatus: (moduleId: string) => ModuleStatus;
  getExamReadiness: () => number;
  getNextBestActivity: () => { page: string; moduleId?: string; label: string };
}

export const useStore = create<AppState & AppActions>((set, get) => ({
  ...getInitialState(),

  navigate: (page, moduleId = null) => {
    set({ currentPage: page, currentModule: moduleId });
    window.location.hash = moduleId ? `${page}/${moduleId}` : page;
  },

  setOnboarding: (data) => {
    const state = get();
    const onboarding = { ...state.onboarding, ...data };
    set({ onboarding });
    persist({ ...state, onboarding });
  },

  completeOnboarding: () => {
    const state = get();
    const onboarding = { ...state.onboarding, completed: true };
    set({ onboarding, currentPage: 'dashboard' });
    persist({ ...state, onboarding, currentPage: 'dashboard' });
  },

  recordAttempt: (attempt) => {
    const state = get();
    const questionAttempts = [...(state.attempts[attempt.questionId] || []), attempt];
    const attempts = { ...state.attempts, [attempt.questionId]: questionAttempts };

    // Get question subskill info from module definitions
    let subskill = 'general';
    let moduleId = 'unknown';
    for (const mod of modules) {
      // We'll resolve this when questions are loaded with their metadata
    }

    // Recompute subskill mastery
    const subskillMastery = { ...state.subskillMastery };
    // The mastery is recomputed when the question engine processes it

    // Update module status
    const moduleStatus = { ...state.moduleStatus };

    set({ attempts, subskillMastery, moduleStatus });
    persist({ ...state, attempts, subskillMastery, moduleStatus });
  },

  recordAttemptWithMeta: (attempt: Attempt, subskill: string, moduleId: string, questionStem: string, correctAnswerStr: string, misconception: string, repairLesson: string, fullExplanation: string) => {
    const state = get();
    const questionAttempts = [...(state.attempts[attempt.questionId] || []), attempt];
    const attempts = { ...state.attempts, [attempt.questionId]: questionAttempts };

    // Update subskill mastery
    const allSubskillAttempts = Object.values(attempts)
      .flat()
      .filter(a => {
        // Filter by subskill - we store this in a side map
        return true;
      });

    const subskillMastery = { ...state.subskillMastery };
    const skAttempts = questionAttempts;
    const hintsUsed = skAttempts.map(a => a.hintsUsed || 0);
    const computed = computeMastery(skAttempts, hintsUsed);
    subskillMastery[subskill] = {
      ...computed,
      subskill,
      moduleId,
    };

    // Handle incorrect answer: error notebook + review queue
    const errorNotebook = [...state.errorNotebook];
    const reviewQueue = [...state.reviewQueue];

    if (!attempt.isCorrect) {
      const wasConfident = attempt.confidence === 'high' && !attempt.isCorrect;
      const entry = createErrorEntry(
        attempt.questionId,
        questionStem,
        moduleId,
        subskill,
        attempt.selectedAnswer,
        correctAnswerStr,
        misconception,
        repairLesson,
        fullExplanation,
        wasConfident
      );
      
      // Replace existing entry for same question
      const existingIdx = errorNotebook.findIndex(e => e.questionId === attempt.questionId);
      if (existingIdx >= 0) {
        errorNotebook[existingIdx] = entry;
      } else {
        errorNotebook.push(entry);
      }

      // Add to review queue
      const reviewReason = wasConfident ? 'confident-wrong' : 'incorrect';
      const existingReview = reviewQueue.findIndex(r => r.questionId === attempt.questionId);
      if (existingReview >= 0) {
        reviewQueue[existingReview] = {
          ...reviewQueue[existingReview],
          nextReviewDate: Date.now() + 1 * 24 * 60 * 60 * 1000,
          reviewCount: reviewQueue[existingReview].reviewCount + 1,
          reason: wasConfident ? 'confident-wrong' : reviewQueue[existingReview].reason,
        };
      } else {
        reviewQueue.push({
          questionId: attempt.questionId,
          moduleId,
          subskill,
          reason: reviewReason,
          nextReviewDate: Date.now() + 1 * 24 * 60 * 60 * 1000,
          interval: 1,
          reviewCount: 0,
        });
      }
    }

    // Update module status based on subskill mastery
    const mod = modules.find(m => m.id === moduleId);
    const moduleStatus = { ...state.moduleStatus };
    if (mod) {
      const subskillMasteries = mod.subskills.map(sk => subskillMasteries[sk]);
      const anyStarted = subskillMasteries.some(sm => sm && sm.totalAttempts > 0);
      const avgMastery = subskillMasteries.length > 0
        ? Math.round(subskillMasteries.reduce((a, sm) => a + (sm?.mastery ?? 0), 0) / subskillMasteries.length)
        : 0;

      const hasReviewDue = reviewQueue.some(r => r.moduleId === moduleId && isReviewDue(r));
      
      let status: ModuleStatus = 'not-started';
      if (hasReviewDue) status = 'review-due';
      else if (avgMastery >= 80) status = 'mastered';
      else if (anyStarted && avgMastery >= 40) status = 'practising';
      else if (anyStarted) status = 'learning';
      moduleStatus[moduleId] = status;
    }

    const newState = { attempts, subskillMastery, errorNotebook, reviewQueue, moduleStatus };
    set(newState);
    persist({ ...state, ...newState });
  },

  addToErrorNotebook: (entry) => {
    const state = get();
    const errorNotebook = [...state.errorNotebook];
    const idx = errorNotebook.findIndex(e => e.questionId === entry.questionId);
    if (idx >= 0) errorNotebook[idx] = entry;
    else errorNotebook.push(entry);
    set({ errorNotebook });
    persist({ ...state, errorNotebook });
  },

  removeFromErrorNotebook: (questionId) => {
    const state = get();
    set({ errorNotebook: state.errorNotebook.filter(e => e.questionId !== questionId) });
  },

  addToReviewQueue: (item) => {
    const state = get();
    const reviewQueue = [...state.reviewQueue];
    const idx = reviewQueue.findIndex(r => r.questionId === item.questionId);
    if (idx >= 0) reviewQueue[idx] = item;
    else reviewQueue.push(item);
    set({ reviewQueue });
    persist({ ...state, reviewQueue });
  },

  getDueReviewItems: () => {
    return get().reviewQueue.filter(isReviewDue);
  },

  markReviewComplete: (questionId) => {
    const state = get();
    const reviewQueue = state.reviewQueue.map(r => {
      if (r.questionId === questionId) {
        const nextInterval = getNextInterval(r.interval);
        return {
          ...r,
          nextReviewDate: Date.now() + nextInterval * 24 * 60 * 60 * 1000,
          interval: nextInterval,
          reviewCount: r.reviewCount + 1,
        };
      }
      return r;
    });
    set({ reviewQueue });
    persist({ ...state, reviewQueue });
  },

  updateModuleStatus: (moduleId, status) => {
    const state = get();
    const moduleStatus = { ...state.moduleStatus, [moduleId]: status };
    set({ moduleStatus });
    persist({ ...state, moduleStatus });
  },

  setModuleStep: (moduleId, step) => {
    const state = get();
    const moduleCurrentStep = { ...state.moduleCurrentStep, [moduleId]: step };
    set({ moduleCurrentStep });
    persist({ ...state, moduleCurrentStep });
  },

  addMockResult: (result) => {
    const state = get();
    const mockResults = [...state.mockResults, result];
    set({ mockResults });
    persist({ ...state, mockResults });
  },

  updateSettings: (newSettings) => {
    const state = get();
    const settings = { ...state.settings, ...newSettings };
    set({ settings });
    persist({ ...state, settings });

    // Apply font size to document
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize =
        settings.fontSize === 'xlarge' ? '20px' :
        settings.fontSize === 'large' ? '18px' : '16px';
    }
  },

  resetAll: () => {
    const fresh = getDefaultState();
    set(fresh);
    persist(fresh);
  },

  exportData: () => {
    const state = get();
    return JSON.stringify(state, null, 2);
  },

  getModuleMastery: (moduleId) => {
    const state = get();
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) return 0;
    const values = mod.subskills.map(sk => state.subskillMastery[sk]?.mastery ?? 0);
    return values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  },

  getModuleStatus: (moduleId) => {
    const state = get();
    if (state.moduleStatus[moduleId]) return state.moduleStatus[moduleId];
    return 'not-started';
  },

  getExamReadiness: () => {
    const state = get();
    const weights: Record<string, number> = { P0: 4, P1: 2, P2: 1 };
    let totalWeight = 0;
    let weightedSum = 0;

    for (const mod of modules) {
      if (mod.id === 'mixed-mock') continue;
      const w = weights[mod.priority] * mod.subskills.length;
      const m = state.subskillMastery
        ? mod.subskills.reduce((sum, sk) => sum + (state.subskillMastery[sk]?.mastery ?? 0), 0) / mod.subskills.length
        : 0;
      totalWeight += w;
      weightedSum += m * w;
    }

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  },

  getNextBestActivity: () => {
    const state = get();

    // 1. If not onboarded, go to onboarding
    if (!state.onboarding.completed) {
      return { page: 'onboarding', label: 'Start Diagnostic' };
    }

    // 2. Check for due review items
    const dueItems = state.reviewQueue.filter(isReviewDue);
    if (dueItems.length > 0) {
      return { page: 'review', label: 'Review Due Items' };
    }

    // 3. Find first non-mastered P0 module
    for (const mod of modules) {
      if (mod.id === 'mixed-mock') continue;
      const status = state.moduleStatus[mod.id] || 'not-started';
      if (status !== 'mastered') {
        return { page: 'learn-module', moduleId: mod.id, label: `Continue: ${mod.shortTitle}` };
      }
    }

    // 4. All mastered — suggest mixed mock
    return { page: 'mock', label: 'Take a Full Mock' };
  },
}));

// Hydrate store on mount
if (typeof window !== 'undefined') {
  // The store auto-hydrates via getInitialState()
}

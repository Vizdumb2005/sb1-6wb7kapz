// ============================================================
// DBMS Quiz 2 Prep — Main SPA Page (all views via hash routing)
// ============================================================

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { modules } from '@/lib/modules';
import { getQuestionsByModule, getRandomQuestions, getDiagnosticQuestions } from '@/lib/questions';
import { getMockExam } from '@/lib/questions/mock';
import { Question, Attempt } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuestionEngine } from '@/components/learning/QuestionEngine';
import { FDLab } from '@/components/labs/FDLab';
import { DiskCalcLab } from '@/components/labs/DiskCalcLab';
import { LRUSimulator } from '@/components/labs/LRUSimulator';
import { BSTPlayground } from '@/components/labs/BSTPlayground';
import {
  BookOpen, FlaskConical, Clock, RotateCcw, Target, BarChart3,
  Home, List, PenTool, ClipboardCheck, FileText, Settings as SettingsIcon,
  ChevronRight, CheckCircle2, AlertTriangle, ArrowRight, BookMarked,
  Brain, Zap, Calendar, Download, Trash2, Search, Database, TreePine,
  HardDrive, ArrowUpDown, Code2, Network, GraduationCap
} from 'lucide-react';

// ============================================================
// Navigation Items
// ============================================================

const navItems = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'learn', label: 'Learn', icon: BookOpen },
  { id: 'practice', label: 'Practise', icon: PenTool },
  { id: 'review', label: 'Review', icon: RotateCcw },
  { id: 'formula-sheet', label: 'Formulas', icon: FileText },
  { id: 'mock', label: 'Mock', icon: ClipboardCheck },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

const moduleIcons: Record<string, React.ElementType> = {
  'fd-closures-keys': Database,
  'normalization': ArrowUpDown,
  'lossless-decomposition': GitBranch,
  'disk-storage': HardDrive,
  'lru-buffer': Zap,
  'bst': TreePine,
  'sql-psycopg2': Code2,
  'er-theory': Network,
  'mixed-mock': GraduationCap,
};

import { GitBranch } from 'lucide-react';

// ============================================================
// Main App Component
// ============================================================

export default function DBMSApp() {
  const [page, setPage] = useState('dashboard');
  const [moduleParam, setModuleParam] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const store = useStore();

  // Hash-based routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'dashboard';
      const parts = hash.split('/');
      if (parts[0] === 'learn-module' && parts[1]) {
        setPage('learn-module');
        setModuleParam(parts[1]);
      } else {
        setPage(parts[0] || 'dashboard');
        setModuleParam(null);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = useCallback((p: string, m?: string | null) => {
    if (m) {
      window.location.hash = `${p}/${m}`;
    } else {
      window.location.hash = p;
    }
    setSidebarOpen(false);
  }, []);

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!store.onboarding.completed && page !== 'onboarding') {
      window.location.hash = 'onboarding';
    }
  }, [store.onboarding.completed, page]);

  const currentModule = modules.find(m => m.id === moduleParam);

  return (
    <div className="min-h-screen flex bg-[#F7F9FC]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-[#D9E2EF] bg-white flex-shrink-0">
        <SidebarHeader />
        <ScrollArea className="flex-1">
          <nav className="p-3 space-y-1" aria-label="Main navigation">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  page === item.id || (item.id === 'learn' && page === 'learn-module')
                    ? 'bg-[#EAF2FF] text-[#1D5FD1]'
                    : 'text-[#516174] hover:bg-[#F0F2F5]'
                }`}
                aria-current={page === item.id ? 'page' : undefined}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t border-[#D9E2EF]">
          <div className="text-xs text-[#516174]">DBMS Quiz 2 Prep</div>
          <div className="text-xs text-[#516174]">IITM BS Data Science</div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-[#D9E2EF] flex flex-col">
            <SidebarHeader onClose={() => setSidebarOpen(false)} />
            <ScrollArea className="flex-1">
              <nav className="p-3 space-y-1">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      page === item.id ? 'bg-[#EAF2FF] text-[#1D5FD1]' : 'text-[#516174]'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />{item.label}
                  </button>
                ))}
              </nav>
            </ScrollArea>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-[#D9E2EF]">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-[#F0F2F5]" aria-label="Open menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h1 className="text-sm font-semibold text-[#15253D]">DBMS Quiz 2 Prep</h1>
        </header>

        {/* Page content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {page === 'onboarding' && <OnboardingPage navigate={navigate} />}
          {page === 'dashboard' && <DashboardPage navigate={navigate} />}
          {page === 'learn' && <LearnListPage navigate={navigate} />}
          {page === 'learn-module' && currentModule && <ModulePage mod={currentModule} navigate={navigate} />}
          {page === 'practice' && <PracticePage navigate={navigate} />}
          {page === 'review' && <ReviewPage navigate={navigate} />}
          {page === 'formula-sheet' && <FormulaSheetPage />}
          {page === 'mock' && <MockPage navigate={navigate} />}
          {page === 'progress' && <ProgressPage />}
          {page === 'settings' && <SettingsPage />}
          {!['onboarding', 'dashboard', 'learn', 'learn-module', 'practice', 'review', 'formula-sheet', 'mock', 'progress', 'settings'].includes(page) && !currentModule && (
            <div className="text-center py-12"><p className="text-[#516174]">Page not found.</p></div>
          )}
        </div>

        {/* Bottom nav (mobile) */}
        <nav className="lg:hidden flex items-center justify-around border-t border-[#D9E2EF] bg-white px-2 py-2" aria-label="Mobile navigation">
          {[
            { id: 'dashboard', icon: Home, label: 'Home' },
            { id: 'learn', icon: BookOpen, label: 'Learn' },
            { id: 'practice', icon: PenTool, label: 'Practise' },
            { id: 'review', icon: RotateCcw, label: 'Review' },
            { id: 'mock', icon: ClipboardCheck, label: 'Mock' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs ${
                page === item.id ? 'text-[#1D5FD1]' : 'text-[#516174]'
              }`}
              aria-current={page === item.id ? 'page' : undefined}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
}

// ============================================================
// Sidebar Header
// ============================================================

function SidebarHeader({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[#D9E2EF]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#1D5FD1] flex items-center justify-center">
          <Database className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-[#15253D]">DBMS Quiz 2</div>
          <div className="text-xs text-[#516174]">IITM BS Data Science</div>
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} className="p-1 rounded hover:bg-[#F0F2F5] lg:hidden" aria-label="Close menu">✕</button>
      )}
    </div>
  );
}

// ============================================================
// ONBOARDING PAGE
// ============================================================

function OnboardingPage({ navigate }: { navigate: (p: string, m?: string | null) => void }) {
  const store = useStore();
  const [step, setStep] = useState(0); // 0: intro, 1: confidence, 2: diagnostic, 3: results
  const [topicConfidence, setTopicConfidence] = useState<Record<string, number>>({});
  const [diagResults, setDiagResults] = useState<{ question: Question; attempt: Attempt; isCorrect: boolean }[] | null>(null);

  const handleDiagnosticComplete = useCallback((results: { question: Question; attempt: Attempt; isCorrect: boolean }[]) => {
    setDiagResults(results);
    const score = results.filter(r => r.isCorrect).length / results.length;

    // Determine study path
    const path: Record<string, 'start-here' | 'need-review' | 'already-strong'> = {};
    modules.forEach(mod => {
      if (mod.id === 'mixed-mock') return;
      const modResults = results.filter(r => r.question.moduleId === mod.id);
      const modScore = modResults.length > 0
        ? modResults.filter(r => r.isCorrect).length / modResults.length
        : 0.5;
      if (modScore >= 0.8) path[mod.id] = 'already-strong';
      else if (modScore >= 0.5) path[mod.id] = 'need-review';
      else path[mod.id] = 'start-here';
    });

    store.setOnboarding({
      topicConfidence,
      diagnosticScore: score,
      diagnosticResults: results.map(r => r.attempt),
      studyPath: path,
    });
    setStep(3);
  }, [store, topicConfidence]);

  const diagnosticQs = getDiagnosticQuestions().map(d => d.question);

  if (step === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-[#15253D]">Welcome to DBMS Quiz 2 Prep</h1>
          <p className="text-[#516174] text-lg max-w-lg mx-auto leading-relaxed">
            This study plan is designed from the Quiz 2 PYQ patterns. Let us start with a quick diagnostic so the site can focus your effort where it matters most.
          </p>
        </div>
        <Card className="border-[#D9E2EF]">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#15253D]">What to expect</h2>
            <ul className="space-y-2 text-[#516174] text-sm">
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#0B7A75] flex-shrink-0 mt-0.5" />9 interactive modules covering all Quiz 2 topics</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#0B7A75] flex-shrink-0 mt-0.5" />Interactive labs for FD, disk, LRU, and BST</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#0B7A75] flex-shrink-0 mt-0.5" />Personalised study path based on your diagnostic</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#0B7A75] flex-shrink-0 mt-0.5" />Spaced review and error notebook</li>
              <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-[#0B7A75] flex-shrink-0 mt-0.5" />Timed mock exams</li>
            </ul>
          </CardContent>
        </Card>
        <Button onClick={() => setStep(1)} className="bg-[#1D5FD1] hover:bg-[#1a52b3] text-white w-full py-6 text-lg">
          Start Diagnostic <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-[#15253D]">Rate your confidence</h1>
        <p className="text-[#516174]">Be honest — this helps us focus your effort. There are no wrong answers here.</p>
        <div className="space-y-4">
          {modules.filter(m => m.id !== 'mixed-mock').map(mod => (
            <Card key={mod.id} className="border-[#D9E2EF]">
              <CardContent className="p-4">
                <label className="text-sm font-medium text-[#15253D] block mb-2">{mod.shortTitle}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setTopicConfidence(prev => ({ ...prev, [mod.id]: n }))}
                      className={`w-10 h-10 rounded-lg border-2 text-sm font-medium tabular-nums transition-colors ${
                        (topicConfidence[mod.id] ?? 0) >= n
                          ? 'border-[#1D5FD1] bg-[#EAF2FF] text-[#1D5FD1]'
                          : 'border-[#D9E2EF] text-[#516174]'
                      }`}
                      aria-label={`${mod.shortTitle} confidence ${n}/5`}
                    >{n}</button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-[#516174] mt-1"><span>Weak</span><span>Strong</span></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button onClick={() => setStep(2)} className="bg-[#1D5FD1] hover:bg-[#1a52b3] text-white w-full py-5">
          Continue to Diagnostic Questions <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  }

  if (step === 2 && !diagResults) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-[#15253D]">Diagnostic Questions</h1>
        <p className="text-[#516174]">Answer these 12 questions to help us identify your strengths and areas to focus on.</p>
        <QuestionEngine
          questions={diagnosticQs}
          onComplete={handleDiagnosticComplete}
          mode="diagnostic"
          onExit={() => setStep(3)}
        />
      </div>
    );
  }

  // Step 3: Results
  const score = diagResults ? Math.round((diagResults.filter(r => r.isCorrect).length / diagResults.length) * 100) : 0;
  const startHere = modules.filter(m => store.onboarding.studyPath[m.id] === 'start-here');
  const needReview = modules.filter(m => store.onboarding.studyPath[m.id] === 'need-review');
  const alreadyStrong = modules.filter(m => store.onboarding.studyPath[m.id] === 'already-strong');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-[#15253D]">Your Study Path</h1>
        <p className="text-[#516174]">
          Diagnostic score: <span className="font-semibold tabular-nums">{score}%</span>
        </p>
        <p className="text-sm text-[#516174]">This is your starting point — not your final result. Every topic can be mastered with focused practice.</p>
      </div>

      {startHere.length > 0 && (
        <Card className="border-[#B42318]/30 bg-[#FEF2F2]/50">
          <CardContent className="p-5">
            <h3 className="font-semibold text-[#B42318] flex items-center gap-2"><Target className="w-4 h-4" /> Start here</h3>
            <p className="text-sm text-[#516174] mt-1">These topics need the most attention. Begin with the first one.</p>
            <div className="mt-3 space-y-2">
              {startHere.map(m => (
                <button key={m.id} onClick={() => { store.completeOnboarding(); navigate('learn-module', m.id); }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-white border border-[#D9E2EF] hover:border-[#1D5FD1] text-sm text-[#15253D] flex items-center justify-between">
                  <span>{m.shortTitle}</span><ArrowRight className="w-4 h-4 text-[#516174]" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {needReview.length > 0 && (
        <Card className="border-[#A85D00]/30 bg-[#FFF4DF]/50">
          <CardContent className="p-5">
            <h3 className="font-semibold text-[#A85D00] flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Need review</h3>
            <p className="text-sm text-[#516174] mt-1">You have some knowledge here — a focused review will strengthen it.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {needReview.map(m => (
                <Badge key={m.id} variant="outline" className="border-[#A85D00]/30 text-[#A85D00]">{m.shortTitle}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {alreadyStrong.length > 0 && (
        <Card className="border-[#0B7A75]/30 bg-[#E7F6F2]/50">
          <CardContent className="p-5">
            <h3 className="font-semibold text-[#0B7A75] flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Already strong</h3>
            <p className="text-sm text-[#516174] mt-1">Great foundation. Keep these sharp with spaced review.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {alreadyStrong.map(m => (
                <Badge key={m.id} variant="outline" className="border-[#0B7A75]/30 text-[#0B7A75]">{m.shortTitle}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={() => { store.completeOnboarding(); navigate('dashboard'); }}
        className="bg-[#1D5FD1] hover:bg-[#1a52b3] text-white w-full py-5">
        Go to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}

// ============================================================
// DASHBOARD PAGE
// ============================================================

function DashboardPage({ navigate }: { navigate: (p: string, m?: string | null) => void }) {
  const store = useStore();
  const nextBest = store.getNextBestActivity();
  const readiness = store.getExamReadiness();
  const dueItems = store.getDueReviewItems();

  const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    'not-started': { label: 'Not started', color: 'text-[#516174]', bgColor: 'bg-[#F0F2F5]' },
    'learning': { label: 'Learning', color: 'text-[#1D5FD1]', bgColor: 'bg-[#EAF2FF]' },
    'practising': { label: 'Practising', color: 'text-[#A85D00]', bgColor: 'bg-[#FFF4DF]' },
    'mastered': { label: 'Mastered', color: 'text-[#0B7A75]', bgColor: 'bg-[#E7F6F2]' },
    'review-due': { label: 'Review due', color: 'text-[#A85D00]', bgColor: 'bg-[#FFF4DF]' },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#15253D]">Dashboard</h1>
        <p className="text-[#516174]">Your personalized study command centre.</p>
      </div>

      {/* Continue learning + Exam readiness */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="border-[#D9E2EF]">
          <CardContent className="p-5">
            <h2 className="text-sm font-medium text-[#516174] mb-3">Continue Learning</h2>
            <Button
              onClick={() => navigate(nextBest.page, nextBest.moduleId)}
              className="w-full bg-[#1D5FD1] hover:bg-[#1a52b3] text-white py-5 text-base justify-start gap-3"
            >
              {nextBest.moduleId ? <BookMarked className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
              {nextBest.label}
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-[#D9E2EF]">
          <CardContent className="p-5">
            <h2 className="text-sm font-medium text-[#516174] mb-3">Exam Readiness</h2>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl font-bold tabular-nums text-[#15253D]">{readiness}%</span>
              <span className="text-sm text-[#516174] pb-1">mastery</span>
            </div>
            <Progress value={readiness} className="h-3" />
            <p className="text-xs text-[#516174] mt-2">Weighted by topic priority (P0 topics count more).</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Formula Sheet', icon: FileText, page: 'formula-sheet' },
          { label: 'Error Notebook', icon: AlertTriangle, page: 'review' },
          { label: 'Timed Mock', icon: Clock, page: 'mock' },
          { label: 'Progress', icon: BarChart3, page: 'progress' },
        ].map(item => (
          <button key={item.page} onClick={() => navigate(item.page)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#D9E2EF] bg-white hover:border-[#1D5FD1]/50 hover:bg-[#EAF2FF]/30 transition-colors">
            <item.icon className="w-6 h-6 text-[#1D5FD1]" />
            <span className="text-sm font-medium text-[#15253D]">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Review queue alert */}
      {dueItems.length > 0 && (
        <Card className="border-[#A85D00]/40 bg-[#FFF4DF]/40">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#A85D00]">Review Due</h3>
              <p className="text-sm text-[#516174]">{dueItems.length} item{dueItems.length > 1 ? 's' : ''} scheduled for review.</p>
            </div>
            <Button variant="outline" className="border-[#A85D00] text-[#A85D00] hover:bg-[#FFF4DF]" onClick={() => navigate('review')}>
              Review Now <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Module mastery overview */}
      <Card className="border-[#D9E2EF]">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Module Mastery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {modules.filter(m => m.id !== 'mixed-mock').map(mod => {
            const status = store.getModuleStatus(mod.id);
            const mastery = store.getModuleMastery(mod.id);
            const config = statusConfig[status] || statusConfig['not-started'];
            const Icon = moduleIcons[mod.id] || BookOpen;
            return (
              <button key={mod.id} onClick={() => navigate('learn-module', mod.id)}
                className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-[#F0F2F5] transition-colors text-left">
                <div className="w-10 h-10 rounded-lg bg-[#EAF2FF] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#1D5FD1]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-[#15253D] truncate">{mod.shortTitle}</span>
                    <Badge variant="outline" className={`${config.bgColor} ${config.color} border-transparent flex-shrink-0`}>{config.label}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <Progress value={mastery} className="h-1.5 flex-1" />
                    <span className="text-xs text-[#516174] tabular-nums w-8 text-right">{mastery}%</span>
                  </div>
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// LEARN LIST PAGE
// ============================================================

function LearnListPage({ navigate }: { navigate: (p: string, m?: string | null) => void }) {
  const store = useStore();
  const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    'not-started': { label: 'Not started', color: 'text-[#516174]', bgColor: 'bg-[#F0F2F5]' },
    'learning': { label: 'Learning', color: 'text-[#1D5FD1]', bgColor: 'bg-[#EAF2FF]' },
    'practising': { label: 'Practising', color: 'text-[#A85D00]', bgColor: 'bg-[#FFF4DF]' },
    'mastered': { label: 'Mastered', color: 'text-[#0B7A75]', bgColor: 'bg-[#E7F6F2]' },
    'review-due': { label: 'Review due', color: 'text-[#A85D00]', bgColor: 'bg-[#FFF4DF]' },
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#15253D]">Modules</h1>
        <p className="text-[#516174]">Work through each module in order for the strongest preparation.</p>
      </div>

      <div className="space-y-4">
        {modules.map((mod, idx) => {
          const status = store.getModuleStatus(mod.id);
          const mastery = store.getModuleMastery(mod.id);
          const config = statusConfig[status] || statusConfig['not-started'];
          const Icon = moduleIcons[mod.id] || BookOpen;
          const isLocked = idx > 0 && status === 'not-started' && store.getModuleStatus(modules[idx - 1].id) === 'not-started';

          return (
            <Card key={mod.id} className={`border-[#D9E2EF] ${isLocked ? 'opacity-60' : 'hover:border-[#1D5FD1]/30'} transition-colors`}>
              <button
                onClick={() => !isLocked && navigate('learn-module', mod.id)}
                className="w-full text-left p-5 space-y-3"
                disabled={isLocked}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${mod.priority === 'P0' ? 'bg-[#EAF2FF]' : mod.priority === 'P1' ? 'bg-[#E7F6F2]' : 'bg-[#F0F2F5]'}`}>
                      <Icon className={`w-5 h-5 ${mod.priority === 'P0' ? 'text-[#1D5FD1]' : mod.priority === 'P1' ? 'text-[#0B7A75]' : 'text-[#516174]'}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#15253D]">{idx + 1}. {mod.shortTitle}</span>
                        <Badge variant="outline" className={`${config.bgColor} ${config.color} border-transparent`}>{config.label}</Badge>
                        <Badge variant="outline" className="border-[#D9E2EF] text-[#516174]">{mod.priority}</Badge>
                      </div>
                      <p className="text-sm text-[#516174] mt-1 line-clamp-2">{mod.description}</p>
                    </div>
                  </div>
                  {!isLocked && <ChevronRight className="w-5 h-5 text-[#516174] flex-shrink-0 mt-1" />}
                </div>
                {status !== 'not-started' && (
                  <div className="flex items-center gap-3 ml-13">
                    <Progress value={mastery} className="h-1.5 flex-1" />
                    <span className="text-xs text-[#516174] tabular-nums">{mastery}%</span>
                  </div>
                )}
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// MODULE PAGE
// ============================================================

function ModulePage({ mod, navigate }: { mod: typeof modules[0]; navigate: (p: string, m?: string | null) => void }) {
  const [activeTab, setActiveTab] = useState('intro');
  const [practiceQuestions, setPracticeQuestions] = useState<Question[]>([]);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const store = useStore();

  const allModuleQuestions = getQuestionsByModule(mod.id);
  const workedExamples = allModuleQuestions.filter(q => q.source === 'worked-example');
  const guidedQuestions = allModuleQuestions.filter(q => q.source === 'guided');
  const independentQuestions = allModuleQuestions.filter(q => !['worked-example', 'guided', 'mastery-check'].includes(q.source));
  const masteryQuestions = independentQuestions.slice(0, 5);

  const startPractice = (questions: Question[]) => {
    setPracticeQuestions(questions);
    setPracticeStarted(true);
  };

  const labMap: Record<string, React.ReactNode> = {
    'fd-closures-keys': <FDLab />,
    'disk-storage': <DiskCalcLab />,
    'lru-buffer': <LRUSimulator />,
    'bst': <BSTPlayground />,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#516174]">
        <button onClick={() => navigate('learn')} className="hover:text-[#1D5FD1]">Modules</button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-[#15253D] font-medium">{mod.shortTitle}</span>
      </div>

      {/* Module header */}
      <div>
        <h1 className="text-2xl font-bold text-[#15253D]">{mod.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className={mod.priority === 'P0' ? 'border-[#B42318]/30 text-[#B42318]' : mod.priority === 'P1' ? 'border-[#A85D00]/30 text-[#A85D00]' : 'border-[#D9E2EF] text-[#516174]'}>
            {mod.priority} Priority
          </Badge>
          <span className="text-sm text-[#516174]">{mod.subskills.length} subskills</span>
        </div>
      </div>

      {/* Why this matters */}
      <Card className="border-[#1D5FD1]/20 bg-[#EAF2FF]/50">
        <CardContent className="p-5">
          <h2 className="font-semibold text-[#1D5FD1] flex items-center gap-2 text-sm"><Target className="w-4 h-4" /> Why this matters in Quiz 2</h2>
          <p className="text-sm text-[#15253D] mt-2 leading-relaxed">{mod.whyItMatters}</p>
        </CardContent>
      </Card>

      {/* Learning objectives */}
      <Card className="border-[#D9E2EF]">
        <CardContent className="p-5">
          <h2 className="font-semibold text-[#15253D] mb-3">Learning Objectives</h2>
          <ul className="space-y-2">
            {mod.objectives.map((obj, i) => (
              <li key={i} className="flex gap-2 text-sm text-[#516174]">
                <CheckCircle2 className="w-4 h-4 text-[#0B7A75] flex-shrink-0 mt-0.5" />{obj}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#F0F2F5] p-1 w-full flex flex-wrap h-auto gap-1">
          <TabsTrigger value="intro" className="text-xs sm:text-sm">Learn</TabsTrigger>
          <TabsTrigger value="lab" className="text-xs sm:text-sm" disabled={!labMap[mod.id]}>Lab</TabsTrigger>
          <TabsTrigger value="guided" className="text-xs sm:text-sm">Guided</TabsTrigger>
          <TabsTrigger value="practice" className="text-xs sm:text-sm">Practise</TabsTrigger>
          <TabsTrigger value="mastery" className="text-xs sm:text-sm">Mastery Check</TabsTrigger>
        </TabsList>

        <TabsContent value="intro" className="mt-4">
          <Card className="border-[#D9E2EF]">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-[#15253D]">Key Concepts</h3>
              <p className="text-sm text-[#516174] leading-relaxed">{mod.description}</p>
              <Separator />
              <h3 className="font-semibold text-[#15253D]">Subskills</h3>
              <div className="flex flex-wrap gap-2">
                {mod.subskills.map(sk => (
                  <Badge key={sk} variant="outline" className="border-[#D9E2EF] text-[#516174]">{sk}</Badge>
                ))}
              </div>
              {workedExamples.length > 0 && (
                <>
                  <Separator />
                  <h3 className="font-semibold text-[#15253D]">Worked Example</h3>
                  <QuestionEngine questions={workedExamples} showHints={true} mode="practice" onExit={() => setActiveTab('guided')} />
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab" className="mt-4">
          {labMap[mod.id] || (
            <Card className="p-8 text-center border-[#D9E2EF]">
              <p className="text-[#516174]">No interactive lab available for this module yet. Use the practise tab instead.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="guided" className="mt-4">
          {!practiceStarted ? (
            <Card className="border-[#D9E2EF]">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold text-[#15253D]">Guided Practice</h3>
                <p className="text-sm text-[#516174]">Work through these questions with hints available. Hints are progressively faded — use fewer as you gain confidence.</p>
                <div className="space-y-3">
                  {guidedQuestions.map((q, i) => (
                    <div key={q.id} className="flex items-center justify-between p-3 rounded-lg border border-[#D9E2EF]">
                      <div className="text-sm text-[#15253D]">Guided {i + 1} — {q.difficulty} • {q.subskill}</div>
                      <Badge variant="outline" className="border-[#D9E2EF] text-[#516174]">{q.format.toUpperCase()}</Badge>
                    </div>
                  ))}
                </div>
                <Button onClick={() => startPractice(guidedQuestions)} className="bg-[#1D5FD1] hover:bg-[#1a52b3] text-white w-full">
                  Start Guided Practice ({guidedQuestions.length} questions)
                </Button>
              </CardContent>
            </Card>
          ) : (
            <QuestionEngine
              questions={practiceQuestions}
              onComplete={() => { setPracticeStarted(false); setActiveTab('practice'); }}
              mode="practice"
              onExit={() => setPracticeStarted(false)}
            />
          )}
        </TabsContent>

        <TabsContent value="practice" className="mt-4">
          {!practiceStarted ? (
            <Card className="border-[#D9E2EF]">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold text-[#15253D]">Independent Practice</h3>
                <p className="text-sm text-[#516174]">No hints. Test yourself on {independentQuestions.length} questions across different formats and difficulties.</p>
                <Button onClick={() => startPractice(independentQuestions)} className="bg-[#1D5FD1] hover:bg-[#1a52b3] text-white w-full">
                  Start Practice ({independentQuestions.length} questions)
                </Button>
              </CardContent>
            </Card>
          ) : (
            <QuestionEngine
              questions={practiceQuestions}
              onComplete={() => { setPracticeStarted(false); setActiveTab('mastery'); }}
              mode="practice"
              onExit={() => setPracticeStarted(false)}
            />
          )}
        </TabsContent>

        <TabsContent value="mastery" className="mt-4">
          {!practiceStarted ? (
            <Card className="border-[#D9E2EF]">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold text-[#15253D]">Mastery Check</h3>
                <p className="text-sm text-[#516174]">5 mixed questions with no hints. Score 80%+ to mark this module as Practising.</p>
                <div className="bg-[#EAF2FF] border border-[#1D5FD1]/20 rounded-lg px-4 py-3 text-sm text-[#1D5FD1]">
                  <strong>Mastery rule:</strong> A subskill is Mastered when you achieve 80%+ accuracy over 5+ recent questions, with at least 2 correct without hints.
                </div>
                <Button onClick={() => startPractice(masteryQuestions)} className="bg-[#0B7A75] hover:bg-[#096b67] text-white w-full">
                  Begin Mastery Check ({masteryQuestions.length} questions)
                </Button>
              </CardContent>
            </Card>
          ) : (
            <QuestionEngine
              questions={practiceQuestions}
              showHints={false}
              mode="mastery-check"
              onComplete={() => setPracticeStarted(false)}
              onExit={() => setPracticeStarted(false)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================
// PRACTICE PAGE
// ============================================================

function PracticePage({ navigate }: { navigate: (p: string) => void }) {
  const [started, setStarted] = useState(false);
  const [filters, setFilters] = useState({ moduleId: '', difficulty: '', count: 10 });
  const [questions, setQuestions] = useState<Question[]>([]);

  const startPractice = () => {
    const qs = getRandomQuestions(filters.count, {
      moduleId: filters.moduleId || undefined,
      difficulty: filters.difficulty || undefined,
    });
    setQuestions(qs);
    setStarted(true);
  };

  if (started) {
    return (
      <div className="max-w-3xl mx-auto">
        <QuestionEngine
          questions={questions}
          onComplete={() => setStarted(false)}
          mode="practice"
          onExit={() => setStarted(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#15253D]">Custom Practice</h1>
        <p className="text-[#516174]">Choose topics, format, and difficulty. The question engine will select questions for you.</p>
      </div>
      <Card className="border-[#D9E2EF]">
        <CardContent className="p-5 space-y-5">
          <div>
            <label className="text-sm font-medium text-[#15253D] block mb-2">Module</label>
            <select
              value={filters.moduleId}
              onChange={e => setFilters(f => ({ ...f, moduleId: e.target.value }))}
              className="w-full p-2.5 rounded-lg border border-[#D9E2EF] bg-white text-sm"
              aria-label="Select module"
            >
              <option value="">All modules</option>
              {modules.filter(m => m.id !== 'mixed-mock').map(m => (
                <option key={m.id} value={m.id}>{m.shortTitle}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-[#15253D] block mb-2">Difficulty</label>
            <div className="flex gap-2">
              {['', 'Foundation', 'Exam', 'Challenge'].map(d => (
                <button
                  key={d}
                  onClick={() => setFilters(f => ({ ...f, difficulty: d }))}
                  className={`px-4 py-2 rounded-lg border-2 text-sm ${
                    filters.difficulty === d ? 'border-[#1D5FD1] bg-[#EAF2FF] text-[#1D5FD1]' : 'border-[#D9E2EF] text-[#516174]'
                  }`}
                >{d || 'All'}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-[#15253D] block mb-2">Number of questions: {filters.count}</label>
            <Input type="range" min={3} max={20} value={filters.count} onChange={e => setFilters(f => ({ ...f, count: Number(e.target.value) }))}
              className="w-full" aria-label="Number of questions" />
          </div>
          <Button onClick={startPractice} className="bg-[#1D5FD1] hover:bg-[#1a52b3] text-white w-full py-5">
            Start Practice <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================
// REVIEW PAGE
// ============================================================

function ReviewPage({ navigate }: { navigate: (p: string) => void }) {
  const store = useStore();
  const [tab, setTab] = useState<'queue' | 'notebook'>('queue');
  const [retrying, setRetrying] = useState<string | null>(null);

  const dueItems = store.getDueReviewItems();
  const allErrors = store.errorNotebook;

  if (retrying) {
    const q = allErrors.find(e => e.questionId === retrying);
    // For retry, we need the full question - use the question bank
    return (
      <div className="max-w-3xl mx-auto">
        <QuestionEngine
          questions={getQuestionsByModule(q?.moduleId || '').filter(qu => qu.id === retrying).length > 0
            ? getQuestionsByModule(q?.moduleId || '').filter(qu => qu.id === retrying)
            : getRandomQuestions(1, { moduleId: q?.moduleId })}
          onComplete={() => setRetrying(null)}
          mode="practice"
          onExit={() => setRetrying(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#15253D]">Review</h1>
        <p className="text-[#516174]">Spaced review queue and error notebook.</p>
      </div>

      <Tabs value={tab} onValueChange={v => setTab(v as 'queue' | 'notebook')}>
        <TabsList className="bg-[#F0F2F5]">
          <TabsTrigger value="queue">Review Queue ({dueItems.length} due)</TabsTrigger>
          <TabsTrigger value="notebook">Error Notebook ({allErrors.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-4">
          {dueItems.length === 0 ? (
            <Card className="p-8 text-center border-[#D9E2EF]">
              <CheckCircle2 className="w-10 h-10 text-[#0B7A75] mx-auto mb-3" />
              <p className="text-[#15253D] font-medium">No reviews due</p>
              <p className="text-sm text-[#516174]">Focus on learning new material or take a mock exam.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {dueItems.map(item => (
                <Card key={item.questionId} className="border-[#D9E2EF]">
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-[#15253D]">{item.subskill}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className={`text-xs ${
                          item.reason === 'confident-wrong' ? 'border-[#B42318]/30 text-[#B42318] bg-[#FEF2F2]'
                          : 'border-[#A85D00]/30 text-[#A85D00] bg-[#FFF4DF]'
                        }`}>
                          {item.reason === 'confident-wrong' ? '⚠ Confident but wrong' : item.reason}
                        </Badge>
                        <Badge variant="outline" className="border-[#D9E2EF] text-[#516174] text-xs">Review #{item.reviewCount + 1}</Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="border-[#1D5FD1] text-[#1D5FD1]" onClick={() => setRetrying(item.questionId)}>
                      Review <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notebook" className="mt-4">
          {allErrors.length === 0 ? (
            <Card className="p-8 text-center border-[#D9E2EF]">
              <CheckCircle2 className="w-10 h-10 text-[#0B7A75] mx-auto mb-3" />
              <p className="text-[#15253D] font-medium">No errors yet</p>
              <p className="text-sm text-[#516174]">Errors will appear here when you answer questions incorrectly.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {allErrors.map(entry => (
                <Card key={entry.questionId} className="border-[#D9E2EF]">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge variant="outline" className="border-[#D9E2EF] text-[#516174] mb-2">{entry.subskill}</Badge>
                        <p className="text-sm text-[#15253D] leading-relaxed">{entry.questionStem}</p>
                      </div>
                      {entry.wasConfidentButWrong && (
                        <Badge className="bg-[#FEF2F2] text-[#B42318] border border-[#B42318]/30">⚠ Priority</Badge>
                      )}
                    </div>
                    <Separator />
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div><span className="text-[#516174]">Your answer:</span> <span className="text-[#B42318]">{String(entry.userAnswer)}</span></div>
                      <div><span className="text-[#516174]">Correct answer:</span> <span className="text-[#0B7A75]">{entry.correctAnswer}</span></div>
                    </div>
                    <div className="bg-[#FFF4DF] rounded-lg px-4 py-3 text-sm">
                      <p className="font-medium text-[#A85D00]">Common misconception</p>
                      <p className="text-[#15253D] mt-1">{entry.misconception}</p>
                    </div>
                    <div className="bg-[#EAF2FF] rounded-lg px-4 py-3 text-sm">
                      <p className="font-medium text-[#1D5FD1]">Repair lesson</p>
                      <p className="text-[#15253D] mt-1">{entry.repairLesson}</p>
                    </div>
                    <Button variant="outline" className="border-[#1D5FD1] text-[#1D5FD1]" onClick={() => setRetrying(entry.questionId)}>
                      Retry <RotateCcw className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================
// FORMULA SHEET PAGE
// ============================================================

function FormulaSheetPage() {
  const [search, setSearch] = useState('');

  const formulas = [
    { category: 'FD & Keys', items: [
      { name: 'Attribute Closure', formula: 'Start with X. For each FD Y→Z, if Y⊆X⁺, add Z. Repeat until stable.', note: 'X⁺ = all attributes means X is a superkey.' },
      { name: 'Superkey Count', formula: '2^(n − k)', note: 'n = total attributes, k = candidate key size. Use inclusion-exclusion for multiple candidate keys.' },
      { name: 'Candidate Key', formula: 'Minimal superkey: no proper subset is also a superkey.', note: 'Attributes never on RHS are mandatory in every candidate key.' },
    ]},
    { category: 'Normal Forms', items: [
      { name: 'BCNF', formula: 'For every non-trivial X→A, X must be a superkey.', note: 'Strongest of 3NF/BCNF.' },
      { name: '3NF', formula: 'For every non-trivial X→A, either X is a superkey OR A is prime.', note: 'Allows non-superkey determinant if RHS is prime.' },
      { name: '2NF', formula: '1NF + no partial dependency on part of a composite candidate key.', note: 'Only relevant if a composite candidate key exists.' },
    ]},
    { category: 'Lossless Join', items: [
      { name: 'Binary Test', formula: '(R1 ∩ R2) → R1  OR  (R1 ∩ R2) → R2  under F⁺', note: 'Common attributes must determine all of at least one side.' },
      { name: 'Dependency Preservation', formula: 'Every original FD can be inferred from the union of projected FDs.', note: 'Independent of losslessness.' },
    ]},
    { category: 'Minimal Cover', items: [
      { name: 'Step 1', formula: 'Split RHS: X→YZ becomes X→Y, X→Z', note: '' },
      { name: 'Step 2', formula: 'Remove extraneous LHS attributes', note: 'Temporarily remove one; test if FD still follows.' },
      { name: 'Step 3', formula: 'Remove redundant FDs', note: 'Remove FD; if it follows from rest, discard it.' },
    ]},
    { category: 'Disk Storage', items: [
      { name: 'Capacity', formula: 'platters × surfaces × tracks × sectors × bytes/sector', note: 'Convert to GB: divide by 2³⁰.' },
      { name: 'Addressing Bits', formula: '⌈log₂(addressable sectors)⌉', note: 'addressable sectors = platters × surfaces × tracks × sectors/track.' },
      { name: 'Rotation Period', formula: '60,000 / RPM  (ms/revolution)', note: '' },
      { name: 'Avg Rotational Latency', formula: '(60,000 / RPM) / 2', note: 'Half of one full revolution.' },
      { name: 'Transfer Time', formula: 'block size / data rate', note: 'Convert units: 4 KB / 512 KB/s = 1/128 s = 7.8125 ms.' },
      { name: 'Total Access Time', formula: 'seek time + avg rotational latency + transfer time', note: '' },
    ]},
    { category: 'LRU', items: [
      { name: 'On Hit', formula: 'Move referenced block to MRU position', note: '' },
      { name: 'On Miss (full)', formula: 'Evict LRU block, add requested as MRU', note: 'Always build the full table — never do it mentally for long sequences.' },
    ]},
    { category: 'BST', items: [
      { name: 'Invariant', formula: 'Left subtree < node < Right subtree', note: '' },
      { name: 'Min Edge Height', formula: '⌈log₂(n + 1)⌉ − 1', note: 'For n nodes.' },
      { name: 'Max Edge Height', formula: 'n − 1', note: 'Skewed (degenerate) tree.' },
      { name: 'Max Nodes in Levels 0..h', formula: '2^(h+1) − 1', note: 'h is level of deepest node.' },
      { name: 'Search Path', formula: 'Track interval (lower, upper) at each probe', note: 'Current > target → go left, update upper bound.' },
    ]},
  ];

  const filtered = search
    ? formulas.map(cat => ({ ...cat, items: cat.items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.formula.toLowerCase().includes(search.toLowerCase())) })).filter(cat => cat.items.length > 0)
    : formulas;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#15253D]">Formula Sheet</h1>
          <p className="text-[#516174]">Quick reference for all formulas and methods.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#516174]" />
          <Input placeholder="Search formulas..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-full sm:w-64" />
        </div>
      </div>

      <div className="space-y-6">
        {filtered.map(cat => (
          <Card key={cat.category} className="border-[#D9E2EF]">
            <CardHeader className="pb-2"><CardTitle className="text-lg">{cat.category}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {cat.items.map(item => (
                <div key={item.name} className="bg-[#F7F9FC] rounded-lg p-4">
                  <div className="font-medium text-sm text-[#15253D]">{item.name}</div>
                  <div className="font-mono text-sm text-[#1D5FD1] mt-1 bg-[#EAF2FF] rounded px-3 py-2 tabular-nums">{item.formula}</div>
                  {item.note && <p className="text-xs text-[#516174] mt-2">{item.note}</p>}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MOCK PAGE
// ============================================================

function MockPage({ navigate }: { navigate: (p: string) => void }) {
  const store = useStore();
  const [activeMock, setActiveMock] = useState<string | null>(null);
  const [mockResults, setMockResults] = useState<{ question: Question; attempt: Attempt; isCorrect: boolean }[] | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [mockStarted, setMockStarted] = useState(false);

  const mockConfigs = [
    { id: 'diagnostic-mini', title: '10-Minute Diagnostic', time: 10, desc: 'Quick check across all topics', color: 'border-[#1D5FD1] text-[#1D5FD1]' },
    { id: 'mixed-practice', title: '20-Minute Mixed Practice', time: 20, desc: 'Mixed practice at exam difficulty', color: 'border-[#A85D00] text-[#A85D00]' },
    { id: 'full-mock', title: '50-Mark Quiz 2 Style', time: 50, desc: 'Full-length mock matching PYQ pattern', color: 'border-[#0B7A75] text-[#0B7A75]' },
  ];

  const startMock = (configId: string, minutes: number) => {
    setActiveMock(configId);
    setTimeLeft(minutes * 60);
    setMockStarted(true);
    setMockResults(null);
  };

  useEffect(() => {
    if (mockStarted && timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t! - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && mockResults === null && mockStarted) {
      // Time's up - would auto-submit in a real scenario
    }
  }, [mockStarted, timeLeft, mockResults]);

  if (activeMock && mockStarted && !mockResults) {
    const config = getMockExam(activeMock);
    if (!config) return <p>Loading...</p>;
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[#15253D]">{config.title}</h1>
          <div className={`px-3 py-1 rounded-lg text-sm font-mono tabular-nums ${timeLeft !== null && timeLeft < 60 ? 'bg-[#FEF2F2] text-[#B42318]' : 'bg-[#EAF2FF] text-[#1D5FD1]'}`}>
            {timeLeft !== null ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}` : ''}
          </div>
        </div>
        <QuestionEngine
          questions={config.questions}
          mode="mock"
          showHints={false}
          onComplete={(results) => {
            setMockResults(results);
            // Record mock result
            const topicScores: Record<string, { correct: number; total: number }> = {};
            results.forEach(r => {
              const m = r.question.moduleId;
              if (!topicScores[m]) topicScores[m] = { correct: 0, total: 0 };
              topicScores[m].total++;
              if (r.isCorrect) topicScores[m].correct++;
            });
            store.addMockResult({
              id: Date.now().toString(),
              type: activeMock === 'full-mock' ? 'full-mock' : activeMock === 'mixed-practice' ? 'mini-mock' : 'diagnostic',
              timestamp: Date.now(),
              totalQuestions: results.length,
              correctCount: results.filter(r => r.isCorrect).length,
              scoreByTopic: topicScores,
              scoreByFormat: {},
              attempts: results.map(r => r.attempt),
            });
          }}
          onExit={() => { setMockStarted(false); setActiveMock(null); }}
        />
      </div>
    );
  }

  if (mockResults) {
    const correct = mockResults.filter(r => r.isCorrect).length;
    const total = mockResults.length;
    const pct = Math.round((correct / total) * 100);
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-[#15253D]">Mock Complete</h1>
          <div className="text-5xl font-bold tabular-nums text-[#15253D]">{pct}%</div>
          <p className="text-[#516174]">{correct} of {total} correct</p>
        </div>
        <Card className="border-[#D9E2EF]">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-[#15253D]">Score by Topic</h3>
            {Object.entries(mockResults.reduce((acc, r) => {
              const m = modules.find(mod => mod.id === r.question.moduleId)?.shortTitle || r.question.moduleId;
              if (!acc[m]) acc[m] = { correct: 0, total: 0 };
              acc[m].total++;
              if (r.isCorrect) acc[m].correct++;
              return acc;
            }, {} as Record<string, { correct: number; total: number }>)).map(([topic, scores]) => (
              <div key={topic} className="flex items-center justify-between text-sm">
                <span className="text-[#15253D]">{topic}</span>
                <span className="tabular-nums text-[#516174]">{scores.correct}/{scores.total}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Button onClick={() => { setMockResults(null); setMockStarted(false); setActiveMock(null); }} className="flex-1 bg-[#1D5FD1] hover:bg-[#1a52b3] text-white">Back to Mock Hub</Button>
          <Button onClick={() => navigate('review')} variant="outline" className="flex-1 border-[#1D5FD1] text-[#1D5FD1]">Review Errors</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#15253D]">Mock Exams</h1>
        <p className="text-[#516174]">Timed practice that matches the Quiz 2 format and pattern.</p>
      </div>
      <div className="space-y-4">
        {mockConfigs.map(m => (
          <Card key={m.id} className="border-[#D9E2EF]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-[#15253D]">{m.title}</h2>
                  <p className="text-sm text-[#516174] mt-1">{m.desc}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-[#516174]" />
                    <span className="text-sm text-[#516174] tabular-nums">{m.time} minutes</span>
                  </div>
                </div>
                <Button onClick={() => startMock(m.id, m.time)} className={`border-2 bg-white hover:bg-[#F7F9FC] ${m.color}`}>
                  Start <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PROGRESS PAGE
// ============================================================

function ProgressPage() {
  const store = useStore();
  const readiness = store.getExamReadiness();
  const totalAttempts = Object.values(store.attempts).flat().length;
  const totalCorrect = Object.values(store.attempts).flat().filter(a => a.isCorrect).length;
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
  const errorCount = store.errorNotebook.length;
  const confidentWrong = store.errorNotebook.filter(e => e.wasConfidentButWrong).length;
  const mockCount = store.mockResults.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#15253D]">Progress</h1>
        <p className="text-[#516174]">Your learning analytics and mastery breakdown.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Exam Readiness', value: `${readiness}%`, color: 'text-[#1D5FD1]' },
          { label: 'Total Attempts', value: totalAttempts, color: 'text-[#15253D]' },
          { label: 'Overall Accuracy', value: `${accuracy}%`, color: accuracy >= 70 ? 'text-[#0B7A75]' : 'text-[#A85D00]' },
          { label: 'Error Notebook', value: errorCount, color: errorCount > 0 ? 'text-[#B42318]' : 'text-[#0B7A75]' },
        ].map(stat => (
          <Card key={stat.label} className="border-[#D9E2EF]">
            <CardContent className="p-5 text-center">
              <div className={`text-3xl font-bold tabular-nums ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-[#516174] mt-1">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {confidentWrong > 0 && (
        <Card className="border-[#B42318]/30 bg-[#FEF2F2]/50">
          <CardContent className="p-5">
            <h3 className="font-semibold text-[#B42318] flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Priority Review Items</h3>
            <p className="text-sm text-[#15253D] mt-1">{confidentWrong} question{confidentWrong > 1 ? 's' : ''} where you were confident but wrong. Review these first.</p>
          </CardContent>
        </Card>
      )}

      <Card className="border-[#D9E2EF]">
        <CardHeader><CardTitle>Subskill Mastery</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {Object.values(store.subskillMastery).length === 0 ? (
            <p className="text-sm text-[#516174]">Start answering questions to see your mastery breakdown.</p>
          ) : (
            Object.values(store.subskillMastery).map(sm => (
              <div key={sm.subskill} className="flex items-center gap-4">
                <div className="w-48 flex-shrink-0">
                  <span className="text-sm text-[#15253D]">{sm.subskill}</span>
                </div>
                <div className="flex-1 flex items-center gap-3">
                  <Progress value={sm.mastery} className="h-2 flex-1" />
                  <span className="text-sm tabular-nums text-[#516174] w-12 text-right">{sm.mastery}%</span>
                  <Badge variant="outline" className={`text-xs ${
                    sm.status === 'mastered' ? 'bg-[#E7F6F2] text-[#0B7A75] border-transparent'
                      : sm.status === 'practising' ? 'bg-[#FFF4DF] text-[#A85D00] border-transparent'
                      : 'bg-[#EAF2FF] text-[#1D5FD1] border-transparent'
                  }`}>{sm.status}</Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {mockCount > 0 && (
        <Card className="border-[#D9E2EF]">
          <CardHeader><CardTitle>Mock Exam History</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {store.mockResults.slice(-5).reverse().map(mr => {
              const pct = Math.round((mr.correctCount / mr.totalQuestions) * 100);
              return (
                <div key={mr.id} className="flex items-center justify-between p-3 rounded-lg bg-[#F7F9FC]">
                  <span className="text-sm text-[#15253D]">{mr.type} — {new Date(mr.timestamp).toLocaleDateString()}</span>
                  <span className={`text-sm font-medium tabular-nums ${pct >= 70 ? 'text-[#0B7A75]' : 'text-[#A85D00]'}`}>{pct}%</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================
// SETTINGS PAGE
// ============================================================

function SettingsPage() {
  const store = useStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExport = () => {
    const data = store.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dbms-quiz2-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    store.resetAll();
    setShowResetConfirm(false);
    window.location.hash = 'onboarding';
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#15253D]">Settings</h1>
        <p className="text-[#516174]">Accessibility options and data management.</p>
      </div>

      <Card className="border-[#D9E2EF]">
        <CardContent className="p-5 space-y-5">
          <h2 className="font-semibold text-[#15253D]">Accessibility</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#15253D]">Reduce Motion</p>
              <p className="text-xs text-[#516174]">Minimize animations and transitions.</p>
            </div>
            <button
              onClick={() => store.updateSettings({ reducedMotion: !store.settings.reducedMotion })}
              className={`w-12 h-6 rounded-full transition-colors ${store.settings.reducedMotion ? 'bg-[#1D5FD1]' : 'bg-[#D9E2EF]'}`}
              role="switch" aria-checked={store.settings.reducedMotion}
            >
              <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${store.settings.reducedMotion ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <Separator />\n
          <div>
            <p className="text-sm font-medium text-[#15253D] mb-2">Font Size</p>
            <div className="flex gap-2">
              {(['normal', 'large', 'xlarge'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => store.updateSettings({ fontSize: size })}
                  className={`px-4 py-2 rounded-lg border-2 text-sm ${store.settings.fontSize === size ? 'border-[#1D5FD1] bg-[#EAF2FF] text-[#1D5FD1]' : 'border-[#D9E2EF] text-[#516174]'}`}
                >{size === 'normal' ? 'Default (16px)' : size === 'large' ? 'Large (18px)' : 'Extra Large (20px)'}</button>
              ))}
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#15253D]">High Contrast</p>
              <p className="text-xs text-[#516174]">Increase contrast for better visibility.</p>
            </div>
            <button
              onClick={() => store.updateSettings({ highContrast: !store.settings.highContrast })}
              className={`w-12 h-6 rounded-full transition-colors ${store.settings.highContrast ? 'bg-[#1D5FD1]' : 'bg-[#D9E2EF]'}`}
              role="switch" aria-checked={store.settings.highContrast}
            >
              <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${store.settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#D9E2EF]">
        <CardContent className="p-5 space-y-4">
          <h2 className="font-semibold text-[#15253D]">Data Management</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleExport} variant="outline" className="flex-1 border-[#1D5FD1] text-[#1D5FD1]">
              <Download className="w-4 h-4 mr-2" /> Export Progress
            </Button>
            <Button onClick={() => setShowResetConfirm(true)} variant="outline" className="flex-1 border-[#B42318] text-[#B42318] hover:bg-[#FEF2F2]">
              <Trash2 className="w-4 h-4 mr-2" /> Reset All Progress
            </Button>
          </div>
          {showResetConfirm && (
            <div className="bg-[#FEF2F2] border border-[#B42318]/30 rounded-lg p-4 space-y-3">
              <p className="text-sm text-[#B42318] font-medium">Are you sure? This will delete all your progress, error notebook entries, and review data. This cannot be undone.</p>
              <div className="flex gap-2">
                <Button onClick={handleReset} className="bg-[#B42318] hover:bg-[#9a1e14] text-white">Yes, Reset Everything</Button>
                <Button onClick={() => setShowResetConfirm(false)} variant="outline">Cancel</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-[#D9E2EF]">
        <CardContent className="p-5">
          <h2 className="font-semibold text-[#15253D] mb-2">Mastery Rule</h2>
          <p className="text-sm text-[#516174] leading-relaxed">
            A subskill becomes <strong>Mastered</strong> when you achieve at least <strong>80%</strong> accuracy over the last <strong>5+</strong> questions,
            with at least <strong>2</strong> of those correct answers achieved without using hints.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
// ============================================================
// Question Engine — Reusable component for MCQ, MSQ, Numeric SA
// ============================================================

'use client';

import React, { useState, useCallback } from 'react';
import { Question, MCQQuestion, MSQQuestion, NumericSAQuestion, Attempt, ConfidenceLevel } from '@/lib/types';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2, XCircle, Lightbulb, ChevronRight,
  AlertTriangle, Eye, ThumbsUp, ThumbsDown, Minus
} from 'lucide-react';

interface QuestionEngineProps {
  questions: Question[];
  onComplete?: (results: { question: Question; attempt: Attempt; isCorrect: boolean }[]) => void;
  showProgress?: boolean;
  showHints?: boolean;
  mode?: 'practice' | 'mastery-check' | 'mock' | 'diagnostic';
  onExit?: () => void;
}

export function QuestionEngine({
  questions,
  onComplete,
  showProgress = true,
  showHints = true,
  mode = 'practice',
  onExit,
}: QuestionEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showMisconception, setShowMisconception] = useState(false);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  const [results, setResults] = useState<{ question: Question; attempt: Attempt; isCorrect: boolean }[]>([]);
  const [startTime] = useState(Date.now());

  const question = questions[currentIndex];
  const store = useStore();

  const resetQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setHintsRevealed(0);
    setShowExplanation(false);
    setShowMisconception(false);
    setConfidence(null);
  }, []);

  const handleNext = useCallback(() => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= questions.length) {
      onComplete?.(results);
    } else {
      setCurrentIndex(nextIdx);
      resetQuestion();
    }
  }, [currentIndex, questions.length, results, onComplete, resetQuestion]);

  const checkAnswer = useCallback(() => {
    if (selectedAnswer === null || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)) return;

    let isCorrect = false;

    if (question.format === 'mcq') {
      const mcq = question as MCQQuestion;
      const opt = mcq.options.find(o => o.id === selectedAnswer);
      isCorrect = opt?.isCorrect ?? false;
    } else if (question.format === 'msq') {
      const msq = question as MSQQuestion;
      const selected = [...(selectedAnswer as string[])].sort();
      const correctIds = msq.options.filter(o => o.isCorrect).map(o => o.id).sort();
      isCorrect = selected.join(',') === correctIds.join(',');
    } else if (question.format === 'numeric-sa') {
      const num = question as NumericSAQuestion;
      const userVal = Number(selectedAnswer);
      const tol = num.tolerance ?? 0.01;
      isCorrect = Math.abs(userVal - num.correctAnswer) <= tol;
    }

    const attempt: Attempt = {
      questionId: question.id,
      timestamp: Date.now(),
      isCorrect,
      selectedAnswer,
      hintsUsed: hintsRevealed,
      confidence: confidence ?? undefined,
      timeSpentMs: Date.now() - startTime,
    };

    setResults(prev => [...prev, { question, attempt, isCorrect }]);
    setIsSubmitted(true);

    // Record to store for mastery tracking and error notebook
    const correctAnswerStr = question.format === 'numeric-sa'
      ? `${(question as NumericSAQuestion).correctAnswer}${(question as NumericSAQuestion).unit || ''}`
      : question.format === 'mcq'
        ? (question as MCQQuestion).options.find(o => o.isCorrect)?.text || ''
        : (question as MSQQuestion).options.filter(o => o.isCorrect).map(o => o.text).join(', ');

    try {
      store.recordAttemptWithMeta(
        attempt,
        question.subskill,
        question.moduleId,
        question.stem.substring(0, 100),
        correctAnswerStr,
        question.commonMisconception || '',
        question.fullExplanation.substring(0, 150) + '...',
        question.fullExplanation,
      );
    } catch (e) {
      // Store method may not be available in all contexts
    }
  }, [selectedAnswer, question, hintsRevealed, confidence, startTime, store]);

  if (!question) {
    return (
      <Card className="p-8 text-center">
        <p className="text-[#516174]">No questions available.</p>
      </Card>
    );
  }

  const difficultyColor = {
    Foundation: 'bg-[#EAF2FF] text-[#1D5FD1]',
    Exam: 'bg-[#FFF4DF] text-[#A85D00]',
    Challenge: 'bg-[#FEF2F2] text-[#B42318]',
  }[question.difficulty];

  const formatLabel = {
    'mcq': 'MCQ',
    'msq': 'MSQ',
    'numeric-sa': 'Numeric SA',
  }[question.format];

  const correctCount = results.filter(r => r.isCorrect).length;
  const progressPct = questions.length > 0 ? ((currentIndex + (isSubmitted ? 1 : 0)) / questions.length) * 100 : 0;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {showProgress && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#516174]">
              Question {currentIndex + 1} of {questions.length}
            </span>
            {results.length > 0 && (
              <span className="text-[#516174] tabular-nums">
                {correctCount}/{results.length} correct
              </span>
            )}
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>
      )}

      <Card className="border-[#D9E2EF]">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={difficultyColor}>{question.difficulty}</Badge>
            <Badge variant="outline" className="border-[#D9E2EF] text-[#516174]">{formatLabel}</Badge>
          </div>

          <div className="text-base sm:text-lg leading-relaxed text-[#15253D] whitespace-pre-wrap">
            {question.stem}
          </div>

          {!isSubmitted ? (
            <div className="space-y-3">
              {question.format === 'mcq' && (
                <MCQOptions question={question as MCQQuestion} selected={selectedAnswer as string} onSelect={setSelectedAnswer} />
              )}
              {question.format === 'msq' && (
                <MSQOptions question={question as MSQQuestion} selected={selectedAnswer as string[]} onSelect={setSelectedAnswer} />
              )}
              {question.format === 'numeric-sa' && (
                <NumericInput question={question as NumericSAQuestion} value={selectedAnswer as number | null} onChange={setSelectedAnswer} />
              )}
            </div>
          ) : (
            <AnswerFeedback
              question={question}
              selectedAnswer={selectedAnswer}
              showExplanation={showExplanation}
              setShowExplanation={setShowExplanation}
              showMisconception={showMisconception}
              setShowMisconception={setShowMisconception}
            />
          )}

          {question.askConfidence && !isSubmitted && showHints && (
            <ConfidenceSelector confidence={confidence} onChange={setConfidence} />
          )}

          {showHints && !isSubmitted && (
            <HintSection hints={question.hints} revealed={hintsRevealed} onReveal={() => setHintsRevealed(h => h + 1)} />
          )}

          <div className="flex items-center gap-3 pt-2">
            {!isSubmitted ? (
              <Button
                onClick={checkAnswer}
                disabled={selectedAnswer === null || (Array.isArray(selectedAnswer) && selectedAnswer.length === 0)}
                className="bg-[#1D5FD1] hover:bg-[#1a52b3] text-white"
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-[#1D5FD1] hover:bg-[#1a52b3] text-white">
                {currentIndex + 1 < questions.length ? 'Next Question' : 'Finish'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
            {onExit && (
              <Button variant="ghost" onClick={onExit} className="text-[#516174]">
                {mode === 'mock' ? 'End Exam' : 'Exit'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MCQOptions({ question, selected, onSelect }: { question: MCQQuestion; selected: string; onSelect: (v: string | null) => void }) {
  return (
    <div className="space-y-2" role="radiogroup" aria-label="Answer options">
      {question.options.map((opt, i) => {
        const letter = String.fromCharCode(65 + i);
        const isSelected = selected === opt.id;
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(isSelected ? null : opt.id)}
            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors flex items-start gap-3 ${isSelected ? 'border-[#1D5FD1] bg-[#EAF2FF]' : 'border-[#D9E2EF] bg-white hover:border-[#1D5FD1]/50 hover:bg-[#EAF2FF]/50'}`}
          >
            <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5 ${isSelected ? 'border-[#1D5FD1] bg-[#1D5FD1] text-white' : 'border-[#D9E2EF] text-[#516174]'}`}>
              {letter}
            </span>
            <span className="text-[#15253D] leading-relaxed">{opt.text}</span>
          </button>
        );
      })}
    </div>
  );
}

function MSQOptions({ question, selected, onSelect }: { question: MSQQuestion; selected: string[]; onSelect: (v: string[]) => void }) {
  const toggle = (id: string) => {
    onSelect(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };
  return (
    <div className="space-y-2" role="group" aria-label="Select all correct options">
      <p className="text-sm text-[#516174]">Select all that apply:</p>
      {question.options.map((opt, i) => {
        const letter = String.fromCharCode(65 + i);
        const isSelected = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            role="checkbox"
            aria-checked={isSelected}
            onClick={() => toggle(opt.id)}
            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors flex items-start gap-3 ${isSelected ? 'border-[#1D5FD1] bg-[#EAF2FF]' : 'border-[#D9E2EF] bg-white hover:border-[#1D5FD1]/50 hover:bg-[#EAF2FF]/50'}`}
          >
            <span className={`w-7 h-7 rounded border-2 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5 ${isSelected ? 'border-[#1D5FD1] bg-[#1D5FD1] text-white' : 'border-[#D9E2EF] text-[#516174]'}`}>
              {isSelected ? '✓' : ''}
            </span>
            <span className="text-[#15253D] leading-relaxed">{opt.text}</span>
          </button>
        );
      })}
    </div>
  );
}

function NumericInput({ question, value, onChange }: { question: NumericSAQuestion; value: number | null; onChange: (v: number | null) => void }) {
  return (
    <div className="space-y-2">
      <label htmlFor="numeric-answer" className="text-sm text-[#516174]">
        Enter your answer{question.unit ? ` (in ${question.unit})` : ''}:
        {question.expectedFormat && ` — ${question.expectedFormat}`}
      </label>
      <Input
        id="numeric-answer"
        type="number"
        step="any"
        value={value ?? ''}
        onChange={e => onChange(e.target.value ? Number(e.target.value) : null)}
        placeholder="Type your answer..."
        className="max-w-xs tabular-nums text-lg"
      />
    </div>
  );
}

function ConfidenceSelector({ confidence, onChange }: { confidence: ConfidenceLevel | null; onChange: (v: ConfidenceLevel) => void }) {
  return (
    <div className="space-y-2 pt-2 border-t border-[#D9E2EF]">
      <p className="text-sm text-[#516174]">How confident are you before submitting?</p>
      <div className="flex gap-2" role="radiogroup" aria-label="Confidence rating">
        {([
          { value: 'low' as ConfidenceLevel, label: 'Not sure', icon: ThumbsDown, color: 'border-[#A85D00] text-[#A85D00] bg-[#FFF4DF]' },
          { value: 'medium' as ConfidenceLevel, label: 'Somewhat', icon: Minus, color: 'border-[#516174] text-[#516174] bg-[#F0F2F5]' },
          { value: 'high' as ConfidenceLevel, label: 'Confident', icon: ThumbsUp, color: 'border-[#0B7A75] text-[#0B7A75] bg-[#E7F6F2]' },
        ]).map(c => (
          <button
            key={c.value}
            role="radio"
            aria-checked={confidence === c.value}
            onClick={() => onChange(c.value)}
            className={`px-3 py-2 rounded-lg border-2 text-sm font-medium flex items-center gap-1.5 transition-colors ${confidence === c.value ? c.color : 'border-[#D9E2EF] text-[#516174] hover:border-[#516174]'}`}
          >
            <c.icon className="w-4 h-4" />{c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function HintSection({ hints, revealed, onReveal }: { hints: { level: 1 | 2 | 3; text: string }[]; revealed: number; onReveal: () => void }) {
  return (
    <div className="space-y-2 pt-2 border-t border-[#D9E2EF]">
      <div className="flex items-center justify-between">
        <button
          onClick={onReveal}
          disabled={revealed >= hints.length}
          className="text-sm text-[#1D5FD1] hover:text-[#1a52b3] font-medium flex items-center gap-1 disabled:text-[#D9E2EF]"
        >
          <Lightbulb className="w-4 h-4" />
          {revealed < hints.length ? `Reveal Hint ${revealed + 1}` : 'All hints revealed'}
        </button>
        {revealed > 0 && <span className="text-xs text-[#A85D00]">{revealed} hint{revealed > 1 ? 's' : ''} used</span>}
      </div>
      <div className="space-y-2">
        {hints.slice(0, revealed).map((h, i) => (
          <div key={i} className="bg-[#FFF4DF] border border-[#A85D00]/20 rounded-lg px-4 py-3 text-sm text-[#15253D]">
            <span className="font-medium text-[#A85D00]">Hint {h.level}:</span> {h.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function AnswerFeedback({ question, selectedAnswer, showExplanation, setShowExplanation, showMisconception, setShowMisconception }: {
  question: Question; selectedAnswer: string | string[] | number | null;
  showExplanation: boolean; setShowExplanation: (v: boolean) => void;
  showMisconception: boolean; setShowMisconception: (v: boolean) => void;
}) {
  let isCorrect = false;
  if (question.format === 'mcq') {
    isCorrect = (question as MCQQuestion).options.find(o => o.id === selectedAnswer)?.isCorrect ?? false;
  } else if (question.format === 'msq') {
    const sel = [...(selectedAnswer as string[])].sort();
    const cor = (question as MSQQuestion).options.filter(o => o.isCorrect).map(o => o.id).sort();
    isCorrect = sel.join(',') === cor.join(',');
  } else if (question.format === 'numeric-sa') {
    const num = question as NumericSAQuestion;
    isCorrect = Math.abs(Number(selectedAnswer) - num.correctAnswer) <= (num.tolerance ?? 0.01);
  }

  return (
    <div className="space-y-3">
      <div role="status" aria-live="polite" className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium ${isCorrect ? 'bg-[#E7F6F2] text-[#0B7A75]' : 'bg-[#FEF2F2] text-[#B42318]'}`}>
        {isCorrect ? <><CheckCircle2 className="w-5 h-5" /> Correct!</> : <><XCircle className="w-5 h-5" /> Incorrect</>}
      </div>

      {(question.format === 'mcq' || question.format === 'msq') && (
        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            const wasSelected = question.format === 'mcq'
              ? selectedAnswer === opt.id
              : (selectedAnswer as string[]).includes(opt.id);
            return (
              <div key={opt.id} className={`px-4 py-3 rounded-lg border-2 text-sm ${opt.isCorrect ? 'border-[#0B7A75] bg-[#E7F6F2]' : wasSelected ? 'border-[#B42318] bg-[#FEF2F2]' : 'border-[#D9E2EF] bg-white'}`}>
                <div className="flex items-start gap-2">
                  <span className="font-medium">{opt.isCorrect ? '✓' : wasSelected ? '✗' : '○'} {letter}.</span>
                  <div>
                    <span className="text-[#15253D]">{opt.text}</span>
                    <p className={`mt-1 ${opt.isCorrect ? 'text-[#0B7A75]' : wasSelected ? 'text-[#B42318]' : 'text-[#516174]'}`}>
                      {opt.isCorrect ? 'Correct' : wasSelected ? 'Incorrect' : 'Not selected'} — {opt.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {question.format === 'numeric-sa' && (
        <div className="bg-[#EAF2FF] border border-[#1D5FD1]/20 rounded-lg px-4 py-3 text-sm">
          <p className="font-medium text-[#1D5FD1]">Correct answer: {(question as NumericSAQuestion).correctAnswer}{(question as NumericSAQuestion).unit ? ` ${(question as NumericSAQuestion).unit}` : ''}</p>
          <p className="text-[#516174]">Your answer: {selectedAnswer}</p>
        </div>
      )}

      <button onClick={() => setShowExplanation(!showExplanation)} className="text-sm text-[#1D5FD1] hover:text-[#1a52b3] font-medium flex items-center gap-1" aria-expanded={showExplanation}>
        <Eye className="w-4 h-4" />{showExplanation ? 'Hide' : 'Show'} full explanation
      </button>
      {showExplanation && (
        <div className="bg-[#EAF2FF] border border-[#1D5FD1]/20 rounded-lg px-4 py-3 text-sm text-[#15253D] whitespace-pre-wrap leading-relaxed">
          {question.fullExplanation}
        </div>
      )}

      {!isCorrect && question.commonMisconception && (
        <button onClick={() => setShowMisconception(!showMisconception)} className="text-sm text-[#A85D00] hover:text-[#8a4d00] font-medium flex items-center gap-1" aria-expanded={showMisconception}>
          <AlertTriangle className="w-4 h-4" />{showMisconception ? 'Hide' : 'Show'} common misconception
        </button>
      )}
      {showMisconception && !isCorrect && (
        <div className="bg-[#FFF4DF] border border-[#A85D00]/20 rounded-lg px-4 py-3 text-sm text-[#15253D] leading-relaxed">
          {question.commonMisconception}
        </div>
      )}
    </div>
  );
}
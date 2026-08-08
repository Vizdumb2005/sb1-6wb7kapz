'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Layers, Play, RotateCcw, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

// --- Types ---

interface LRUStep {
  stepNum: number;
  request: number;
  bufferBefore: number[];    // LRU → MRU order
  isHit: boolean;
  evicted: number | null;
  bufferAfter: number[];     // LRU → MRU order
  userPrediction: 'hit' | 'miss' | null;
  predictionCorrect: boolean | null;
}

interface PendingStep {
  request: number;
  bufferBefore: number[];
  isHit: boolean;
  evicted: number | null;
  bufferAfter: number[];
}

// --- Pre-loaded Examples ---

const EXAMPLES = [
  {
    label: 'P7-style (3 frames)',
    frames: 3,
    sequence: '2, 1, 4, 2, 5, 1, 2, 4, 5, 1',
  },
  {
    label: '4 frames, longer',
    frames: 4,
    sequence: '1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5',
  },
];

// --- Helpers ---

function performLRUStep(
  buffer: number[],
  request: number
): PendingStep {
  const idx = buffer.indexOf(request);
  const bufferBefore = [...buffer];

  if (idx !== -1) {
    // Hit: move to MRU position (end)
    const newBuf = buffer.filter((_, i) => i !== idx);
    newBuf.push(request);
    return { request, bufferBefore, isHit: true, evicted: null, bufferAfter: newBuf };
  }

  // Miss
  let evicted: number | null = null;
  let newBuf = [...buffer];
  if (newBuf.length > 0) {
    // Buffer is full (we only add when frames are allocated)
    evicted = newBuf[0]; // Evict LRU
    newBuf = newBuf.slice(1);
  }
  newBuf.push(request);
  return { request, bufferBefore, isHit: false, evicted, bufferAfter: newBuf };
}

function formatBuffer(buf: number[], maxSize: number): string {
  const padded = buf.slice();
  while (padded.length < maxSize) padded.push(-1);
  return padded.map((v) => (v === -1 ? '—' : String(v))).join(' , ');
}

// --- Component ---

export function LRUSimulator() {
  // Config
  const [frameCount, setFrameCount] = useState(3);
  const [sequenceInput, setSequenceInput] = useState('2, 1, 4, 2, 5, 1, 2, 4, 5, 1');

  // Simulation
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [history, setHistory] = useState<LRUStep[]>([]);
  const [buffer, setBuffer] = useState<number[]>([]);
  const [simStarted, setSimStarted] = useState(false);

  // Interaction phases
  const [phase, setPhase] = useState<'idle' | 'predict' | 'evict' | 'done'>('idle');
  const pendingRef = useRef<PendingStep | null>(null);
  const [userPrediction, setUserPrediction] = useState<'hit' | 'miss' | null>(null);
  const [predictionCorrect, setPredictionCorrect] = useState<boolean | null>(null);
  const [evictionChoice, setEvictionChoice] = useState<number | null>(null);

  // Parsed sequence
  const parsedSequence = useMemo(() => {
    return sequenceInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map(Number)
      .filter((n) => !isNaN(n));
  }, [sequenceInput]);

  // Totals
  const totals = useMemo(() => {
    let hits = 0;
    let misses = 0;
    history.forEach((s) => {
      if (s.isHit) hits++;
      else misses++;
    });
    return { hits, misses, diff: misses - hits };
  }, [history]);

  // Initialize
  const initSim = useCallback(() => {
    const seq = parsedSequence;
    setSequence(seq);
    setCurrentIdx(-1);
    setHistory([]);
    setBuffer([]);
    setSimStarted(true);
    setPhase('idle');
    setUserPrediction(null);
    setPredictionCorrect(null);
    setEvictionChoice(null);
    pendingRef.current = null;
  }, [parsedSequence]);

  // Advance one request
  const stepForward = useCallback(() => {
    if (!simStarted) {
      initSim();
    }
    const nextIdx = currentIdx + 1;
    if (nextIdx >= sequence.length) return;

    setCurrentIdx(nextIdx);
    setPhase('predict');
    setUserPrediction(null);
    setPredictionCorrect(null);
    setEvictionChoice(null);

    // Pre-compute the result
    const result = performLRUStep(buffer, sequence[nextIdx]);
    pendingRef.current = result;
  }, [simStarted, currentIdx, sequence, buffer, initSim]);

  // User predicts hit/miss
  const handlePrediction = useCallback(
    (pred: 'hit' | 'miss') => {
      const result = pendingRef.current;
      if (!result) return;

      setUserPrediction(pred);
      const correct = pred === (result.isHit ? 'hit' : 'miss');
      setPredictionCorrect(correct);

      if (result.isHit) {
        // On hit, no eviction needed — record immediately
        const step: LRUStep = {
          stepNum: currentIdx + 1,
          request: result.request,
          bufferBefore: result.bufferBefore,
          isHit: true,
          evicted: null,
          bufferAfter: result.bufferAfter,
          userPrediction: pred,
          predictionCorrect: correct,
        };
        setHistory((prev) => [...prev, step]);
        setBuffer(result.bufferAfter);
        setPhase(currentIdx + 1 >= sequence.length - 1 ? 'done' : 'idle');
      } else {
        // On miss — if buffer was full, ask for eviction
        if (buffer.length === frameCount && frameCount > 0) {
          setPhase('evict');
        } else {
          // Miss with empty slot — record immediately
          const step: LRUStep = {
            stepNum: currentIdx + 1,
            request: result.request,
            bufferBefore: result.bufferBefore,
            isHit: false,
            evicted: null,
            bufferAfter: result.bufferAfter,
            userPrediction: pred,
            predictionCorrect: correct,
          };
          setHistory((prev) => [...prev, step]);
          setBuffer(result.bufferAfter);
          setPhase(currentIdx + 1 >= sequence.length - 1 ? 'done' : 'idle');
        }
      }
    },
    [currentIdx, sequence.length, buffer, frameCount]
  );

  // User chooses eviction
  const handleEviction = useCallback(
    (page: number) => {
      const result = pendingRef.current;
      if (!result) return;

      setEvictionChoice(page);

      // Record the step with correct LRU eviction
      const step: LRUStep = {
        stepNum: currentIdx + 1,
        request: result.request,
        bufferBefore: result.bufferBefore,
        isHit: false,
        evicted: result.evicted, // always evict LRU
        bufferAfter: result.bufferAfter,
        userPrediction,
        predictionCorrect,
      };
      setHistory((prev) => [...prev, step]);
      setBuffer(result.bufferAfter);
      setPhase(currentIdx + 1 >= sequence.length - 1 ? 'done' : 'idle');
    },
    [currentIdx, sequence.length, userPrediction, predictionCorrect]
  );

  const isComplete = phase === 'done' || (simStarted && currentIdx >= sequence.length - 1 && phase === 'idle');

  return (
    <section aria-label="LRU Simulator" className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layers className="size-5 text-[#1D5FD1]" aria-hidden="true" />
            <CardTitle className="text-xl">LRU Page Replacement Simulator</CardTitle>
          </div>
          <CardDescription>
            Step through an LRU simulation, predict hits and misses, and choose which page to evict.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Example buttons */}
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => {
                  setFrameCount(ex.frames);
                  setSequenceInput(ex.sequence);
                  setSimStarted(false);
                  setPhase('idle');
                  setCurrentIdx(-1);
                  setHistory([]);
                  setBuffer([]);
                }}
              >
                Load: {ex.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSimStarted(false);
                setPhase('idle');
                setCurrentIdx(-1);
                setHistory([]);
                setBuffer([]);
                setUserPrediction(null);
                setPredictionCorrect(null);
              }}
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Reset
            </Button>
          </div>

          {/* Input fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="lru-frames">Number of Frames (1–6)</Label>
              <Input
                id="lru-frames"
                type="number"
                min={1}
                max={6}
                value={frameCount}
                onChange={(e) =>
                  setFrameCount(Math.max(1, Math.min(6, parseInt(e.target.value, 10) || 1)))
                }
                disabled={simStarted && phase !== 'idle'}
                className="tabular-nums"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lru-seq">Request Sequence (comma-separated)</Label>
              <Input
                id="lru-seq"
                placeholder="e.g., 2, 1, 4, 2, 5"
                value={sequenceInput}
                onChange={(e) => setSequenceInput(e.target.value)}
                disabled={simStarted && phase !== 'idle'}
              />
            </div>
          </div>

          {/* Start / Step */}
          <div className="flex items-center gap-3">
            {!simStarted ? (
              <Button onClick={initSim} disabled={parsedSequence.length === 0}>
                <Play className="size-3.5" aria-hidden="true" />
                Start Simulation
              </Button>
            ) : (
              <Button
                onClick={stepForward}
                disabled={isComplete || phase === 'predict' || phase === 'evict'}
              >
                <ArrowRight className="size-3.5" aria-hidden="true" />
                Step Forward
              </Button>
            )}
            <span className="text-xs text-[#516174]">
              {simStarted
                ? isComplete
                  ? 'Simulation complete'
                  : `Step ${currentIdx + 1} of ${sequence.length}`
                : `${parsedSequence.length} requests ready`}
            </span>
          </div>

          {/* Buffer visualization */}
          {simStarted && (
            <div className="space-y-3">
              <Label>Buffer State (LRU → MRU)</Label>
              <div
                className="flex items-center gap-1 min-h-[52px] flex-wrap"
                role="list"
                aria-label="Buffer contents from LRU to MRU"
              >
                {Array.from({ length: frameCount }).map((_, i) => {
                  const val = buffer[i];
                  const isMRU = i === buffer.length - 1 && val !== undefined;
                  const isLRU = i === 0 && val !== undefined;
                  return (
                    <div key={i} className="flex items-center gap-1">
                      {i > 0 && (
                        <ArrowRight className="size-3 text-[#D9E2EF]" aria-hidden="true" />
                      )}
                      <div
                        className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg border-2 tabular-nums ${
                          val !== undefined
                            ? 'bg-[#EAF2FF] border-[#1D5FD1]/30 text-[#15253D] font-semibold text-lg'
                            : 'bg-[#F0F2F5] border-[#D9E2EF] text-[#516174] text-sm'
                        } ${isMRU ? 'ring-2 ring-[#1D5FD1]/20' : ''}`}
                        role="listitem"
                        aria-label={`Frame ${i + 1}: ${val !== undefined ? val : 'empty'}${
                          isLRU ? ' (LRU)' : isMRU ? ' (MRU)' : ''
                        }`}
                      >
                        <span>{val !== undefined ? val : '—'}</span>
                        {isLRU && buffer.length > 1 && (
                          <span className="text-[9px] text-[#A85D00]">LRU</span>
                        )}
                        {isMRU && (
                          <span className="text-[9px] text-[#0B7A75]">MRU</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Prediction phase */}
          {phase === 'predict' && currentIdx >= 0 && (
            <div className="bg-[#FFF4DF] border border-[#D9E2EF] rounded-lg p-4 space-y-3">
              <p className="text-sm font-medium text-[#15253D]">
                Request:{' '}
                <span className="font-mono text-lg font-bold">{sequence[currentIdx]}</span>
                {' '}— Predict: Hit or Miss?
              </p>
              <div className="flex gap-2" role="group" aria-label="Prediction buttons">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#0B7A75] text-[#0B7A75] hover:bg-[#E7F6F2]"
                  onClick={() => handlePrediction('hit')}
                  aria-label="Predict hit"
                >
                  <CheckCircle2 className="size-3.5" aria-hidden="true" />
                  Hit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#A85D00] text-[#A85D00] hover:bg-[#FFF4DF]"
                  onClick={() => handlePrediction('miss')}
                  aria-label="Predict miss"
                >
                  <XCircle className="size-3.5" aria-hidden="true" />
                  Miss
                </Button>
              </div>
            </div>
          )}

          {/* Eviction phase */}
          {phase === 'evict' && currentIdx >= 0 && pendingRef.current && (
            <div className="space-y-3">
              <div
                className={`border rounded-lg p-4 space-y-3 ${
                  evictionChoice !== null
                    ? evictionChoice === pendingRef.current.evicted
                      ? 'bg-[#E7F6F2] border-[#0B7A75]/30'
                      : 'bg-[#FEF2F2] border-[#B42318]/30'
                    : 'bg-[#FEF2F2] border-[#B42318]/30'
                }`}
              >
                <p className="text-sm font-medium text-[#15253D]">
                  Buffer is full. Which page should LRU evict?
                </p>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Eviction choices">
                  {buffer.map((page) => (
                    <Button
                      key={page}
                      size="sm"
                      variant="outline"
                      disabled={evictionChoice !== null}
                      onClick={() => handleEviction(page)}
                      className={
                        evictionChoice !== null && page === pendingRef.current?.evicted
                          ? 'border-[#0B7A75] text-[#0B7A75] bg-[#E7F6F2]'
                          : ''
                      }
                    >
                      Evict {page}
                    </Button>
                  ))}
                </div>
                {evictionChoice !== null && (
                  <div className="text-sm space-y-1">
                    {predictionCorrect !== null && (
                      <p className={predictionCorrect ? 'text-[#0B7A75]' : 'text-[#B42318]'}>
                        Prediction ({userPrediction}) was{' '}
                        {predictionCorrect ? 'correct ✓' : 'incorrect ✗'}
                      </p>
                    )}
                    <p className="text-[#516174]">
                      {evictionChoice === pendingRef.current.evicted
                        ? `Correct! Page ${pendingRef.current.evicted} was the LRU page.`
                        : `LRU always evicts the least recently used page: ${pendingRef.current.evicted}.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Running totals */}
          {history.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#E7F6F2] border border-[#0B7A75]/20 rounded-lg p-3 text-center">
                <p className="text-xs text-[#516174]">Total Hits</p>
                <p className="text-xl font-semibold text-[#0B7A75] tabular-nums">{totals.hits}</p>
              </div>
              <div className="bg-[#FFF4DF] border border-[#A85D00]/20 rounded-lg p-3 text-center">
                <p className="text-xs text-[#516174]">Total Misses</p>
                <p className="text-xl font-semibold text-[#A85D00] tabular-nums">{totals.misses}</p>
              </div>
              <div className="bg-[#FEF2F2] border border-[#B42318]/20 rounded-lg p-3 text-center">
                <p className="text-xs text-[#516174]">Misses − Hits</p>
                <p className="text-xl font-semibold text-[#B42318] tabular-nums">{totals.diff}</p>
              </div>
            </div>
          )}

          {/* History table */}
          {history.length > 0 && (
            <div className="space-y-2">
              <Label>Step History</Label>
              <div className="max-h-72 overflow-y-auto custom-scrollbar rounded-lg border border-[#D9E2EF]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead className="w-14 text-center">Req</TableHead>
                      <TableHead>Buffer Before</TableHead>
                      <TableHead className="w-16 text-center">Result</TableHead>
                      <TableHead className="w-16 text-center">Evicted</TableHead>
                      <TableHead>Buffer After</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((step) => (
                      <TableRow
                        key={step.stepNum}
                        className={step.isHit ? 'bg-[#E7F6F2]/40' : 'bg-[#FFF4DF]/40'}
                      >
                        <TableCell className="text-center tabular-nums">{step.stepNum}</TableCell>
                        <TableCell className="text-center font-mono font-semibold">
                          {step.request}
                        </TableCell>
                        <TableCell className="font-mono text-xs tabular-nums">
                          {formatBuffer(step.bufferBefore, frameCount)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={
                              step.isHit
                                ? 'border-[#0B7A75] text-[#0B7A75]'
                                : 'border-[#A85D00] text-[#A85D00]'
                            }
                          >
                            {step.isHit ? 'Hit' : 'Miss'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                          {step.evicted !== null ? (
                            <span className="text-[#B42318]">{step.evicted}</span>
                          ) : (
                            <span className="text-[#516174]">—</span>
                          )}
                        </TableCell>
                        <TableCell className="font-mono text-xs tabular-nums">
                          {formatBuffer(step.bufferAfter, frameCount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

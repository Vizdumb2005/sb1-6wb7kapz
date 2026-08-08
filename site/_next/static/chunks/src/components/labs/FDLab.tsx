'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle2, XCircle, RotateCcw, BookOpen, ChevronRight, AlertTriangle, Brain } from 'lucide-react';

// --- Types ---

interface FD {
  lhs: string[];
  rhs: string[];
}

interface FDProblem {
  id: string;
  title: string;
  difficulty: 'Foundation' | 'Exam' | 'Challenge';
  relation: string[];
  fds: FD[];
}

interface ClosureStep {
  fd: FD;
  added: string[];
  closureAfter: string[];
}

// --- Pre-loaded Problems ---

const EXAMPLE_PROBLEMS: FDProblem[] = [
  {
    id: 'p1',
    title: 'Basic Closure',
    difficulty: 'Foundation',
    relation: ['A', 'B', 'C', 'D'],
    fds: [
      { lhs: ['A', 'B'], rhs: ['C'] },
      { lhs: ['C'], rhs: ['D'] },
    ],
  },
  {
    id: 'p2',
    title: 'Key Finding & Superkeys',
    difficulty: 'Exam',
    relation: ['A', 'B', 'C', 'D', 'E', 'F'],
    fds: [
      { lhs: ['A'], rhs: ['B', 'C'] },
      { lhs: ['C'], rhs: ['D'] },
      { lhs: ['B', 'D'], rhs: ['E'] },
      { lhs: ['E'], rhs: ['F'] },
    ],
  },
  {
    id: 'p3',
    title: 'Multiple Candidate Keys',
    difficulty: 'Challenge',
    relation: ['A', 'B', 'C', 'D'],
    fds: [
      { lhs: ['A', 'B'], rhs: ['C', 'D'] },
      { lhs: ['C'], rhs: ['B'] },
      { lhs: ['D'], rhs: ['A'] },
    ],
  },
];

// --- Helpers ---

function fdToString(fd: FD): string {
  return `${fd.lhs.join('')} → ${fd.rhs.join('')}`;
}

function setIsSubsetOf(set: string[], superset: string[]): boolean {
  return set.every((a) => superset.includes(a));
}

function setUnion(a: string[], b: string[]): string[] {
  const s = new Set(a);
  b.forEach((x) => s.add(x));
  return Array.from(s).sort();
}

function setDifference(a: string[], b: string[]): string[] {
  return a.filter((x) => !b.includes(x));
}

// Check if closure is complete (all FDs applied that can be)
function closureComplete(closure: string[], fds: FD[], allAttrs: string[]): boolean {
  for (const fd of fds) {
    if (setIsSubsetOf(fd.lhs, closure)) {
      const added = setDifference(fd.rhs, closure);
      if (added.length > 0) return false;
    }
  }
  return true;
}

// Find all attributes that never appear on any RHS
function findNeverOnRHS(allAttrs: string[], fds: FD[]): string[] {
  const onRHS = new Set<string>();
  fds.forEach((fd) => fd.rhs.forEach((a) => onRHS.add(a)));
  return allAttrs.filter((a) => !onRHS.has(a));
}

// Check if a given set is a superkey (closure = all attributes)
function computeFullClosure(start: string[], fds: FD[], allAttrs: string[]): string[] {
  let closure = [...start];
  let changed = true;
  let iterations = 0;
  while (changed && iterations < 100) {
    changed = false;
    iterations++;
    for (const fd of fds) {
      if (setIsSubsetOf(fd.lhs, closure)) {
        const added = setDifference(fd.rhs, closure);
        if (added.length > 0) {
          closure = setUnion(closure, added);
          changed = true;
        }
      }
    }
  }
  return closure;
}

// --- Common Mistakes ---

const COMMON_MISTAKES = {
  closure: [
    'I stopped too early — I must re-scan all FDs after each addition.',
    'I forgot to chain: adding one attribute can enable a new FD.',
    'I applied an FD whose LHS is not fully contained in the current closure.',
    'I confused "closure" with "all attributes" — closure is only what X determines.',
  ],
  key: [
    'I called a set a candidate key without checking minimality.',
    'I forgot that candidate keys must contain ALL attributes never on the RHS.',
    'I confused superkey with candidate key — a superkey is not always minimal.',
    'I missed a candidate key because I did not try all attribute combinations.',
  ],
  superkey: [
    'I used 2^(n−k) without checking for multiple candidate keys.',
    'I double-counted supersets that contain more than one candidate key (use inclusion-exclusion).',
    'I forgot that superkeys are all sets containing at least one candidate key.',
  ],
};

// --- Main Component ---

export function FDLab() {
  // Problem selection state
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const problem = EXAMPLE_PROBLEMS[activeProblemIdx];

  // Closure explorer state
  const [selectedAttrs, setSelectedAttrs] = useState<string[]>([]);
  const [closure, setClosure] = useState<string[]>([]);
  const [steps, setSteps] = useState<ClosureStep[]>([]);
  const [closureDone, setClosureDone] = useState(false);
  const [closureStarted, setClosureStarted] = useState(false);

  // Key finder state
  const [keyTestSet, setKeyTestSet] = useState<string[]>([]);
  const [keyResult, setKeyResult] = useState<{ isSuperkey: boolean; isCandidate: boolean; closure: string[] } | null>(null);

  // Superkey calculator
  const [candidateKeyInput, setCandidateKeyInput] = useState('');
  const [relationSizeInput, setRelationSizeInput] = useState('');
  const [superkeyResult, setSuperkeyResult] = useState<number | null>(null);

  // Mistake explain toggle
  const [showMistakes, setShowMistakes] = useState(false);

  // Active tab
  const [activeTab, setActiveTab] = useState('closure');

  // --- Closure logic ---

  const resetClosure = useCallback(() => {
    setSelectedAttrs([]);
    setClosure([]);
    setSteps([]);
    setClosureDone(false);
    setClosureStarted(false);
  }, []);

  const toggleSelection = useCallback(
    (attr: string) => {
      if (closureStarted) return;
      setSelectedAttrs((prev) =>
        prev.includes(attr) ? prev.filter((a) => a !== attr) : [...prev, attr]
      );
    },
    [closureStarted]
  );

  const startClosure = useCallback(() => {
    if (selectedAttrs.length === 0) return;
    setClosure([...selectedAttrs]);
    setSteps([]);
    setClosureDone(false);
    setClosureStarted(true);
  }, [selectedAttrs]);

  const applyFD = useCallback(
    (fd: FD) => {
      if (!setIsSubsetOf(fd.lhs, closure)) return;
      const added = setDifference(fd.rhs, closure);
      if (added.length === 0) return;
      const newClosure = setUnion(closure, added);
      const step: ClosureStep = { fd, added, closureAfter: [...newClosure] };
      setClosure(newClosure);
      setSteps((prev) => [...prev, step]);
      if (closureComplete(newClosure, problem.fds, problem.relation)) {
        setClosureDone(true);
      }
    },
    [closure, problem]
  );

  const isSuperkey = useMemo(
    () => closure.length === problem.relation.length && closureStarted,
    [closure, problem.relation.length, closureStarted]
  );

  // Available FDs that can be applied (LHS ⊆ closure and adds something new)
  const availableFDs = useMemo(() => {
    return problem.fds.filter(
      (fd) => setIsSubsetOf(fd.lhs, closure) && setDifference(fd.rhs, closure).length > 0
    );
  }, [closure, problem.fds]);

  // Never-on-RHS attributes
  const neverOnRHS = useMemo(
    () => findNeverOnRHS(problem.relation, problem.fds),
    [problem]
  );

  // --- Key finder logic ---
  const testKey = useCallback(() => {
    if (keyTestSet.length === 0) return;
    const fullClosure = computeFullClosure(keyTestSet, problem.fds, problem.relation);
    const isSuper = fullClosure.length === problem.relation.length;
    let isCandidate = false;
    if (isSuper) {
      // Check minimality: no proper subset should be a superkey
      isCandidate = true;
      for (let i = 0; i < keyTestSet.length; i++) {
        const subset = keyTestSet.filter((_, idx) => idx !== i);
        const subClosure = computeFullClosure(subset, problem.fds, problem.relation);
        if (subClosure.length === problem.relation.length) {
          isCandidate = false;
          break;
        }
      }
    }
    setKeyResult({ isSuperkey: isSuper, isCandidate, closure: fullClosure });
  }, [keyTestSet, problem]);

  // --- Superkey calc ---
  const calcSuperkeys = useCallback(() => {
    const k = candidateKeyInput.trim().split(/\s*,\s*/).filter(Boolean).length;
    const n = parseInt(relationSizeInput, 10);
    if (k > 0 && n > 0 && n >= k) {
      setSuperkeyResult(Math.pow(2, n - k));
    }
  }, [candidateKeyInput, relationSizeInput]);

  // --- Render ---

  return (
    <section aria-label="Functional Dependency Lab" className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="size-5 text-[#1D5FD1]" aria-hidden="true" />
            <CardTitle className="text-xl">FD Closure &amp; Key Finder</CardTitle>
          </div>
          <CardDescription>
            Compute attribute closures step by step, find candidate keys, and count superkeys.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Problem selector */}
          <div className="space-y-2">
            <Label id="problem-label">Example Problem</Label>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="problem-label">
              {EXAMPLE_PROBLEMS.map((p, idx) => (
                <Button
                  key={p.id}
                  variant={idx === activeProblemIdx ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setActiveProblemIdx(idx);
                    resetClosure();
                    setKeyTestSet([]);
                    setKeyResult(null);
                    setSuperkeyResult(null);
                  }}
                  aria-pressed={idx === activeProblemIdx}
                >
                  {p.title}
                  <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">
                    {p.difficulty}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Schema display */}
          <div className="bg-[#EAF2FF] border border-[#D9E2EF] rounded-lg p-4">
            <p className="text-sm font-medium text-[#15253D]">
              Relation:{' '}
              <span className="font-mono">
                R({problem.relation.join(', ')})
              </span>
            </p>
            <p className="text-sm text-[#516174] mt-1">
              F = {'{ ' + problem.fds.map(fdToString).join(', ') + ' }'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList aria-label="Lab sections">
          <TabsTrigger value="closure">Closure Explorer</TabsTrigger>
          <TabsTrigger value="keyfinder">Key Finder</TabsTrigger>
          <TabsTrigger value="superkey">Superkey Counter</TabsTrigger>
        </TabsList>

        {/* --- CLOSURE EXPLORER --- */}
        <TabsContent value="closure" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Step-by-Step Closure</CardTitle>
              <CardDescription>
                Select attributes, compute the closure, then click FDs to apply them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Attribute selector */}
              <div className="space-y-2">
                <Label id="attr-select-label">
                  Select starting attribute set X
                  {closureStarted && (
                    <Badge variant="secondary" className="ml-2 text-[10px]">Locked</Badge>
                  )}
                </Label>
                <div className="flex flex-wrap gap-2" role="group" aria-labelledby="attr-select-label">
                  {problem.relation.map((attr) => (
                    <Button
                      key={attr}
                      variant={selectedAttrs.includes(attr) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleSelection(attr)}
                      disabled={closureStarted}
                      aria-pressed={selectedAttrs.includes(attr)}
                      aria-label={`Attribute ${attr}`}
                    >
                      {attr}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={startClosure} disabled={selectedAttrs.length === 0 || closureStarted} size="sm">
                    Start Closure
                  </Button>
                  <Button onClick={resetClosure} variant="outline" size="sm">
                    <RotateCcw className="size-3.5" aria-hidden="true" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Current closure */}
              {closureStarted && (
                <div className="space-y-3">
                  <div className="bg-[#EAF2FF] border border-[#D9E2EF] rounded-lg p-4">
                    <p className="text-sm font-medium text-[#15253D]">
                      Current {selectedAttrs.join('')}&thinsp;⁺ = {'{'}
                      <span className="font-mono font-semibold">{closure.join(', ')}</span>
                      {'}'}
                    </p>
                    {closureDone && isSuperkey && (
                      <div className="flex items-center gap-1.5 mt-2 text-[#0B7A75]">
                        <CheckCircle2 className="size-4" aria-hidden="true" />
                        <span className="text-sm font-medium">
                          {selectedAttrs.join('')} is a superkey (closure covers all attributes).
                        </span>
                      </div>
                    )}
                    {closureDone && !isSuperkey && (
                      <div className="flex items-center gap-1.5 mt-2 text-[#B42318]">
                        <XCircle className="size-4" aria-hidden="true" />
                        <span className="text-sm font-medium">
                          {selectedAttrs.join('')} is NOT a superkey.
                        </span>
                      </div>
                    )}
                    {closureDone && availableFDs.length === 0 && (
                      <p className="text-xs text-[#516174] mt-1">
                        No more FDs can be applied. Closure is complete.
                      </p>
                    )}
                  </div>

                  {/* FD application buttons */}
                  {!closureDone && (
                    <div className="space-y-2">
                      <Label id="apply-fd-label">Click an FD to apply next:</Label>
                      <div className="flex flex-wrap gap-2" role="group" aria-labelledby="apply-fd-label">
                        {problem.fds.map((fd, idx) => {
                          const canApply =
                            setIsSubsetOf(fd.lhs, closure) &&
                            setDifference(fd.rhs, closure).length > 0;
                          return (
                            <Button
                              key={idx}
                              variant={canApply ? 'default' : 'outline'}
                              size="sm"
                              disabled={!canApply}
                              onClick={() => applyFD(fd)}
                              aria-label={`Apply ${fdToString(fd)}`}
                              className={!canApply ? 'opacity-50' : ''}
                            >
                              {fdToString(fd)}
                              {canApply && (
                                <ChevronRight className="size-3.5" aria-hidden="true" />
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Steps history */}
                  {steps.length > 0 && (
                    <div className="space-y-2">
                      <Label>Steps Applied</Label>
                      <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1.5">
                        {steps.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm bg-[#F0F2F5] rounded-md px-3 py-2"
                          >
                            <Badge variant="secondary" className="tabular-nums text-[10px]">
                              {idx + 1}
                            </Badge>
                            <span className="font-mono text-xs">{fdToString(step.fd)}</span>
                            <span className="text-[#516174]">→ added</span>
                            <span className="font-mono font-semibold text-[#0B7A75]">
                              {step.added.join(', ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mistake explainer */}
              <div className="flex items-center gap-3 border-t border-[#D9E2EF] pt-4">
                <Switch
                  id="mistake-toggle"
                  checked={showMistakes}
                  onCheckedChange={setShowMistakes}
                  aria-label="Toggle common mistakes"
                />
                <Label htmlFor="mistake-toggle" className="cursor-pointer flex items-center gap-1.5">
                  <AlertTriangle className="size-4 text-[#A85D00]" aria-hidden="true" />
                  Explain common mistakes
                </Label>
              </div>
              {showMistakes && (
                <div className="bg-[#FFF4DF] border border-[#D9E2EF] rounded-lg p-4 space-y-2">
                  {COMMON_MISTAKES.closure.map((m, i) => (
                    <p key={i} className="text-sm text-[#516174] flex items-start gap-2">
                      <span className="text-[#A85D00] font-semibold tabular-nums">{i + 1}.</span>
                      {m}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- KEY FINDER --- */}
        <TabsContent value="keyfinder" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Candidate Key Finder</CardTitle>
              <CardDescription>
                Test if an attribute set is a superkey or candidate key.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Never on RHS */}
              <div className="bg-[#E7F6F2] border border-[#D9E2EF] rounded-lg p-4">
                <p className="text-sm font-medium text-[#15253D]">
                  Attributes never on RHS (must appear in every candidate key):
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {neverOnRHS.length > 0 ? (
                    neverOnRHS.map((a) => (
                      <Badge key={a} className="bg-[#0B7A75] text-white">
                        {a}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-[#516174]">
                      All attributes appear on some RHS — try combinations.
                    </span>
                  )}
                </div>
              </div>

              {/* Key test input */}
              <div className="space-y-2">
                <Label id="key-test-label">Select attributes to test as key:</Label>
                <div className="flex flex-wrap gap-2" role="group" aria-labelledby="key-test-label">
                  {problem.relation.map((attr) => (
                    <Button
                      key={attr}
                      variant={keyTestSet.includes(attr) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() =>
                        setKeyTestSet((prev) =>
                          prev.includes(attr) ? prev.filter((a) => a !== attr) : [...prev, attr]
                        )
                      }
                      aria-pressed={keyTestSet.includes(attr)}
                    >
                      {attr}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={testKey} disabled={keyTestSet.length === 0} size="sm">
                    Test Key
                  </Button>
                  <Button
                    onClick={() => {
                      setKeyTestSet([]);
                      setKeyResult(null);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Result */}
              {keyResult && (
                <div
                  className={`border rounded-lg p-4 space-y-2 ${
                    keyResult.isCandidate
                      ? 'bg-[#E7F6F2] border-[#0B7A75]/30'
                      : keyResult.isSuperkey
                      ? 'bg-[#FFF4DF] border-[#A85D00]/30'
                      : 'bg-[#FEF2F2] border-[#B42318]/30'
                  }`}
                >
                  <p className="font-mono text-sm">
                    {keyTestSet.join('')}&thinsp;⁺ = {'{'}
                    {keyResult.closure.join(', ')}
                    {'}'}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {keyResult.isCandidate ? (
                      <>
                        <CheckCircle2 className="size-4 text-[#0B7A75]" aria-hidden="true" />
                        <span className="text-sm font-medium text-[#0B7A75]">
                          {keyTestSet.join('')} is a candidate key (superkey &amp; minimal).
                        </span>
                      </>
                    ) : keyResult.isSuperkey ? (
                      <>
                        <AlertTriangle className="size-4 text-[#A85D00]" aria-hidden="true" />
                        <span className="text-sm font-medium text-[#A85D00]">
                          {keyTestSet.join('')} is a superkey but NOT a candidate key (not minimal).
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="size-4 text-[#B42318]" aria-hidden="true" />
                        <span className="text-sm font-medium text-[#B42318]">
                          {keyTestSet.join('')} is NOT a superkey.
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Mistake explainer */}
              <div className="flex items-center gap-3 border-t border-[#D9E2EF] pt-4">
                <Switch
                  id="key-mistake-toggle"
                  checked={showMistakes}
                  onCheckedChange={setShowMistakes}
                  aria-label="Toggle common mistakes"
                />
                <Label htmlFor="key-mistake-toggle" className="cursor-pointer flex items-center gap-1.5">
                  <AlertTriangle className="size-4 text-[#A85D00]" aria-hidden="true" />
                  Explain common mistakes
                </Label>
              </div>
              {showMistakes && (
                <div className="bg-[#FFF4DF] border border-[#D9E2EF] rounded-lg p-4 space-y-2">
                  {COMMON_MISTAKES.key.map((m, i) => (
                    <p key={i} className="text-sm text-[#516174] flex items-start gap-2">
                      <span className="text-[#A85D00] font-semibold tabular-nums">{i + 1}.</span>
                      {m}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- SUPERKEY COUNTER --- */}
        <TabsContent value="superkey" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Superkey Count Calculator</CardTitle>
              <CardDescription>
                For a single candidate key, superkeys = 2<sup>(n−k)</sup>.
                Use this when there is only one candidate key.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Formula card */}
              <div className="bg-[#EAF2FF] border border-[#D9E2EF] rounded-lg p-4 font-mono text-sm">
                <p>superkeys = 2<sup>n − k</sup></p>
                <p className="text-[#516174] text-xs mt-1">
                  n = total attributes, k = candidate key size
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="ck-input">Candidate key attributes (comma-separated)</Label>
                  <Input
                    id="ck-input"
                    placeholder="e.g., A, B"
                    value={candidateKeyInput}
                    onChange={(e) => {
                      setCandidateKeyInput(e.target.value);
                      setSuperkeyResult(null);
                    }}
                    aria-describedby="ck-hint"
                  />
                  <p id="ck-hint" className="text-xs text-[#516174]">
                    Enter the attributes in the candidate key
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="n-input">Total attributes (n)</Label>
                  <Input
                    id="n-input"
                    type="number"
                    min={1}
                    placeholder="e.g., 6"
                    value={relationSizeInput}
                    onChange={(e) => {
                      setRelationSizeInput(e.target.value);
                      setSuperkeyResult(null);
                    }}
                    aria-describedby="n-hint"
                  />
                  <p id="n-hint" className="text-xs text-[#516174]">
                    Total number of attributes in the relation
                  </p>
                </div>
              </div>

              <Button onClick={calcSuperkeys} size="sm">
                Compute
              </Button>

              {superkeyResult !== null && (
                <div className="bg-[#E7F6F2] border border-[#0B7A75]/30 rounded-lg p-4">
                  <p className="text-sm text-[#516174]">Number of superkeys:</p>
                  <p className="text-2xl font-semibold text-[#0B7A75] tabular-nums mt-1">
                    {superkeyResult.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#516174] mt-1 font-mono">
                    2<sup>{relationSizeInput} − {candidateKeyInput.trim().split(/\s*,\s*/).filter(Boolean).length}</sup>{' '}
                    = 2<sup>{parseInt(relationSizeInput, 10) - candidateKeyInput.trim().split(/\s*,\s*/).filter(Boolean).length}</sup>{' '}
                    = {superkeyResult.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Mistake explainer */}
              <div className="flex items-center gap-3 border-t border-[#D9E2EF] pt-4">
                <Switch
                  id="sk-mistake-toggle"
                  checked={showMistakes}
                  onCheckedChange={setShowMistakes}
                  aria-label="Toggle common mistakes"
                />
                <Label htmlFor="sk-mistake-toggle" className="cursor-pointer flex items-center gap-1.5">
                  <AlertTriangle className="size-4 text-[#A85D00]" aria-hidden="true" />
                  Explain common mistakes
                </Label>
              </div>
              {showMistakes && (
                <div className="bg-[#FFF4DF] border border-[#D9E2EF] rounded-lg p-4 space-y-2">
                  {COMMON_MISTAKES.superkey.map((m, i) => (
                    <p key={i} className="text-sm text-[#516174] flex items-start gap-2">
                      <span className="text-[#A85D00] font-semibold tabular-nums">{i + 1}.</span>
                      {m}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

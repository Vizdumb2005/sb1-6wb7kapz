'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { HardDrive, RotateCcw, AlertTriangle } from 'lucide-react';

// --- Types ---

interface DiskInput {
  platters: number;
  surfacesPerPlatter: number;
  tracksPerSurface: number;
  sectorsPerTrack: number;
  bytesPerSector: number;
  rpm: number;
  seekTimeMs: number;
  blockSizeKB: number;
  dataRateKBps: number;
}

interface DiskResult {
  capacityBytes: number;
  capacityMB: number;
  capacityGB: number;
  addressableSectors: number;
  addressingBits: number;
  timePerRevMs: number;
  avgRotLatMs: number;
  transferTimeMs: number;
  totalAccessTimeMs: number;
  steps: string[];
}

// --- Pre-loaded Examples ---

const EXAMPLES = [
  {
    label: 'Exam Problem (P5-style)',
    input: {
      platters: 6,
      surfacesPerPlatter: 2,
      tracksPerSurface: 2048,
      sectorsPerTrack: 1024,
      bytesPerSector: 512,
      rpm: 0,
      seekTimeMs: 0,
      blockSizeKB: 0,
      dataRateKBps: 0,
    },
  },
  {
    label: 'Access Time Problem (P6-style)',
    input: {
      platters: 0,
      surfacesPerPlatter: 0,
      tracksPerSurface: 0,
      sectorsPerTrack: 0,
      bytesPerSector: 0,
      rpm: 7200,
      seekTimeMs: 8,
      blockSizeKB: 4,
      dataRateKBps: 512,
    },
  },
];

function formatNum(n: number): string {
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

// --- Computation ---

function computeDisk(inp: DiskInput): DiskResult {
  const steps: string[] = [];

  // Capacity
  const capacityBytes =
    inp.platters * inp.surfacesPerPlatter * inp.tracksPerSurface * inp.sectorsPerTrack * inp.bytesPerSector;
  const capacityMB = capacityBytes / Math.pow(2, 20);
  const capacityGB = capacityBytes / Math.pow(2, 30);

  if (inp.platters > 0 && inp.bytesPerSector > 0) {
    steps.push(`Capacity = platters × surfaces/platter × tracks/surface × sectors/track × bytes/sector`);
    steps.push(
      `= ${inp.platters} × ${inp.surfacesPerPlatter} × ${inp.tracksPerSurface} × ${inp.sectorsPerTrack} × ${inp.bytesPerSector}`
    );
    steps.push(`= ${formatNum(capacityBytes)} bytes`);
    steps.push(`= ${formatNum(Math.round(capacityMB * 100) / 100)} MB = ${formatNum(Math.round(capacityGB * 100) / 100)} GB`);
    if (inp.bytesPerSector === 512) {
      steps.push(`(Note: 1 MB = 2²⁰ = ${Math.pow(2, 20).toLocaleString()} bytes, 1 GB = 2³⁰ = ${Math.pow(2, 30).toLocaleString()} bytes)`);
    }
  }

  // Addressable sectors
  const addressableSectors =
    inp.platters * inp.surfacesPerPlatter * inp.tracksPerSurface * inp.sectorsPerTrack;
  let addressingBits = 0;
  if (addressableSectors > 0) {
    addressingBits = Math.ceil(Math.log2(addressableSectors));
    steps.push('');
    steps.push(`Addressable sectors = platters × surfaces/platter × tracks/surface × sectors/track`);
    steps.push(
      `= ${formatNum(addressableSectors)}`
    );
    steps.push(`Addressing bits = ⌈log₂(${formatNum(addressableSectors)})⌉ = ${addressingBits} bits`);
  }

  // Rotational
  const timePerRevMs = inp.rpm > 0 ? 60000 / inp.rpm : 0;
  const avgRotLatMs = timePerRevMs / 2;

  if (inp.rpm > 0) {
    steps.push('');
    steps.push(`Time per revolution = 60,000 / RPM = 60,000 / ${inp.rpm} = ${formatNum(Math.round(timePerRevMs * 1000) / 1000)} ms`);
    steps.push(`Average rotational latency = time per revolution / 2 = ${formatNum(Math.round(avgRotLatMs * 1000) / 1000)} ms`);
  }

  // Transfer time
  const transferTimeMs =
    inp.blockSizeKB > 0 && inp.dataRateKBps > 0
      ? (inp.blockSizeKB / inp.dataRateKBps) * 1000
      : 0;

  if (inp.blockSizeKB > 0 && inp.dataRateKBps > 0) {
    steps.push('');
    steps.push(`Transfer time = block size / data rate`);
    steps.push(`= ${inp.blockSizeKB} KB / ${inp.dataRateKBps} KB/s`);
    steps.push(`= ${(inp.blockSizeKB / inp.dataRateKBps).toFixed(6)} s = ${formatNum(Math.round(transferTimeMs * 1000) / 1000)} ms`);
  }

  // Total access time
  const totalAccessTimeMs = inp.seekTimeMs + avgRotLatMs + transferTimeMs;

  if (inp.seekTimeMs > 0 && inp.rpm > 0) {
    steps.push('');
    steps.push(`Total access time = seek time + avg rotational latency + transfer time`);
    const parts: string[] = [];
    parts.push(`${formatNum(inp.seekTimeMs)} ms (seek)`);
    parts.push(`${formatNum(Math.round(avgRotLatMs * 1000) / 1000)} ms (avg rot. latency)`);
    if (transferTimeMs > 0) {
      parts.push(`${formatNum(Math.round(transferTimeMs * 1000) / 1000)} ms (transfer)`);
    }
    steps.push(`= ${parts.join(' + ')}`);
    steps.push(`= ${formatNum(Math.round(totalAccessTimeMs * 100) / 100)} ms`);
  }

  return {
    capacityBytes,
    capacityMB,
    capacityGB,
    addressableSectors,
    addressingBits,
    timePerRevMs,
    avgRotLatMs,
    transferTimeMs,
    totalAccessTimeMs,
    steps,
  };
}

// --- Component ---

export function DiskCalcLab() {
  const [input, setInput] = useState<DiskInput>({
    platters: 0,
    surfacesPerPlatter: 0,
    tracksPerSurface: 0,
    sectorsPerTrack: 0,
    bytesPerSector: 0,
    rpm: 0,
    seekTimeMs: 0,
    blockSizeKB: 0,
    dataRateKBps: 0,
  });
  const [result, setResult] = useState<DiskResult | null>(null);
  const [showSteps, setShowSteps] = useState(false);

  const updateField = useCallback(
    (field: keyof DiskInput, value: string) => {
      const num = value === '' ? 0 : parseFloat(value);
      setInput((prev) => ({ ...prev, [field]: isNaN(num) ? 0 : num }));
      setResult(null);
    },
    []
  );

  const handleCompute = useCallback(() => {
    setResult(computeDisk(input));
  }, [input]);

  const loadExample = useCallback((idx: number) => {
    setInput(EXAMPLES[idx].input);
    setResult(null);
    setShowSteps(true);
  }, []);

  const handleReset = useCallback(() => {
    setInput({
      platters: 0,
      surfacesPerPlatter: 0,
      tracksPerSurface: 0,
      sectorsPerTrack: 0,
      bytesPerSector: 0,
      rpm: 0,
      seekTimeMs: 0,
      blockSizeKB: 0,
      dataRateKBps: 0,
    });
    setResult(null);
    setShowSteps(false);
  }, []);

  // Determine which results to show
  const hasCapacity = input.platters > 0 && input.bytesPerSector > 0;
  const hasTiming = input.rpm > 0;

  // Field definitions for rendering
  const capacityFields: { key: keyof DiskInput; label: string; unit: string }[] = [
    { key: 'platters', label: 'Platters', unit: '' },
    { key: 'surfacesPerPlatter', label: 'Surfaces / Platter', unit: '' },
    { key: 'tracksPerSurface', label: 'Tracks / Surface', unit: '' },
    { key: 'sectorsPerTrack', label: 'Sectors / Track', unit: '' },
    { key: 'bytesPerSector', label: 'Bytes / Sector', unit: '' },
  ];

  const timingFields: { key: keyof DiskInput; label: string; unit: string }[] = [
    { key: 'rpm', label: 'RPM', unit: '' },
    { key: 'seekTimeMs', label: 'Average Seek Time', unit: 'ms' },
    { key: 'blockSizeKB', label: 'Block Size', unit: 'KB' },
    { key: 'dataRateKBps', label: 'Data Rate', unit: 'KB/s' },
  ];

  return (
    <section aria-label="Disk Calculation Lab" className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HardDrive className="size-5 text-[#1D5FD1]" aria-hidden="true" />
            <CardTitle className="text-xl">Disk Calculator</CardTitle>
          </div>
          <CardDescription>
            Compute disk capacity, addressing bits, rotational latency, and access time with step-by-step units.
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
                onClick={() => loadExample(idx)}
              >
                Load: {ex.label}
              </Button>
            ))}
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Clear All
            </Button>
          </div>

          {/* Capacity inputs */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#15253D] flex items-center gap-2">
              <Badge variant="secondary">Capacity &amp; Addressing</Badge>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {capacityFields.map(({ key, label, unit }) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`disk-${key}`}>
                    {label} {unit && <span className="text-[#516174]">({unit})</span>}
                  </Label>
                  <Input
                    id={`disk-${key}`}
                    type="number"
                    min={0}
                    placeholder="0"
                    value={input[key] || ''}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="tabular-nums"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Timing inputs */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#15253D] flex items-center gap-2">
              <Badge variant="secondary">Timing &amp; Access</Badge>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {timingFields.map(({ key, label, unit }) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`disk-${key}`}>
                    {label} {unit && <span className="text-[#516174]">({unit})</span>}
                  </Label>
                  <Input
                    id={`disk-${key}`}
                    type="number"
                    min={0}
                    step="any"
                    placeholder="0"
                    value={input[key] || ''}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="tabular-nums"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Compute button */}
          <div className="flex items-center gap-4">
            <Button onClick={handleCompute} disabled={!hasCapacity && !hasTiming}>
              Compute
            </Button>
            <div className="flex items-center gap-2">
              <Switch
                id="show-steps"
                checked={showSteps}
                onCheckedChange={setShowSteps}
                aria-label="Show calculation steps"
              />
              <Label htmlFor="show-steps" className="cursor-pointer">
                Show Steps
              </Label>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Capacity results */}
              {hasCapacity && (
                <div className="bg-[#EAF2FF] border border-[#D9E2EF] rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-[#15253D]">Capacity &amp; Addressing</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-[#516174]">Capacity (bytes)</p>
                      <p className="text-lg font-semibold text-[#15253D] tabular-nums">
                        {formatNum(result.capacityBytes)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#516174]">Capacity (MB)</p>
                      <p className="text-lg font-semibold text-[#15253D] tabular-nums">
                        {formatNum(Math.round(result.capacityMB * 100) / 100)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#516174]">Capacity (GB)</p>
                      <p className="text-lg font-semibold text-[#15253D] tabular-nums">
                        {formatNum(Math.round(result.capacityGB * 100) / 100)}
                      </p>
                    </div>
                  </div>
                  {result.addressableSectors > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-[#516174]">Addressable Sectors</p>
                        <p className="text-lg font-semibold text-[#15253D] tabular-nums">
                          {formatNum(result.addressableSectors)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#516174]">Addressing Bits</p>
                        <p className="text-lg font-semibold text-[#0B7A75] tabular-nums">
                          {result.addressingBits}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Timing results */}
              {hasTiming && (
                <div className="bg-[#E7F6F2] border border-[#D9E2EF] rounded-lg p-4 space-y-3">
                  <h3 className="text-sm font-semibold text-[#15253D]">Timing &amp; Access</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-[#516174]">Time per Revolution</p>
                      <p className="text-lg font-semibold text-[#15253D] tabular-nums">
                        {formatNum(Math.round(result.timePerRevMs * 1000) / 1000)} ms
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#516174]">Avg Rotational Latency</p>
                      <p className="text-lg font-semibold text-[#15253D] tabular-nums">
                        {formatNum(Math.round(result.avgRotLatMs * 1000) / 1000)} ms
                      </p>
                    </div>
                    {result.transferTimeMs > 0 && (
                      <div>
                        <p className="text-xs text-[#516174]">Transfer Time</p>
                        <p className="text-lg font-semibold text-[#15253D] tabular-nums">
                          {formatNum(Math.round(result.transferTimeMs * 1000) / 1000)} ms
                        </p>
                      </div>
                    )}
                    {result.totalAccessTimeMs > 0 && (
                      <div>
                        <p className="text-xs text-[#516174]">Total Access Time</p>
                        <p className="text-lg font-semibold text-[#0B7A75] tabular-nums">
                          {formatNum(Math.round(result.totalAccessTimeMs * 100) / 100)} ms
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Unit conversion warnings */}
              {hasCapacity && (
                <div className="flex items-start gap-2 text-xs text-[#A85D00]">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <p>
                    Remember: 1 KB = 2¹⁰ bytes, 1 MB = 2²⁰ bytes, 1 GB = 2³⁰ bytes.
                    Do not use decimal (10³) prefixes for disk capacity.
                  </p>
                </div>
              )}

              {/* Show Steps */}
              {showSteps && result.steps.length > 0 && (
                <div className="bg-[#F0F2F5] border border-[#D9E2EF] rounded-lg p-4 space-y-1">
                  <h3 className="text-sm font-semibold text-[#15253D] mb-2">Calculation Steps</h3>
                  {result.steps.map((step, idx) =>
                    step === '' ? (
                      <div key={idx} className="h-2" />
                    ) : (
                      <p
                        key={idx}
                        className="text-sm font-mono text-[#15253D] tabular-nums pl-2"
                      >
                        {step}
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

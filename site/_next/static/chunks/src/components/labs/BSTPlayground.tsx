'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GitBranchPlus, RotateCcw, Trash2 } from 'lucide-react';

// --- Types ---

interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

interface TreeNodeLayout {
  value: number;
  x: number;
  y: number;
  depth: number;
  isLeaf: boolean;
  highlighted: boolean;
  // SVG connection info
  parentX?: number;
  parentY?: number;
}

// --- Pre-loaded examples ---

const EXAMPLES = [
  {
    label: 'Balanced (P8-style)',
    sequence: [40, 20, 60, 10, 30, 50, 70, 25, 35],
  },
  {
    label: 'Skewed',
    sequence: [10, 20, 30, 40, 50, 60, 70],
  },
  {
    label: 'Mixed shape',
    sequence: [50, 30, 70, 20, 40, 60, 80, 10],
  },
];

// --- BST Operations ---

function insertNode(root: BSTNode | null, value: number): BSTNode {
  if (root === null) return { value, left: null, right: null };
  if (value < root.value) {
    return { ...root, left: insertNode(root.left, value) };
  } else if (value > root.value) {
    return { ...root, right: insertNode(root.right, value) };
  }
  // Duplicate — ignore
  return root;
}

function getInsertionPath(root: BSTNode | null, value: number): number[] {
  const path: number[] = [];
  let current = root;
  while (current !== null) {
    path.push(current.value);
    if (value < current.value) current = current.left;
    else if (value > current.value) current = current.right;
    else break; // duplicate
  }
  return path;
}

function countNodes(root: BSTNode | null): number {
  if (root === null) return 0;
  return 1 + countNodes(root.left) + countNodes(root.right);
}

function getHeightEdges(root: BSTNode | null): number {
  if (root === null) return -1;
  return 1 + Math.max(getHeightEdges(root.left), getHeightEdges(root.right));
}

function getHeightLevels(root: BSTNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(getHeightLevels(root.left), getHeightLevels(root.right));
}

function getLeafNodes(root: BSTNode | null): number[] {
  if (root === null) return [];
  if (root.left === null && root.right === null) return [root.value];
  return [...getLeafNodes(root.left), ...getLeafNodes(root.right)];
}

function getLeafSum(root: BSTNode | null): number {
  return getLeafNodes(root).reduce((a, b) => a + b, 0);
}

function collectNodes(root: BSTNode | null, depth: number): { node: BSTNode; depth: number }[] {
  if (root === null) return [];
  return [
    { node: root, depth },
    ...collectNodes(root.left, depth + 1),
    ...collectNodes(root.right, depth + 1),
  ];
}

// Layout the tree for SVG rendering
function layoutTree(root: BSTNode | null, highlighted: Set<number>): TreeNodeLayout[] {
  if (root === null) return [];

  const NODE_RADIUS = 22;
  const H_SPACING = 48;
  const V_SPACING = 64;
  const X_OFFSET = 40;

  const layouts: TreeNodeLayout[] = [];
  const allNodes = collectNodes(root, 0);

  // In-order traversal to assign x positions
  let xPos = 0;
  function inOrder(node: BSTNode | null, depth: number, parentPos?: { x: number; y: number }) {
    if (node === null) return;
    inOrder(node.left, depth + 1, { x: xPos * H_SPACING + X_OFFSET, y: depth * V_SPACING + 40 });

    const x = xPos * H_SPACING + X_OFFSET;
    const y = depth * V_SPACING + 40;
    const isLeaf = node.left === null && node.right === null;

    layouts.push({
      value: node.value,
      x,
      y,
      depth,
      isLeaf,
      highlighted: highlighted.has(node.value),
      parentX: parentPos?.x,
      parentY: parentPos?.y,
    });

    xPos++;
    inOrder(node.right, depth + 1, { x, y });
  }

  inOrder(root, 0);
  return layouts;
}

// --- Component ---

export function BSTPlayground() {
  const [root, setRoot] = useState<BSTNode | null>(null);
  const [insertInput, setInsertInput] = useState('');
  const [heightMode, setHeightMode] = useState<'edges' | 'levels'>('edges');
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set());
  const [lastInserted, setLastInserted] = useState<number | null>(null);
  const [selectedExample, setSelectedExample] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Tree stats
  const nodeCount = useMemo(() => countNodes(root), [root]);
  const heightEdges = useMemo(() => getHeightEdges(root), [root]);
  const heightLevels = useMemo(() => getHeightLevels(root), [root]);
  const leafNodes = useMemo(() => getLeafNodes(root), [root]);
  const leafSum = useMemo(() => getLeafSum(root), [root]);
  const height = heightMode === 'edges' ? heightEdges : heightLevels;

  // Min/max possible height
  const minHeight = useMemo(() => {
    if (nodeCount === 0) return 0;
    if (heightMode === 'edges') return Math.ceil(Math.log2(nodeCount + 1)) - 1;
    return Math.ceil(Math.log2(nodeCount + 1));
  }, [nodeCount, heightMode]);

  const maxHeight = useMemo(() => {
    if (nodeCount === 0) return 0;
    if (heightMode === 'edges') return nodeCount - 1;
    return nodeCount;
  }, [nodeCount, heightMode]);

  // Layout
  const layouts = useMemo(() => layoutTree(root, highlighted), [root, highlighted]);

  // SVG dimensions
  const svgWidth = useMemo(() => {
    if (layouts.length === 0) return 400;
    const maxX = Math.max(...layouts.map((l) => l.x));
    return Math.max(400, maxX + 60);
  }, [layouts]);

  const svgHeight = useMemo(() => {
    if (layouts.length === 0) return 200;
    const maxY = Math.max(...layouts.map((l) => l.y));
    return Math.max(200, maxY + 60);
  }, [layouts]);

  // Depth levels for labels
  const depthLevels = useMemo(() => {
    if (layouts.length === 0) return new Set<number>();
    return new Set(layouts.map((l) => l.depth));
  }, [layouts]);

  // Insert a value
  const handleInsert = useCallback(
    (val: number) => {
      if (isNaN(val)) return;
      // Compute path for highlighting
      const path = getInsertionPath(root, val);
      setHighlighted(new Set(path));
      setLastInserted(val);
      setRoot((prev) => insertNode(prev, val));
      // Clear highlight after animation
      setTimeout(() => setHighlighted(new Set([val])), 600);
      setTimeout(() => {
        setHighlighted(new Set());
        setLastInserted(null);
      }, 2000);
    },
    [root]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const val = parseInt(insertInput.trim(), 10);
        if (!isNaN(val)) {
          handleInsert(val);
          setInsertInput('');
        }
      }
    },
    [insertInput, handleInsert]
  );

  const handleInsertClick = useCallback(() => {
    const val = parseInt(insertInput.trim(), 10);
    if (!isNaN(val)) {
      handleInsert(val);
      setInsertInput('');
      inputRef.current?.focus();
    }
  }, [insertInput, handleInsert]);

  const clearTree = useCallback(() => {
    setRoot(null);
    setHighlighted(new Set());
    setLastInserted(null);
    setInsertInput('');
    setSelectedExample('');
  }, []);

  const loadExample = useCallback((idx: string) => {
    setSelectedExample(idx);
    clearTree();
    const ex = EXAMPLES.find((_, i) => String(i) === idx);
    if (!ex) return;
    let tree: BSTNode | null = null;
    for (const val of ex.sequence) {
      tree = insertNode(tree, val);
    }
    setRoot(tree);
    // Highlight all nodes briefly
    setHighlighted(new Set(ex.sequence));
    setTimeout(() => setHighlighted(new Set()), 1500);
  }, [clearTree]);

  return (
    <section aria-label="BST Playground" className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GitBranchPlus className="size-5 text-[#1D5FD1]" aria-hidden="true" />
            <CardTitle className="text-xl">BST Playground</CardTitle>
          </div>
          <CardDescription>
            Insert values one at a time to construct a BST. Observe height, leaves, and the insertion path.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Controls row */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[140px] space-y-1.5">
              <Label htmlFor="bst-insert">Insert Value</Label>
              <Input
                ref={inputRef}
                id="bst-insert"
                type="number"
                placeholder="Enter a number"
                value={insertInput}
                onChange={(e) => setInsertInput(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-describedby="bst-insert-hint"
              />
              <p id="bst-insert-hint" className="text-xs text-[#516174]">
                Press Enter to insert
              </p>
            </div>
            <Button onClick={handleInsertClick} disabled={insertInput.trim() === ''}>
              <GitBranchPlus className="size-3.5" aria-hidden="true" />
              Insert
            </Button>
            <div className="space-y-1.5">
              <Label htmlFor="bst-example">Load Example</Label>
              <Select value={selectedExample} onValueChange={loadExample}>
                <SelectTrigger id="bst-example" className="w-[180px]">
                  <SelectValue placeholder="Choose..." />
                </SelectTrigger>
                <SelectContent>
                  {EXAMPLES.map((ex, idx) => (
                    <SelectItem key={idx} value={String(idx)}>
                      {ex.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={clearTree}>
              <Trash2 className="size-3.5" aria-hidden="true" />
              Clear
            </Button>
          </div>

          {/* Height mode toggle */}
          <div className="flex items-center gap-3">
            <Switch
              id="height-mode"
              checked={heightMode === 'levels'}
              onCheckedChange={(checked) => setHeightMode(checked ? 'levels' : 'edges')}
              aria-label="Toggle height mode"
            />
            <Label htmlFor="height-mode" className="cursor-pointer text-sm">
              Height in levels (root at level 0 → height = levels)
              {heightMode === 'levels' ? (
                <Badge variant="secondary" className="ml-2 text-[10px]">
                  Levels
                </Badge>
              ) : (
                <Badge variant="secondary" className="ml-2 text-[10px]">
                  Edges
                </Badge>
              )}
            </Label>
          </div>

          {/* Tree SVG */}
          <div className="overflow-x-auto custom-scrollbar rounded-lg border border-[#D9E2EF] bg-white">
            <svg
              width={svgWidth}
              height={svgHeight}
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="min-w-full"
              role="img"
              aria-label={`BST with ${nodeCount} nodes and height ${height}`}
            >
              {/* Level labels */}
              {Array.from(depthLevels).map((depth) => {
                const y = depth * 64 + 40;
                return (
                  <text
                    key={`level-${depth}`}
                    x={8}
                    y={y + 5}
                    className="fill-[#516174] text-[10px] font-medium"
                    textAnchor="start"
                  >
                    L{depth}
                  </text>
                );
              })}

              {/* Edges */}
              {layouts.map((node) =>
                node.parentX !== undefined && node.parentY !== undefined ? (
                  <line
                    key={`edge-${node.value}`}
                    x1={node.parentX}
                    y1={node.parentY}
                    x2={node.x}
                    y2={node.y}
                    stroke={node.highlighted ? '#1D5FD1' : '#D9E2EF'}
                    strokeWidth={node.highlighted ? 2 : 1.5}
                  />
                ) : null
              )}

              {/* Nodes */}
              {layouts.map((node) => {
                const isLastInserted = node.value === lastInserted;
                return (
                  <g key={`node-${node.value}`}>
                    {/* Node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={22}
                      fill={
                        isLastInserted
                          ? '#EAF2FF'
                          : node.highlighted
                          ? '#E7F6F2'
                          : node.isLeaf
                          ? '#FFF4DF'
                          : '#FFFFFF'
                      }
                      stroke={
                        isLastInserted
                          ? '#1D5FD1'
                          : node.highlighted
                          ? '#0B7A75'
                          : node.isLeaf
                          ? '#A85D00'
                          : '#D9E2EF'
                      }
                      strokeWidth={isLastInserted ? 2.5 : 1.5}
                    />
                    {/* Value text */}
                    <text
                      x={node.x}
                      y={node.y + 5}
                      textAnchor="middle"
                      className={`text-sm font-semibold tabular-nums fill-[#15253D] ${
                        isLastInserted ? 'text-[#1D5FD1]' : ''
                      }`}
                    >
                      {node.value}
                    </text>
                    {/* Leaf indicator */}
                    {node.isLeaf && !isLastInserted && (
                      <text
                        x={node.x}
                        y={node.y + 34}
                        textAnchor="middle"
                        className="text-[8px] fill-[#A85D00]"
                      >
                        leaf
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Empty state */}
              {layouts.length === 0 && (
                <text
                  x={svgWidth / 2}
                  y={svgHeight / 2}
                  textAnchor="middle"
                  className="fill-[#516174] text-sm"
                >
                  Insert a value to start building the BST
                </text>
              )}
            </svg>
          </div>

          {/* Stats cards */}
          {nodeCount > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#EAF2FF] border border-[#D9E2EF] rounded-lg p-3 text-center">
                <p className="text-xs text-[#516174]">Current Height</p>
                <p className="text-xl font-semibold text-[#15253D] tabular-nums">{height}</p>
                <p className="text-[10px] text-[#516174]">
                  ({heightMode === 'edges' ? 'edges' : 'levels'})
                </p>
              </div>
              <div className="bg-[#E7F6F2] border border-[#D9E2EF] rounded-lg p-3 text-center">
                <p className="text-xs text-[#516174]">Total Nodes</p>
                <p className="text-xl font-semibold text-[#15253D] tabular-nums">{nodeCount}</p>
              </div>
              <div className="bg-[#FFF4DF] border border-[#D9E2EF] rounded-lg p-3 text-center">
                <p className="text-xs text-[#516174]">Leaf Nodes</p>
                <p className="text-xl font-semibold text-[#15253D] tabular-nums">
                  {leafNodes.length}
                </p>
                <p className="text-[10px] text-[#516174]">
                  sum = {leafSum}
                </p>
              </div>
              <div className="bg-[#F0F2F5] border border-[#D9E2EF] rounded-lg p-3 text-center">
                <p className="text-xs text-[#516174]">
                  Height Range (n={nodeCount})
                </p>
                <p className="text-sm font-semibold text-[#15253D] tabular-nums">
                  min {minHeight} — max {maxHeight}
                </p>
                <p className="text-[10px] text-[#516174]">
                  ⌈log₂(n+1){heightMode === 'edges' ? '−1' : ''}⌉ — {heightMode === 'edges' ? 'n−1' : 'n'}
                </p>
              </div>
            </div>
          )}

          {/* Leaf nodes detail */}
          {nodeCount > 0 && leafNodes.length > 0 && (
            <div className="bg-[#FFF4DF] border border-[#D9E2EF] rounded-lg p-3">
              <p className="text-xs text-[#516174] mb-1">Leaf nodes</p>
              <div className="flex flex-wrap gap-1.5">
                {leafNodes.map((v) => (
                  <Badge key={v} variant="outline" className="border-[#A85D00] text-[#A85D00] tabular-nums">
                    {v}
                  </Badge>
                ))}
                <span className="text-xs text-[#516174] self-center ml-2 tabular-nums">
                  Sum = {leafSum}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

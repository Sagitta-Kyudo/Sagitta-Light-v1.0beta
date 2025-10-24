import type { Change } from 'diff';

export type Layout = 'side-by-side' | 'top-and-bottom';

export type DiffResult = Change[];

export type PanelType = 'input' | 'output';

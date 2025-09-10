import type { Dataset } from './lib/data';

export interface Category {
  name: string;
  colour: string;
}

export interface Problem {
  name: string;
  category: Category;
  subcategory: string | null;
  added: Date;
  variants: ProblemVariant[];
}

export interface ProblemVariant {
  dataset: Dataset | undefined;
  dimension: Dimension;
  solution: Solution;
}

interface Dimension {
  x: number;
  y: number;
  F: number;
  G: number;
  H: number;
  f: number;
  g: number;
  h: number;
}

interface Solution {
  optimality: string;
  x?: number[] | undefined;
  y?: number[] | undefined;
  F?: number | undefined;
  G?: number[] | undefined;
  H?: number[] | undefined;
  f?: number | undefined;
  g?: number[] | undefined;
  h?: number[] | undefined;
  training_r2?: number | undefined;
  training_rmse?: number | undefined;
  training_accuracy?: number | undefined;
  validation_r2?: number | undefined;
  validation_rmse?: number | undefined;
  validation_accuracy?: number | undefined;
  note: string;
}

export interface Category {
  name: string;
  colour: string;
}

export interface Dataset {
  name: string;
  size: number; // Size in bytes
}

export interface Problem {
  name: string;
  category: Category;
  subcategory: string | null;
  added: Date;
  dimension: Dimension;
  datasets: Dataset[];
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
  x: number[];
  y: number[];
  F: number;
  G?: number[] | undefined;
  H?: number[] | undefined;
  f: number;
  g?: number[] | undefined;
  h?: number[] | undefined;
}

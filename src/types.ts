export interface Citation {
  authors: string;
  year: number;
  link: string;
}

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
  description: string;
  category: Category; // TODO: Should this be an array or nested object?
  citation?: Citation;
  dimension: Dimension;
  datasets: Dataset[] | undefined;
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
  G: number[];
  H: number[];
  f: number;
  g: number[];
  h: number[];
}

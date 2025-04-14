export interface Citation {
  authors: string;
  year: number;
  link: string;
}

// Either a specific value or a range of values
export type ValueOrRange = number | `${number}-${number}`;

export interface Category {
  name: string;
  colour: string;
}

export interface Problem {
  name: string;
  category: Category; // TODO: Should this be an array or nested object?
  citation?: Citation;
  upperLevelVariables: ValueOrRange;
  lowerLevelVariables: ValueOrRange;
  upperLevelConstraints: ValueOrRange;
  lowerLevelConstraints: ValueOrRange;
  addedAt: Date;
  // dataset: never; // TODO: What should this be?
}

export interface Citation {
  title: string;
  href: string;
}

// Either a specific value or a range of values
export type ValueOrRange = number | `${number}-${number}`;

export interface Problem {
  name: string;
  category: ProblemCategory;
  citation: Citation;
  upperLevelVariables: ValueOrRange;
  lowerLevelVariables: ValueOrRange;
  upperLevelConstraints: ValueOrRange;
  lowerLevelConstraints: ValueOrRange;
  // dataset: never; // TODO: What should this be?
}

export interface ProblemCategory {
  parentCategory?: ProblemCategory;
  name: string;
}

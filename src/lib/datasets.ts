export interface Dataset {
  name: string;
  size: number; // Size in bytes
}

export const datasets: Dataset[] = [
  {
    name: 'alpha',
    size: 4524524,
  },
  {
    name: 'beta',
    size: 2524524,
  },
  {
    name: 'gamma',
    size: 3524524,
  },
  {
    name: 'delta',
    size: 8524524,
  },
  {
    name: 'epsilon',
    size: 4524524,
  },
  {
    name: 'zeta',
    size: 4524524,
  },
  {
    name: 'eta',
    size: 4524524,
  },
  {
    name: 'theta',
    size: 4524524,
  },
  {
    name: 'iota',
    size: 4524524,
  },
  {
    name: 'kappa',
    size: 4524524,
  },
  {
    name: 'lambda',
    size: 4524524,
  },
  {
    name: 'mu',
    size: 4524524,
  },
  {
    name: 'nu',
    size: 4524524,
  },
  {
    name: 'xi',
    size: 4524524,
  },
] as const;

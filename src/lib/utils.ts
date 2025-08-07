import type { Updater } from '@tanstack/vue-table'
import type { ClassValue } from 'clsx'

import type { Ref } from 'vue'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function'
    ? updaterOrValue(ref.value)
    : updaterOrValue
}

export function snakeCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

export function slugify(str: string) {
  return str
    .replace(/[\s-]+/g, '-')
    .toLowerCase();
}

export function distinct<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${size} ${sizes[i]}`;
}

export function intersect<T>(arr1: T[], arr2: T[], ...rest: T[][]): T[] {
  const intersection = arr1.filter((item) => arr2.includes(item));

  const [nextArr, ...otherArr] = rest;

  if (!nextArr || nextArr.length === 0) {
    return intersection;
  }

  return intersect(intersection, nextArr, ...otherArr);
}

export function union<T>(arr1: T[], arr2: T[], ...rest: T[][]): T[] {
  const unionSet = new Set(arr1);

  arr2.forEach((item) => unionSet.add(item));

  rest.forEach((arr) => {
    arr.forEach((item) => unionSet.add(item));
  });

  return Array.from(unionSet);
}

export function stringifyInlineArrays(
  value: Record<any, any>, // TODO: retype
  indent: number = 2
): string {
  // Separate array values and non-array values
  const arrays: Record<string, (number | string)[]> = {};
  const trimmed: Record<string, string | number | undefined | null> = {};

  for (const key in value) {
    const val = value[key];
    if (Array.isArray(val)) {
      arrays[key] = val;
      trimmed[key] = null; // placeholder
    } else {
      trimmed[key] = val;
    }
  }

  // Stringify the trimmed object
  let json = JSON.stringify(trimmed, null, indent);

  // Re-insert array values as inline arrays
  for (const key in arrays) {
    const arrayStr = JSON.stringify(arrays[key]);
    // Replace the placeholder null with the array string
    // Handles both indented and non-indented cases
    const pattern = new RegExp(`("${key}"\\s*:\\s*)null`, 'g');
    json = json.replace(pattern, `$1${arrayStr}`);
  }

  return json;
}

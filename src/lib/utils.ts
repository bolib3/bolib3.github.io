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

export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

export function stringifyInlineArrays(value: any, indent: number = 2): string {
  const seen = new WeakSet();

  const json = JSON.stringify(value, function (key, val) {
    if (typeof val === 'object' && val !== null) {
      if (seen.has(val)) return '[Circular]';
      seen.add(val);
    }
    return val;
  }, indent);

  return json.replace(
    /\[\s*((?:-?\d+(?:\.\d+)?(?:,\s*)?)+)\s*\]/g,
    (_, numbers) => `[${numbers.replace(/\s+/g, ' ')}]`
  );
}

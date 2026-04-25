import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string, locale = 'ar-DZ') {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function getInitials(name: string) {
  return name?.charAt(0) || '؟';
}

export const LEVEL_COLOR: Record<string, string> = {
  '1AM': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  '2AM': 'bg-blue-500/10    text-blue-400    border-blue-500/30',
  '3AM': 'bg-amber-500/10   text-amber-400   border-amber-500/30',
  '4AM': 'bg-rose-500/10    text-rose-400    border-rose-500/30',
};
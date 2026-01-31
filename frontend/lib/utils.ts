import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = Math.abs(hash) % 360;

  return {
    bg: `hsl(${h}, 70%, 90%)`,
    text: `hsl(${h}, 70%, 25%)`,
    border: `hsl(${h}, 70%, 80%)`,
  };
}
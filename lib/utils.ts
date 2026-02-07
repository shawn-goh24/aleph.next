import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomId(): number {
  return Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
}

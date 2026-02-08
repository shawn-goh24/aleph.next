import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function randomId(): number {
  return Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
}

export function generateRandomHexColor() {
  // Generate a random number between 0 and 0xFFFFFF (16777215)
  const randomColorNumber = Math.floor(Math.random() * 16777215);

  // Convert the number to a hexadecimal string (base 16)
  let hexColor = randomColorNumber.toString(16);

  // Pad the string with leading zeros if it's less than 6 characters
  while (hexColor.length < 6) {
    hexColor = "0" + hexColor;
  }

  // Prepend the hash symbol to form a valid CSS hex code
  return "#" + hexColor;
}

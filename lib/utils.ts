import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import seedrandom from 'seedrandom';


/**
 * Utility function to combine CSS classes with Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates a seeded random number generator
 */
export function createRNG(seed: string | number) {
  return seedrandom(String(seed));
}

/**
 * Generates a random integer between min and max (inclusive) using the provided RNG
 */
export function getRandomInt(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Selects a random item from an array using the provided RNG
 */
export function getRandomItem<T>(rng: () => number, array: T[]): T {
  return array[Math.floor(rng() * array.length)];
}


/**
 * Similar to generateWithFraction but returns an integer count
 * For example: 4.7 will return 4 with 30% probability and 5 with 70% probability
 */
export function getRandomIntFromFraction(rng: () => number, average: number): number {
  const wholeNumber = Math.floor(average);
  const fraction = average % 1;
  
  // Add one more with probability equal to the fraction
  return wholeNumber + (rng() < fraction ? 1 : 0);
}


import { keywords } from "../../constants/aliases";
import { levenshtein } from "./levenshtein";

export function findKeywords(word: string): string | null {
  const input = word.toUpperCase();
  let match: string | null = null;
  let tolerance = 99; // Mulai dengan angka tinggi

  for (const key in keywords) {
    const distance = levenshtein(input, key);
    let limit = 0; // Default: harus sama persis untuk kata sangat pendek
    
    if (key.length > 8) limit = 2;      // Kata panjang (misal: "berdasarkan") boleh typo 2
    else if (key.length >= 5) limit = 1; // Kata sedang (misal: "tampilkan") hanya boleh typo 1

    if (distance <= limit && distance < tolerance) {
      tolerance = distance;
      match = keywords[key];
    }
  }
  return match;
}
import { keywords } from "../../constants/aliases";
import { levenshtein } from "./levenshtein";

export function findKeywords(word: string): string | null {

  const input = word.toUpperCase()
  let match: string | null = null
  
  let tolerance = 2 + 1

  for (const key in keywords) {
    const distance = levenshtein(input, key)
    let limit = 1
    if (key.length > 7) limit = 3;
    else if (key.length > 4) limit = 2;

    if (distance <= limit && distance < tolerance) {
      tolerance = distance
      match = keywords[key]
    }

    if (tolerance === 0) break
  }
  
  return match

}
import { keywords, symbols } from "../constants/aliases"
import { findKeywords } from "./utils/similarity"
  
  
function getTokenType(word: string) {
  // 1. Cek Simbol Langsung
  if (symbols[word]) return symbols[word]

  let state = 0
  let input = word.toUpperCase();

  // 2. Handle Suffix Bahasa Indonesia "-nya"
  if (input.endsWith("NYA") && input.length > 3) {
    input = input.slice(0, -3);
  }

  // 3. DFA untuk Identifier/Keyword atau Number
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    switch (state) {
      case 0:
        if (/[A-Z]/.test(char)) state = 100; 
        else if (/[0-9]/.test(char)) state = 200; 
        else state = -1; 
        break;
      case 100:
        if (/[A-Z0-9_]/.test(char)) state = 100; 
        else state = -1; 
        break;
      case 200:
        if (/[0-9]/.test(char)) state = 200; 
        else state = -1; 
        break;
    }
    if (state === -1) break;
  }

  if (state === 100) {
    // Cek apakah ini Keyword (SELECT, FROM, dsb)
    if (keywords[input]) return keywords[input];

    // Fuzzy Search untuk typo (Hanya jika panjang > 4)
    if (input.length > 4) {
      const closest = findKeywords(input);
      if (closest) return closest;
    }
    return "TKN_IDENTIFIER";
  }

  if (state === 200) return "TKN_NUMBER";
  
  return "TKN_UNKNOWN";
}

export function tokenize(sentence: string) {
  const words = sentence
    .split(/(\s+|(?<=>|<=|>=|!=|<>)|(?<!>|<|!|=)(?=[,.()=><*])|(?<=[,.()=><*])(?![=]))/)
    .filter(w => w && w.trim() !== "")

  const tokens = words.map(word => {
    let cleanValue = word;
    if (word.toUpperCase().endsWith("NYA") && word.length > 3) {
      cleanValue = word.slice(0, -3);
    }

    return {
      value: cleanValue,
      type: getTokenType(word)
    }
  })

  return tokens;
}
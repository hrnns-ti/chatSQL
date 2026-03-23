import { keywords, symbols } from "../constants/aliases"
import { findKeywords } from "./utils/similarity"
  
  
function getTokenType(word: string) {

  if (symbols[word]) return symbols[word]

  let state = 0
  const input = word.toUpperCase()


  for (let i = 0; i < word.length; i++) {
    const char = input[i]

    switch (state) {
      case 0: // Entry point
        if (/[A-Z]/.test(char)) state = 100; else if (/[0-9]/.test(char)) state = 200; else state = -1; break;
      case 100: // Identifier keyword
        if (/[A-Z0-9_]/.test(char)) state = 100; else state = -1; break;
      case 200: // numerik
        if (/[0-9]/.test(char)) state = 200; else state = -1; break;
    }
    if (state === -1) break;
  }

  if (state === 100) {
      const keywordToken = keywords[input]
      if (keywordToken) return keywordToken

      if (input.length > 4) {
        const closest = findKeywords(input)
        if (closest) {
          console.log(`  [LOG] Menemukan kemiripan: "${word}" -> ${closest}`); 
          return closest
        }
      }
      return "TKN_IDENTIFIER"
    }

  if (state === 200) return "TKN_NUMBER"

  if (word === ".") return "TKN_DOT";
  if (symbols[word]) return symbols[word];

  return "TKN_UNKNOWN"

}

export function tokenize(sentence: string) {

  const words = sentence
    .split(/(\s+|(?<=>|<=|>=|!=|<>)|(?<!>|<|!|=)(?=[,.()=><*])|(?<=[,.()=><*])(?![=]))/)
    .filter(w => w && w.trim() !== "")

  const tokens = words.map(word => {
    return {
      value: word, type: getTokenType(word)
    }
  })

  return tokens

}
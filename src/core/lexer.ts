import { keywords, symbols } from "../constants/aliases.js";

export function tokenize(sentence: string) {

  const words = sentence.match(/'[^']*'|,|[^ \s,]+/g) || [];
  
  const tokens = words.map(word => {
    const cleanWord = word.startsWith("'") && word.endsWith("'") 
      ? word.slice(1, -1) 
      : word;

    const inputUpper = cleanWord.toUpperCase();

    if (symbols[inputUpper]) return { value: cleanWord, type: symbols[inputUpper] };
    if (keywords[inputUpper]) return { value: cleanWord, type: keywords[inputUpper] };
    if (!isNaN(Number(cleanWord))) return { value: cleanWord, type: "TKN_NUMBER" };
    
    return { value: cleanWord, type: "TKN_IDENTIFIER" };
  });

  return tokens;
}
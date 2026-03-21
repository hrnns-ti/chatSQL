export function levenshtein(a: string, b: string) {
  
  const n = a.length
  const m = b.length
  const matrix: number [][] = []

  // console.log(`--- Menghitung Jarak: "${a}" ke "${b}" ---`);

  if (n === 0) return m
  if (m === 0) return n

  for (let i = 0; i <= n; i++) matrix[i] = [i];
  for (let j = 0; j <= m; j++) matrix[0][j] = j;

  // console.table(matrix);

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = a[i-1] === b[j-1] ? 0 : 1

      const deletion = matrix[i-1][j] + 1
      const insertion = matrix[i][j-1] + 1
      const substitution = matrix[i-1][j-1] + cost

      matrix[i][j] = Math.min( deletion, insertion, substitution )
    }
    // console.log(`Proses Baris ke-${i} (Huruf '${a[i-1]}'):`);
    // console.table(matrix);
  }

  const result = matrix[n][m]
  // console.log(`Hasil Akhir: ${result} langkah.`);

  return result

}

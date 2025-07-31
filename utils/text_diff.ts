function getLevenshteinDistance(a: string, b: string): number {
    const tmp: number[][] = [];
    let i, j;
    
    for (i = 0; i <= a.length; i++) {
      tmp[i] = [i];
    }
    for (j = 0; j <= b.length; j++) {
      tmp[0][j] = j;
    }
    
    for (i = 1; i <= a.length; i++) {
      for (j = 1; j <= b.length; j++) {
        tmp[i][j] = Math.min(
          tmp[i - 1][j] + 1, // Deletion
          tmp[i][j - 1] + 1, // Insertion
          tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1) // Substitution
        );
      }
    }
  
    return tmp[a.length][b.length];
  }
  
  function getLevenshteinSimilarity(a: string, b: string): number {
    const distance = getLevenshteinDistance(a, b);
    const maxLength = Math.max(a.length, b.length);
    
    // Calculate percent similarity
    const similarity = (1 - distance / maxLength) * 100;
    return similarity;
  }

  export {getLevenshteinSimilarity}
  
  
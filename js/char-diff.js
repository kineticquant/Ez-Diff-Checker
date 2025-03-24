// Function to highlight character-level differences between two lines, returning separate results for each side
function highlightCharDiff(line1, line2) {
    if (line1 === line2) {
      return { left: line1, right: line2 }; // No differences, return unchanged
    }
  
    const leftResult = [];
    const rightResult = [];
    const maxLength = Math.max(line1.length, line2.length);
  
    for (let i = 0; i < maxLength; i++) {
      const char1 = line1[i] || '';
      const char2 = line2[i] || '';
  
      if (char1 !== char2) {
        // Highlight differing characters with side-specific classes
        if (char1) leftResult.push(`<span class="char-diff-left">${char1}</span>`);
        if (char2) rightResult.push(`<span class="char-diff-right">${char2}</span>`);
      } else {
        // Same characters, no highlight
        leftResult.push(char1);
        rightResult.push(char2);
      }
    }
  
    return {
      left: leftResult.join(''),
      right: rightResult.join('')
    };
  }
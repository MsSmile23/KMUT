export const formatPlural = (num: number, words: [string, string, string]): string => {
    let absNumber = Math.abs(num);
      
    absNumber %= 100;

    if (num >= 5 && num <= 20) {
        return words[2] // five
    }
  
    absNumber %= 10;
    
    if (absNumber === 1) {
        return words[0] // one;
    }
  
    if (absNumber >= 2 && absNumber <= 4) {
        return words[1] // two;
    }
  
    return words[2];
}
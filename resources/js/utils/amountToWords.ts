export function amountToWords(amount: number): string {
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen',
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
    function numToWords(num: number): string {
      if (num < 20) return a[num];
      if (num < 100) return `${b[Math.floor(num / 10)]} ${a[num % 10]}`;
      if (num < 1000) return `${a[Math.floor(num / 100)]} Hundred ${numToWords(num % 100)}`;
      if (num < 100000) return `${numToWords(Math.floor(num / 1000))} Thousand ${numToWords(num % 1000)}`;
      if (num < 10000000) return `${numToWords(Math.floor(num / 100000))} Lakh ${numToWords(num % 100000)}`;
      return `${numToWords(Math.floor(num / 10000000))} Crore ${numToWords(num % 10000000)}`;
    }
  
    return `${numToWords(Math.floor(amount)).trim()} Only`;
  }
  
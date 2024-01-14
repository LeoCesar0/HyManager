export function parseBrazilianDate(text: string) {
    // EXAMPLE: 30 JUN 2023
    const brazilianMonths = {
      JAN: 0,
      FEV: 1,
      MAR: 2,
      ABR: 3,
      MAI: 4,
      JUN: 5,
      JUL: 6,
      AGO: 7,
      SET: 8,
      OUT: 9,
      NOV: 10,
      DEZ: 11,
    };
  
    const parts = text.split(" ");
    if (parts.length !== 3) return false;
  
    const day = parseInt(parts[0]);
    const stringMonth = parts[1].toUpperCase() as keyof typeof brazilianMonths;
    // Check that the month is valid (to avoid overflow problems, like "99 FEV" becoming "10 MAR")
    if (!(stringMonth in brazilianMonths)) {
      return false;
    }
    const month = brazilianMonths[stringMonth];
    const year = parseInt(parts[2]);
  
    if (!day || month === undefined || !year) return false;
  
    const date = new Date(year, month, day);
  
    // Check that the date is valid and matches the input (to avoid overflow problems, like "99 FEV 2023" becoming "10 MAR 2023")
    if (
      date &&
      date.getDate() === day &&
      date.getMonth() === month &&
      date.getFullYear() === year
    ) {
      return date;
    } else {
      return false;
    }
  }
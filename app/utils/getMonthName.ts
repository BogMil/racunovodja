export default function getMonthName(month: number) {
  switch (month) {
    case 1:
      return 'januar';
    case 2:
      return 'februar';
    case 3:
      return 'mart';
    case 4:
      return 'april';
    case 5:
      return 'maj';
    case 6:
      return 'jun';
    case 7:
      return 'jul';
    case 8:
      return 'avgust';
    case 9:
      return 'septembar';
    case 10:
      return 'oktobar';
    case 11:
      return 'novembar';
    case 12:
      return 'decembar';
  }
}

export function getMonthNameCyr(month: number) {
  switch (month) {
    case 1:
      return 'јануар';
    case 2:
      return 'фебруар';
    case 3:
      return 'март';
    case 4:
      return 'април';
    case 5:
      return 'мај';
    case 6:
      return 'јун';
    case 7:
      return 'јул';
    case 8:
      return 'август';
    case 9:
      return 'септембар';
    case 10:
      return 'октобар';
    case 11:
      return 'новембар';
    case 12:
      return 'децембар';
  }
}

import { getBusinesDaysInMonth } from '../../../../../../utils/getBusinessDaysInMonth';

export const calculateNonTaxedValue = (
  days: number,
  maxNeoporezivDeo: number,
  year: number,
  month: number,
  sum: number
) => {
  let numberOfWeekDays = getBusinesDaysInMonth(month, year);
  let nonTaxedValueSum = days * (maxNeoporezivDeo / numberOfWeekDays);

  let neoporezivo =
    nonTaxedValueSum > maxNeoporezivDeo ? maxNeoporezivDeo : nonTaxedValueSum;

  neoporezivo = neoporezivo > sum ? sum : neoporezivo;
  return neoporezivo;
};

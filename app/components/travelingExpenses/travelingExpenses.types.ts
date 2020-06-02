export type TravelingExpense = {
  id: number;
  year: number;
  month: number;
  creation_date: string;
  user_id: number;
};

export type TravelingExpenseCDTO = {
  id: number;
  year: number;
  month: number;
  creation_date: string;
  user_id: number;
};

export const newTravelingExpenseCDTO = () => {
  let now = new Date(Date.now());

  let month = now.getMonth() + 1;
  let year = now.getFullYear();
  return {
    id: 0,
    year: year,
    month: month,
    creation_date: ''
  } as TravelingExpenseCDTO;
};

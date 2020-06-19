export type Lokacija = {
  id: number;
  naziv: string;
  user_id: number;
};

export const newLokacijaCDTO = () => {
  return {
    naziv: '',
    id: -1,
    user_id: -1
  } as Lokacija;
};

export type Relation = {
  id: number;
  name: string;
  price: number;
  user_id: number;
};

export type RelationCDTO = {
  id: number;
  name: string;
  price: number;
};

export const newRelationCDTO = () => {
  return {
    name: '',
    price: 0
  } as RelationCDTO;
};

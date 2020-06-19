import React from 'react';
import DeleteRowButton from '../../../../common/rowButtons/deleteRowButton';
import { Relation, RelationCDTO } from '../../relations.types';
import EditRowButton from '../../../../common/rowButtons/editRowButton';
import { handleResponse } from '../../../../../utils/responseHandler';
import { reloadRelations } from '../../relations.actions';
import { useDispatch } from 'react-redux';
import * as service from '../../relations.service';
import { openEdit } from '../relationModal/relationModal.actions';
import { areYouSure } from '../../../../../utils/yesNoModal';
type Props = {
  relation: Relation;
};
export default function RelationComponent(props: Props) {
  const relation = props.relation;
  const dispatch = useDispatch();

  const remove = () => {
    areYouSure({
      title: 'Brisanje relacije',
      onYes: async () => {
        handleResponse(await service.remove(relation.id), () => {
          dispatch(reloadRelations());
        });
      }
    });
  };

  const edit = () => {
    let cdto = (relation as unknown) as RelationCDTO;
    dispatch(openEdit(cdto));
  };

  return (
    <tr>
      <td>{`${relation.lokacija?.naziv} - ${relation.name}`}</td>
      <td>{relation.price}</td>
      <td style={{ textAlign: 'center' }}>
        <EditRowButton
          onClick={edit}
          title="Ažuriranje relacije"
          style={{ marginRight: 5 }}
        />

        <DeleteRowButton onClick={remove} title="Brisanje relacije" />
      </td>
    </tr>
  );
}

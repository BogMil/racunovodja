import React, { useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { AppStore } from '../../../reducers';
import { loadRelations } from './relations.actions';
import { Relation } from './relations.types';
import { openCreate } from './components/relationModal/relationModal.actions';
import RelationModal from './components/relationModal/relationModal';
import RelationComponent from './components/relation/relation';

export default function Relations() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.relationsCombined.relations;
  });

  useEffect(() => {
    dispatch(loadRelations());
  }, []);

  const openCreateDialog = () => {
    dispatch(openCreate());
  };
  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Naziv</th>
            <th>Cena</th>
            <th style={{ textAlign: 'center', width: 70 }}>
              <Button
                onClick={openCreateDialog}
                title="Kreiraj novu relaciju"
                variant="success"
                style={{
                  paddingLeft: 5,
                  paddingRight: 5,
                  paddingTop: 0,
                  paddingBottom: 0,
                  marginRight: 5
                }}
              >
                <i className="fa fa-plus" />
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {store.relations.map((relation: Relation) => (
            <RelationComponent key={relation.id} relation={relation} />
          ))}
        </tbody>
      </Table>
      <RelationModal />
    </>
  );
}

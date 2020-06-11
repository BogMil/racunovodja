import React, { useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { AppStore } from '../../reducers';
import { loadOtherSettings } from './otherSettings.actions';

export default function OtherSettings() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppStore) => {
    return state.otherSettings;
  });

  useEffect(() => {
    dispatch(loadOtherSettings());
  }, []);

  return (
    <>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Naziv</th>
            <th>vrednost</th>
            <th style={{ textAlign: 'center', width: 70 }}></th>
          </tr>
        </thead>
        <tbody>
          {store.otherSettings.map((setting: OtherSetting) => (
            <tr key={setting.id}>
              <td>{setting.label}</td>
              <td>{setting.value}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

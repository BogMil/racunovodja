import { Action } from '../../../../reducers/types';
import { Employee } from '../../types';
import * as service from '../../employee.service';
import { Dispatch } from 'redux';
import { handleResponse } from '../../../../utils/responseHandler';
import { DPL_DB_FILE } from '../../../../constants/files';
import {
  EmployeeFromDPL,
  EmployeeToSyncEmail
} from './DPLEmailSyncModal.types';
import { promisify } from 'util';
const { dialog } = require('electron').remote;
const sqlite3 = require('sqlite3').verbose();

export const OPEN = 'OPEN';
export const CLOSE = 'CLOSE';
export const HANDLE_CHANGE = 'HANDLE_CHANGE';

export const NAMESPACE = 'DPL_EMAIL_SYNC_MODAL';
const SQL = `SELECT JMBG,EmployeeNumber,Email
FROM Employee
WHERE Email != ""`;
export function open() {
  return async (dispatch: Dispatch) => {
    handleResponse(await service.get(), async (res: any) => {
      try {
        let db = await new sqlite3.Database(
          DPL_DB_FILE(),
          sqlite3.OPEN_READONLY,
          (err: any) => {
            if (err) throw err;
          }
        );
        let employeesFromDPL: EmployeeFromDPL[] = [];

        let awaitForEachRow = promisify(db.each).bind(db);

        await awaitForEachRow(SQL, (err: any, row: EmployeeFromDPL) => {
          if (err) console.log(err);

          employeesFromDPL.push(row);
        });

        let dbEmployees: Employee[] = res.data;
        console.log(employeesFromDPL);
        let employeeToSyncEmail: EmployeeToSyncEmail[] = [];

        employeesFromDPL.forEach(dplEmployee => {
          let employeesFromDbWithSameJmbg = dbEmployees.filter(
            x => x.jmbg == dplEmployee.JMBG
          );
          if (
            employeesFromDbWithSameJmbg.length == 1 &&
            employeesFromDbWithSameJmbg[0].email == ''
          )
            employeeToSyncEmail.push({
              dbEmployee: employeesFromDbWithSameJmbg[0],
              dplEmployee
            } as EmployeeToSyncEmail);
        });

        dispatch(_open(employeeToSyncEmail));
      } catch (e) {
        dialog.showErrorBox('Računovođa', e.message);
      }
    });
  };

  function _open(employeeToSyncEmail: EmployeeToSyncEmail[]): Action {
    return {
      namespace: NAMESPACE,
      type: OPEN,
      payload: { employeeToSyncEmail }
    };
  }
}

export function close(): Action {
  return {
    namespace: NAMESPACE,
    type: CLOSE
  };
}

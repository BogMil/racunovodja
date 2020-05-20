import { SUCCESS, FAIL, ERROR } from '../constants/responseStatuses';

export const handleResponse = (
  response: any,
  onSuccess: Function,
  onFail: Function = onFailDefault,
  onError: Function = onErrorDefault
) => {
  if (response.status == SUCCESS) onSuccess(response);
  else if (response.status == FAIL) onFail(response);
  else if (response.status == ERROR) onError(response);
};

export const onFailDefault = (response: any) => {
  const { dialog } = require('electron').remote;
  dialog.showMessageBox({ message: response.message, title: 'Greška' });
};

export const onErrorDefault = (response: any) => {
  console.log(response);
  const { dialog } = require('electron').remote;
  dialog.showErrorBox('Greška', response.message);
};

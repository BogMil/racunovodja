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
  const { dialog, getCurrentWindow } = require('electron').remote;
  dialog.showMessageBox(getCurrentWindow(), {
    message: response.message,
    title: 'Greška',
    type: 'warning'
  });
};

export const onErrorDefault = (response: any) => {
  const { dialog, getCurrentWindow } = require('electron').remote;

  if (response.message)
    if (typeof response.message == 'string')
      dialog.showMessageBox(getCurrentWindow(), {
        title: 'Greška',
        message: response.message,
        type: 'error'
      });
    else
      dialog.showMessageBox(getCurrentWindow(), {
        title: 'Greška',
        message: 'Nepredviđena greška',
        type: 'error'
      });
};

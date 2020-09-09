import { SUCCESS, FAIL, ERROR } from '../constants/responseStatuses';

export const handleResponse = (
  response: any,
  onSuccess: Function,
  onFail: Function = onFailDefault,
  onError: Function = onErrorDefault
) => {
  if (response.status == 200) onSuccess(response);
  else if (response.status == 500) onFail(response);
  else if (response.status == 400) onError(response);
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
  let { data } = response;
  if (!data) return;

  if (data.errors) {
    console.log(data.errors);
    dialog.showMessageBox(getCurrentWindow(), {
      title: 'Greška',
      message: data.errors.join('\n'),
      type: 'error'
    });
  } else if (response.message)
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

const { dialog, getCurrentWindow } = require('electron').remote;

type Props = {
  title: string;
  onYes: Function;
  onNo?: Function;
  message?: string;
};

export function areYouSure(props: Props) {
  let options = {
    title: props.title,
    buttons: ['Ne', 'Da'],
    message: props.message != null ? props.message : 'Da li ste sigurni?'
  };

  dialog
    .showMessageBox(getCurrentWindow(), options)
    .then(async (result: any) => {
      if (result.response == 1) props.onYes();
      else props.onNo ? props.onNo() : () => {};
    });
}

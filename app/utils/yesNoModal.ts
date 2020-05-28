const { dialog, getCurrentWindow } = require('electron').remote;

type Props = {
  title: string;
  onYes: Function;
  onNo?: Function;
};

export function areYouSure(props: Props) {
  let options = {
    title: props.title,
    buttons: ['Ne', 'Da'],
    message: 'Da li ste sigurni?'
  };

  dialog
    .showMessageBox(getCurrentWindow(), options)
    .then(async (result: any) => {
      console.log(result.response);
      if (result.response == 1) props.onYes();
      else props.onNo ? props.onNo() : () => {};
    });
}

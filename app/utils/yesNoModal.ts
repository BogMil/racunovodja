const { dialog, getCurrentWindow } = require('electron').remote;

type Props = {
  title: string;
  onYes: Function;
  onNo?: Function;
};

export function areYouSure(props: Props) {
  let options = {
    title: props.title,
    buttons: ['Da', 'Ne'],
    message: 'Da li ste sigurni?'
  };

  dialog
    .showMessageBox(getCurrentWindow(), options)
    .then(async (result: any) => {
      if (result.response == 0) props.onYes();
      else props.onNo ? props.onNo() : () => {};
    });
}

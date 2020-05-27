import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

type Props = {
  onClick:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  title: string;
  style?: any;
};
export default function EditRowButton(props: Props) {
  return (
    <Button
      variant="warning"
      title="Brisanje zaposlenog"
      onClick={props.onClick}
      style={{
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 5,
        paddingRight: 5,
        height: 25,
        ...props.style
      }}
    >
      <FontAwesomeIcon icon={faEdit} />{' '}
    </Button>
  );
}

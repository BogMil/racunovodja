import React from 'react';
import { Button } from 'react-bootstrap';

type Props = {
  onClick:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  title: string;
  style?: any;
};
export default function DeleteRowButton(props: Props) {
  return (
    <Button
      variant="danger"
      title={props.title}
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
      <i className="fas fa-times" />{' '}
    </Button>
  );
}

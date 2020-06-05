import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';

type Props = {
  onClick:
    | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
    | undefined;
  title: string;
  style?: any;
};
export default function DetailsRowButton(props: Props) {
  return (
    <Button
      variant="info"
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
      <FontAwesomeIcon icon={faList} />{' '}
    </Button>
  );
}

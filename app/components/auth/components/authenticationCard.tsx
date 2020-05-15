import React, { ReactNode } from 'react';
import { Container, Row, Card } from 'react-bootstrap';
import accountantImage from '../../../../resources/icons8-accounting-100.png';

type Props = {
  children: ReactNode;
  width?: number;
};

export default function AuthenticationCard(props: Props) {
  return (
    <Container className="noselect">
      <Row className={`justify-content-md-center`}>
        <Card style={{ width: props.width ?? 300 }}>
          <Card.Body>
            <Row
              className="justify-content-md-center"
              style={{ paddingBottom: 50 }}
            >
              <img className="noselect" src={accountantImage} />
            </Row>
            {props.children}
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
}

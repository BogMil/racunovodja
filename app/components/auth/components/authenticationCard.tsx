import React, { ReactNode } from 'react';
import { Container, Row, Card } from 'react-bootstrap';
import accountantImage from '../../../../resources/icons8-accounting-100.png';

type Props={
  children:ReactNode
}

export default function AuthenticationCard(props:Props) {
  return(
     <Container>
      <Row className={`justify-content-md-center`} style={{paddingTop:100}} >
        <Card style={{width:300}}>
          <Card.Body>
            <Row className="justify-content-md-center" style={{paddingBottom:50}}>
                <img className="noselect" src={accountantImage} />
            </Row>
            {props.children}
        </Card.Body>
        </Card>
      </Row>
    </Container>
  );
}

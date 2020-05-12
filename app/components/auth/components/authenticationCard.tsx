import React, { ReactNode } from 'react';
import { Container, Row, Card } from 'react-bootstrap';
import accountantImage from '../../../../resources/icons8-accounting-100.png';

type Props={
  children:ReactNode
}

export default function AuthenticationCard(props:Props) {
  return(
     <Container style={{position:'relative',top:'50%',transform:'translateY(-50%)'}}>
      <Row className={`justify-content-md-center`}  >
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

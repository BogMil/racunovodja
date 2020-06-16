import { Accordion, Card } from 'react-bootstrap';
import React, { ReactNode, useState } from 'react';
import styles from './style.css';

type Props = {
  children: ReactNode;
  text: string;
};

export default function SubMenu(props: Props) {
  const onToggle = () => {
    setIsCollapsed(isCollapsed == '-1' ? '0' : '-1');
    setIcon(isCollapsed == '-1' ? 'fa fa-chevron-down' : 'fa fa-chevron-right');
  };

  let [isCollapsed, setIsCollapsed] = useState('-1');
  let [icon, setIcon] = useState('fa fa-chevron-right');

  return (
    <Accordion activeKey={isCollapsed}>
      <Card className={styles.subMenu}>
        <Accordion.Toggle
          as={Card.Header}
          onClick={onToggle}
          eventKey="0"
          style={{ padding: 0 }}
          className={styles.subMenuHeader}
        >
          <div style={{ width: 200 }} className="noselect">
            <div style={{ float: 'left' }}>{props.text}</div>
            <div style={{ float: 'right', paddingRight: 20 }}>
              <i className={icon} />
            </div>
          </div>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0" timeout={0}>
          <Card.Body className={styles.subMenuBody}>{props.children}</Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

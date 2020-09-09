import React from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { close, handleChange } from './userDetailsModal.actions';
import { AppStore } from '../../../../reducers';
import * as service from '../../userDetails.service';
import { handleResponse } from '../../../../utils/responseHandler';
import { reloadUserDetails } from '../../userDetails.actions';

export default function UserDetailsModalComponent() {
  const dispatch = useDispatch();
  const { userDetails, show, municipalityOptions } = useSelector(
    (state: AppStore) => {
      return state.userDetailsCombined.userDetailsModalStore;
    }
  );

  const handleClose = () => {
    dispatch(close());
  };

  const onHandleChange = (e: any) => {
    let value = e.target.value;
    let name = e.target.name;
    dispatch(handleChange(name, value));
  };

  const handleSave = async () => {
    handleResponse(await service.update(userDetails), () => {
      dispatch(reloadUserDetails());
      dispatch(close());
    });
  };
  return (
    <Modal
      backdrop="static"
      centered
      show={show}
      onHide={handleClose}
      className="noselect"
    >
      <Modal.Header closeButton style={{}}>
        <Modal.Title as="h5">Ažuriranje opštih podataka</Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{ overflowY: 'auto', overflowX: 'hidden', maxHeight: 500 }}
      >
        <Form>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Naziv škole </Form.Label>
                <Form.Control
                  name="naziv_skole"
                  placeholder="Naziv škole"
                  value={userDetails.naziv_skole}
                  onChange={onHandleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Tip škole</Form.Label>
                <Form.Control
                  as="select"
                  custom
                  name="tip_skole"
                  onChange={onHandleChange}
                  value={userDetails.tip_skole ?? ''}
                >
                  <option value="">---</option>
                  <option value="0">Osnovna</option>
                  <option value="1">Srednja</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Šifra škole</Form.Label>
                <Form.Control
                  name="sifra_skole"
                  placeholder="Šifra škole"
                  value={userDetails.sifra_skole ?? ''}
                  onChange={onHandleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Matični broj</Form.Label>
                <Form.Control
                  name="maticni_broj"
                  placeholder="Matični broj"
                  value={userDetails.maticni_broj}
                  onChange={onHandleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Poreski identifikacioni broj</Form.Label>
                <Form.Control
                  name="poreski_identifikacioni_broj"
                  placeholder="Poreski identifikacioni broj"
                  value={userDetails.poreski_identifikacioni_broj}
                  onChange={onHandleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Bankovni rаčun</Form.Label>
                <Form.Control
                  name="bankovni_racun"
                  placeholder="Bankovni raćun"
                  value={userDetails.bankovni_racun}
                  onChange={onHandleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Opština</Form.Label>
                <Form.Control
                  as="select"
                  custom
                  name="id_opstine"
                  onChange={onHandleChange}
                  value={userDetails.id_opstine ?? ''}
                >
                  <>
                    <option value="">---</option>
                    {municipalityOptions.map(municipality => {
                      return (
                        <option key={municipality.id} value={municipality.id}>
                          {municipality.naziv}
                        </option>
                      );
                    })}
                  </>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Mesto</Form.Label>
                <Form.Control
                  name="mesto"
                  placeholder="Mesto"
                  value={userDetails.mesto}
                  onChange={onHandleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Ulica i broj</Form.Label>
                <Form.Control
                  name="ulica_i_broj"
                  placeholder="Ulica i broj"
                  value={userDetails.ulica_i_broj}
                  onChange={onHandleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Telefon</Form.Label>
                <Form.Control
                  name="telefon"
                  placeholder="Telefon"
                  value={userDetails.telefon}
                  onChange={onHandleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleSave}>
          Sačuvaj
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

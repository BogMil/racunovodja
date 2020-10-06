import React from 'react';
import { Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import {
  close,
  updateZaposleniState,
  setErrors
} from './zaposleniModal.actions';
import { AppStore } from '../../../../reducers';
import { reloadEmployees } from '../../zaposleni.actions';
import * as Service from '../../zaposleni.service';
import { handleResponse } from '../../../../utils/responseHandler';
import { CREATE_MODE, EDIT_MODE } from '../../../../constants/modalModes';
import { ErrorText } from '../../../common/errorText';
import { User } from '../../../auth/auth.store.types';

export default function ZaposleniModalComponent() {
  const dispatch = useDispatch();

  const { zaposleni, mode, show, title, opstine, errors } = useSelector(
    (state: AppStore) => {
      return state.zaposleniPage.zaposleniModal;
    }
  );

  const { prava_pristupa } = useSelector((state: AppStore) => {
    return state.auth.user as User;
  });

  const handleClose = () => {
    dispatch(close());
  };

  const handleChange = (e: any) => {
    let value = e.target.value;
    let name = e.target.name;

    if (name == 'active') value = e.target.checked;

    dispatch(updateZaposleniState(name, value));
  };

  const handleSave = async () => {
    if (mode == CREATE_MODE)
      handleResponse(
        await Service.createEmployee(zaposleni),
        () => {
          dispatch(reloadEmployees());
          dispatch(close());
        },
        () => {},
        (response: any) => {
          dispatch(setErrors(response.data.errors));
        }
      );
    else if (mode == EDIT_MODE)
      handleResponse(
        await Service.updateEmployee(zaposleni),
        () => {
          dispatch(reloadEmployees());
          dispatch(close());
        },
        () => {},
        (response: any) => {
          dispatch(setErrors(response.data.errors));
        }
      );
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
        <Modal.Title as="h5">{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>JMBG</Form.Label>
                <Form.Control
                  name="jmbg"
                  placeholder="Unesite JMBG"
                  value={zaposleni.jmbg}
                  onChange={handleChange}
                />
                <ErrorText text={errors?.jmbg} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Broj zaposlenog</Form.Label>
                <Form.Control
                  name="sifra"
                  onChange={handleChange}
                  placeholder="Unesite broj zaposlenog"
                  value={zaposleni.sifra}
                />
                <ErrorText text={errors?.sifra} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={7}>
              <Form.Group>
                <Form.Label>Prezime</Form.Label>
                <Form.Control
                  name="prezime"
                  onChange={handleChange}
                  placeholder="Unesite prezime"
                  value={zaposleni.prezime}
                />
                <ErrorText text={errors?.prezime} />
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group>
                <Form.Label>Ime</Form.Label>
                <Form.Control
                  name="ime"
                  onChange={handleChange}
                  placeholder="Unesite ime"
                  value={zaposleni.ime}
                />
                <ErrorText text={errors?.ime} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Broj računa</Form.Label>
                <Form.Control
                  name="bankovni_racun"
                  onChange={handleChange}
                  placeholder="Unesite broj računa"
                  value={zaposleni.bankovni_racun}
                />
                <ErrorText text={errors?.bankovni_racun} />
              </Form.Group>
            </Col>
            <Col md={6}>
              {prava_pristupa.opiro && (
                <Form.Group>
                  <Form.Label>Opština stanovanja</Form.Label>
                  <Form.Control
                    as="select"
                    custom
                    name="id_opstine"
                    onChange={handleChange}
                    value={zaposleni.id_opstine}
                  >
                    <>
                      <option value="">---</option>
                      {opstine.map(opstina => {
                        return (
                          <option key={opstina.id} value={opstina.id}>
                            {opstina.naziv}
                          </option>
                        );
                      })}
                    </>
                  </Form.Control>
                  <ErrorText text={errors?.opstina_id} />
                </Form.Group>
              )}
            </Col>
          </Row>
          <Row>
            <Col md={9}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email1"
                  onChange={handleChange}
                  placeholder="Unesite Email adresu"
                  value={zaposleni.email1 ?? ''}
                />
                <ErrorText text={errors?.email1} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group
                controlId="formBasicCheckbox"
                style={{ marginTop: 35 }}
              >
                <Form.Check
                  custom
                  name="aktivan"
                  type="checkbox"
                  label="Aktivan?"
                  checked={zaposleni.aktivan}
                  onChange={handleChange}
                />
                <ErrorText text={errors?.aktivan} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={9}>
              <Form.Group>
                <Form.Label>Email 2 (opciono)</Form.Label>
                <Form.Control
                  name="email2"
                  onChange={handleChange}
                  placeholder="Unesite Email adresu"
                  value={zaposleni.email2 ?? ''}
                />
                <ErrorText text={errors?.email2} />
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

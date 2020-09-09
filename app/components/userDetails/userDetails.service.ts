import axios from 'axios';
import { BASE_URL } from '../../config';
import { axiosCatchHandler } from '../../utils/axiosErrorHandler';
import { DetaljiKorisnika } from './userDetails.types';

const API_URL = `${BASE_URL}/api/korisnik/detalji`;

export async function get() {
  let res = await axios.get(`${API_URL}`).catch(axiosCatchHandler);
  return res;
}

export async function update(userDetails: DetaljiKorisnika) {
  let res = await axios
    .put(`${API_URL}`, { ...userDetails })
    .catch(axiosCatchHandler);
  return res;
}

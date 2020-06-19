import axios from 'axios';
import { BASE_URL } from '../../../config';
import { axiosErrorHandler } from '../../../utils/axiosErrorHandler';
import { Lokacija } from './lokacije.types';

const API_URL = `${BASE_URL}/api/lokacija`;

export async function get() {
  let res = await axios
    .get(`${API_URL}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function create(cdto: Lokacija) {
  let res = await axios
    .post(`${API_URL}`, { ...cdto })
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function remove(id: number) {
  let res = await axios
    .delete(`${API_URL}/${id}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function update(cdto: Lokacija) {
  let res = await axios
    .put(`${API_URL}/${cdto.id}`, { ...cdto })
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

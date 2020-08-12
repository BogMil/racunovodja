import axios from 'axios';
import { DobavljacCDTO } from './dobavljaci.types';
import { BASE_URL } from '../../config';
import { axiosErrorHandler } from '../../utils/axiosErrorHandler';

const API_URL = `${BASE_URL}/api/dobavljac`;

export async function get() {
  let res = await axios
    .get(`${API_URL}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function create(cdto: DobavljacCDTO) {
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

export async function update(cdto: DobavljacCDTO) {
  let res = await axios
    .put(`${API_URL}/${cdto.id}`, { ...cdto })
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

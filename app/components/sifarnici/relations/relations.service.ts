import axios from 'axios';
import { BASE_URL } from '../../../config';
import { axiosErrorHandler } from '../../../utils/axiosErrorHandler';
import { RelationCDTO } from './relations.types';

const API_URL = `${BASE_URL}/api/relation`;

export async function get() {
  let res = await axios
    .get(`${BASE_URL}/api/relation`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function create(cdto: RelationCDTO) {
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

export async function update(cdto: RelationCDTO) {
  let res = await axios
    .put(`${API_URL}/${cdto.id}`, { ...cdto })
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

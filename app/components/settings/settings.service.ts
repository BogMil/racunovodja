import axios from 'axios';
import { BASE_URL } from '../../config';
import { axiosErrorHandler } from '../../utils/axiosErrorHandler';

const API_URL = `${BASE_URL}/api/settings`;

export async function get() {
  let res = await axios
    .get(`${API_URL}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function getMaxNonTaxedValue() {
  let res = await axios
    .get(`${API_URL}/getMaxNonTaxedValue`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

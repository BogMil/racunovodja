import axios from 'axios';
import { BASE_URL } from '../../config';
import { axiosErrorHandler } from '../../utils/axiosErrorHandler';

const API_URL = `${BASE_URL}/api/travelingExpense`;

export async function get() {
  let res = await axios
    .get(`${API_URL}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function create(data: {
  employees: number[];
  month: number;
  year: number;
}) {
  let res = await axios
    .post(`${API_URL}`, { ...data })
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function details(id: number) {
  let res = await axios
    .get(`${API_URL}/${id}/details`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

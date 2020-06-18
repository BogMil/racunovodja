import axios from 'axios';
import { BASE_URL } from '../../config';
import { axiosErrorHandler } from '../../utils/axiosErrorHandler';
import { UserDetails } from './userDetails.types';

const API_URL = `${BASE_URL}/api/userDetails`;

export async function get() {
  let res = await axios
    .get(`${API_URL}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function update(userDetails: UserDetails) {
  let res = await axios
    .put(`${API_URL}`, { ...userDetails })
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

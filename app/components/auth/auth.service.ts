import axios from 'axios';
import { NewUser } from './register/register';
import { BASE_URL } from '../../config';
import { ERROR } from '../../constants/responseStatuses';
import { axiosErrorHandler } from '../../utils/axiosErrorHandler';

export async function login(email: string, password: string) {
  let res = await axios
    .post(`${BASE_URL}/api/auth/login`, { email, password })
    .then(res => res.data)
    .catch(function(error) {
      console.log(error);
      return { status: ERROR, message: error.response.data };
    });
  return res;
}

export async function logout() {
  let res = await axios
    .post(`${BASE_URL}/api/auth/logout`)
    .then(res => res.data)
    .catch(function(error) {
      return { status: ERROR, message: error.response.data };
    });
  return res;
}

export async function register(newUser: NewUser) {
  let res = await axios
    .post(`${BASE_URL}/api/auth/register`, { ...newUser })
    .then(res => res.data)
    .catch(function(error) {
      return { status: ERROR, message: error.response.data };
    });
  return res;
}

export async function me() {
  let res = await axios
    .post(`${BASE_URL}/api/auth/me`)
    .then(res => res.data)
    .catch(function(error) {
      return { status: ERROR, message: error.response.data };
    });
  return res;
}

export async function refresh() {
  let res = await axios
    .post(`${BASE_URL}/api/auth/refresh`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

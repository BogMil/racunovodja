import axios from 'axios';
import { NoviKorisnik } from './register';
import { BASE_URL } from '../../config';

export async function login(email: string, password: string) {
  return await axios
    .post(`${BASE_URL}/api/auth/prijava`, { email, password })
    .catch(function(error) {
      return error.response;
    });
}

export async function logout() {
  return await axios.post(`${BASE_URL}/api/auth/logout`).catch(function(error) {
    return error.response;
  });
}

export async function register(newUser: NoviKorisnik) {
  let res = await axios
    .post(`${BASE_URL}/api/auth/registracija`, { ...newUser })
    .catch(function(error) {
      return error.response;
    });
  return res;
}

export async function me() {
  return await axios.post(`${BASE_URL}/api/auth/me`).catch(function(error) {
    return error.response;
  });
}

export async function refresh() {
  return await axios
    .post(`${BASE_URL}/api/auth/refresh`)
    .catch(function(error) {
      return error.response;
    });
}

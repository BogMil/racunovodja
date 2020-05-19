import axios from 'axios';
import { NewUser } from './register/register';
import { BASE_URL } from '../../config';

export function login(email: string, password: string) {
  axios.post(`${BASE_URL}/api/auth/register`);
}

export async function register(newUser: NewUser) {
  let x = await axios
    .post(`${BASE_URL}/api/auth/register`, { ...newUser })
    .then(res => res.data)
    .catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    });
  return x;
}

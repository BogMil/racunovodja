import axios from 'axios';
import { NewUser } from './register/register';

export function login(email: string, password: string) {
  axios.post();
}

export function register(newUser: NewUser) {
  console.log(newUser.email);
  console.log(newUser.password);
  console.log(newUser.passwordConfirm);
  console.log(newUser.name);
  console.log(newUser.city);
  console.log(newUser.street);
}

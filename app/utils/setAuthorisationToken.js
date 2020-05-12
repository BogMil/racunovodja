import axios from 'axios';
import * as tokenService from './tokenService';

const setAuthorisationToken = () => {
  var token = tokenService.getToken();
  if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete axios.defaults.headers.common['Authorization'];
};
export default setAuthorisationToken;

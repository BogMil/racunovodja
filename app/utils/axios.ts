import axios from 'axios';
import { BASE_URL } from '../config';
import { getToken, setToken } from './tokenService';
import { SUCCESS } from '../constants/responseStatuses';

export function setUp(history: any) {
  // LocalstorageService

  axios.interceptors.request.use(
    (config: any) => {
      const token = getToken();
      if (token) config.headers['Authorization'] = 'Bearer ' + token;
      return config;
    },
    error => {
      Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    response => {
      return response;
    },
    async function(error) {
      if (error.message == 'Network Error') {
        const { dialog, getCurrentWindow } = require('electron').remote;
        dialog
          .showMessageBox(getCurrentWindow(), {
            message: 'Problem sa internet konekcijom',
            title: 'Greška',
            type: 'warning',
            buttons: ['x']
          })
          .then((result: any) => {
            if (result.response === 0) {
              const remote = require('electron').remote;
              var window = remote.getCurrentWindow();
              window.close();
            }
          });
      }
      const originalRequest = error.config;

      if (
        error.response.status === 401 &&
        originalRequest.url === `${BASE_URL}/api/auth/refresh`
      ) {
        history.push('/login');
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        var x = await axios
          .post(`${BASE_URL}/api/auth/refresh`)
          .then((res: any) => {
            if (res.status === SUCCESS) {
              setToken(res.data.jwt);
              axios.defaults.headers.common['Authorization'] =
                'Bearer ' + getToken();
              return axios(originalRequest);
            }
          });

        return x;
      }
      return Promise.reject(error);
    }
  );
}

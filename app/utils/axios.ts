import axios from 'axios';
import LocalStorageService from './localStorageService';
import { BASE_URL } from '../config';

export function setUp(history: any) {
  // LocalstorageService
  const localStorageService = LocalStorageService.getService();

  axios.interceptors.request.use(
    (config: any) => {
      const token = localStorageService.getAccessToken();
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
      debugger;
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
            if (res.status === 201) {
              localStorageService.setToken(res.data);
              axios.defaults.headers.common['Authorization'] =
                'Bearer ' + localStorageService.getAccessToken();
              return axios(originalRequest);
            }
          })
          .catch(e => {
            debugger;
          });

        return x;
      }
      return Promise.reject(error);
    }
  );
}

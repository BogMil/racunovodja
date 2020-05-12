import axios from "axios";
import LocalStorageService from "./localStorageService";
import { useHistory } from "react-router-dom";
let history = useHistory();
// LocalstorageService
const localStorageService = LocalStorageService.getService();

axios.interceptors.request.use(
   (config:any) => {
       const token = localStorageService.getAccessToken();
       if (token)
           config.headers['Authorization'] = 'Bearer ' + token;
       return config;
   },
   error => {
       Promise.reject(error)
   });

axios.interceptors.response.use(
  (response) => { return response},
   function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401 && originalRequest.url ==='http://13.232.130.60:8081/v1/auth/token'){
        history.push('/login');
        return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;
      const refreshToken = localStorageService.getRefreshToken();
      return axios
      .post('/auth/token',{"refresh_token": refreshToken})
      .then((res:any) => {
          if (res.status === 201) {
              localStorageService.setToken(res.data);
              axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorageService.getAccessToken();
              return axios(originalRequest);
          }
      })
    }
    return Promise.reject(error);
  });

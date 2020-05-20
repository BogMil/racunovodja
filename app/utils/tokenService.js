const JWT_TOKEN = 'jwt_token';

export const setToken = token => {
  localStorage.setItem(JWT_TOKEN, token);
};

export const removeToken = () => {
  localStorage.removeItem(JWT_TOKEN);
};

export const getToken = () => {
  return localStorage.getItem(JWT_TOKEN);
};

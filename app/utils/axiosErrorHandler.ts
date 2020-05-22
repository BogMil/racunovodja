import { ERROR } from '../constants/responseStatuses';

export const axiosErrorHandler = (error: any) => {
  if (error.response.data.message)
    return { status: ERROR, message: error.response.data.message };
  if (error.response.data)
    return { status: ERROR, message: error.response.data };

  return {
    statut: ERROR,
    message: 'Greška! Server je vratio grešku koju nije moguće obraditi!'
  };
};

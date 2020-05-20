import { Action } from '../../reducers/types';
import { setToken } from '../../utils/tokenService';

export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';
export const UNSET_AUTHENTICATED = 'UNSET_AUTHENTICATED';
export const NAMESPACE = 'AUTH';
export const LOGOUT = 'LOGOUT';

export function setUser(user: any, jwt: string): Action {
  setToken(jwt);
  return {
    namespace: NAMESPACE,
    type: SET_AUTHENTICATED,
    payload: { user }
  };
}

export function unsetUser(): Action {
  return {
    namespace: NAMESPACE,
    type: UNSET_AUTHENTICATED
  };
}

// export function login(email: string, password: string) {
//   return (dispatch: Dispatch) => {
//     let response = await Service.login(email, password);
//     dispatch(_login(email, relations));
//   };

//   function _login(user: User): Action {
//     return {
//       namespace: NAMESPACE,
//       type: OPEN,
//       payload: { employee, availableRelations }
//     };
//   }
// }

// export function logout() {
//   return async () => {
//     var res = await Service.logout();
//     handleResponse(
//       res,
//       () => {
//         let history = useHistory();
//         history.push({
//           pathname: 'SUCCESS_REGISTRATION',
//           state: { trialPeriod: 'asd' }
//         });
//       },
//       onFailDefault,
//       (res: any) => {
//         console.log(res);
//       }
//     );
//   };
// }

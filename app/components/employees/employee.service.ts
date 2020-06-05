import { EmployeeCDTO } from './types';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { axiosErrorHandler } from '../../utils/axiosErrorHandler';

const API_URL = `${BASE_URL}/api/employee`;

export async function get() {
  let res = await axios
    .get(`${API_URL}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function getActiveOnes() {
  let res = await axios
    .get(`${API_URL}/active`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function getAvailableDefaultRelationsForEmployee(id: number) {
  let res = await axios
    .get(`${API_URL}/${id}/availableRelations`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function addDefaultRelation(
  employeeId: number,
  relationId: number
) {
  let res = await axios
    .post(`${API_URL}/${employeeId}/attachDefaultRelation`, { relationId })
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function removeDefaultRelation(
  employeeId: number,
  relationId: number
) {
  let res = await axios
    .delete(`${API_URL}/${employeeId}/removeDefaultRelation/${relationId}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function getMunicipalityOptions() {
  let res = await axios
    .get(`${BASE_URL}/api/municipality`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function createEmployee(employee: EmployeeCDTO) {
  let res = await axios
    .post(`${API_URL}`, { ...employee })
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function removeEmployee(employeeId: number) {
  let res = await axios
    .delete(`${API_URL}/${employeeId}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function updateEmployee(employee: EmployeeCDTO) {
  let res = await axios
    .put(`${API_URL}/${employee.id}`, { ...employee })
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function getMissingJmbgs(jmbgs: string[]) {
  let res = await axios
    .post(`${BASE_URL}/api/user/getMissingJmbgs`, { jmbgs })
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

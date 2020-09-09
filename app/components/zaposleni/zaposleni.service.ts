import { ZaposleniCDTO } from './zaposleni.types';
import axios from 'axios';
import { BASE_URL } from '../../config';
import {
  axiosErrorHandler,
  axiosCatchHandler
} from '../../utils/axiosErrorHandler';

const API_URL = `${BASE_URL}/api/zaposleni`;

export async function get() {
  return await axios.get(`${API_URL}`).catch(axiosCatchHandler);
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
  return await axios.get(`${BASE_URL}/api/opstina`).catch(axiosCatchHandler);
}

export async function createEmployee(employee: ZaposleniCDTO) {
  return await axios
    .post(`${API_URL}`, { ...employee })
    .catch(axiosCatchHandler);
}

export async function removeEmployee(employeeId: number) {
  return await axios
    .delete(`${API_URL}/${employeeId}`)
    .catch(axiosCatchHandler);
}

export async function updateEmployee(employee: ZaposleniCDTO) {
  return await axios
    .put(`${API_URL}/${employee.id}`, { ...employee })
    .catch(axiosCatchHandler);
}

export async function getMissingJmbgs(jmbgs: string[]) {
  return await axios
    .post(`${BASE_URL}/api/zaposleni/izdvojNedostajuceJmbgove`, { jmbgs })
    .catch(axiosCatchHandler);
}

export async function getMissingEmployeeNumbers(numbers: string[]) {
  let res = await axios
    .post(`${BASE_URL}/api/user/getMissingEmployeeNumbers`, { numbers })
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function updateEmail(jmbg: string, email: string) {
  return await axios
    .post(`${API_URL}/${jmbg}/azurirajEmail`, { email })
    .catch(axiosCatchHandler);
}

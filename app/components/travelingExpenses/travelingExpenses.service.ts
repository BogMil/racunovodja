import axios from 'axios';
import { BASE_URL } from '../../config';
import { axiosErrorHandler } from '../../utils/axiosErrorHandler';

const API_URL = `${BASE_URL}/api/travelingExpense`;

export async function get() {
  let res = await axios
    .get(`${API_URL}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function create(data: {
  employees: number[];
  month: number;
  year: number;
}) {
  let res = await axios
    .post(`${API_URL}`, { ...data })
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function details(id: number) {
  let res = await axios
    .get(`${API_URL}/${id}/details`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function remove(travelingExpenseId: number) {
  let res = await axios
    .delete(`${API_URL}/${travelingExpenseId}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function removeEmployeeWithRelations(
  employeeWithRelationsId: number
) {
  let res = await axios
    .delete(`${API_URL}/employee/${employeeWithRelationsId}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function getAvailableEmployees(employeeWithRelationsId: number) {
  let res = await axios
    .get(`${API_URL}/${employeeWithRelationsId}/availableEmployees`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function addEmployee(
  employeeId: number,
  travelingExpenseId: number
) {
  let res = await axios
    .post(`${API_URL}/${travelingExpenseId}/addEmployee/${employeeId}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function removeRelation(relationWithDaysId: number) {
  let res = await axios
    .delete(`${API_URL}/relation/${relationWithDaysId}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function getAvailableRelations(
  travelingExpenseEmployeeId: number
) {
  let res = await axios
    .get(
      `${API_URL}/travelingExpenseEmployee/${travelingExpenseEmployeeId}/availableRelations`
    )
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function addDaysToRelation(id: number, days: number) {
  let res = await axios
    .post(`${API_URL}/employeeRelation/${id}/addDays/${days}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function addRelationWithDays(
  travelingExpenseEmployeeId: number,
  relationId: number,
  days: number
) {
  let res = await axios
    .post(
      `${API_URL}/employee/${travelingExpenseEmployeeId}/addRelationWithDays/${relationId}/${days}`
    )
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function lockService(id: number) {
  let res = await axios
    .post(`${API_URL}/${id}/lock`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

import { Employee, DefaultRelation, EmployeeCDTO } from './types';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { axiosErrorHandler } from '../../utils/axiosErrorHandler';

export async function get() {
  let res = await axios
    .get(`${BASE_URL}/api/employee`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function getAvailableDefaultRelationsForEmployee(id: number) {
  let res = await axios
    .get(`${BASE_URL}/api/employee/`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
  return [
    { id: 1, name: 'a-b-zza' },
    { id: 2, name: 'a-b-asda' },
    { id: 5, name: 'a-b-asd' },
    { id: 7, name: 'a-b-2' }
  ];
}

export function getEmployee(id: number): Employee {
  return {
    id: 1,
    active: true,
    jmbg: '2029938765372',
    number: '982137',
    last_name: 'Bogdanovic',
    first_name: 'Milan',
    banc_account: '160-5800000000000-00',
    municipality: {
      id: 2,
      code: '017',
      name: 'Smederevo'
    },
    default_relations: [
      {
        id: 1,
        name: 'A-B-A'
      },
      {
        id: 11,
        name: 'A-B-NOVA'
      }
    ]
  };
}

export function removeDefaultRelation(id: number) {}

export async function getMunicipalityOptions() {
  let res = await axios
    .get(`${BASE_URL}/api/municipality`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function createEmployee(employee: EmployeeCDTO) {
  let res = await axios
    .post(`${BASE_URL}/api/employee`, { ...employee })
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function removeEmployee(employeeId: number) {
  let res = await axios
    .delete(`${BASE_URL}/api/employee/${employeeId}`)
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

export async function updateEmployee(employee: EmployeeCDTO) {
  let res = await axios
    .put(`${BASE_URL}/api/employee/${employee.id}`, { ...employee })
    .then(res => res.data)
    .catch(axiosErrorHandler);
  return res;
}

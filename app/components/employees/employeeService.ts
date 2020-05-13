import { Employee, DefaultRelation } from './models/employee';

export function get(): Employee[] {
  return [
    {
      id: 1,
      active: true,
      jmbg: '2029938765372',
      employeeNumber: '982137',
      lastName: 'Bogdanovic',
      firstName: 'Milan',
      bancAccount: '160-5800000000000-00',
      municipality: {
        code: '017',
        name: 'Smederevo'
      },
      defaultRelations: [
        {
          id: 1,
          name: 'A-B-A'
        }
      ]
    },
    {
      id: 2,
      active: true,
      jmbg: '2029938765372',
      employeeNumber: '982137',
      lastName: 'Andric Jovanovska',
      firstName: 'Ana',
      bancAccount: '160-5800000000000-00',
      municipality: {
        code: '018',
        name: 'Kovin'
      },
      defaultRelations: [
        {
          id: 2,
          name: 'C-D-C'
        },
        {
          id: 3,
          name: 'Ca-Da-Ca'
        }
      ]
    },
    {
      id: 3,
      active: true,
      jmbg: '2029938255372',
      employeeNumber: '2137',
      lastName: 'Stevanovic',
      firstName: 'Lazar',
      bancAccount: '160-5800000000000-00',
      municipality: {
        code: '07',
        name: 'Nis'
      },
      defaultRelations: []
    }
  ];
}

export function getAvailableDefaultRelationsForEmployee(
  id: number
): DefaultRelation[] {
  return [
    { id: 1, name: 'a-b-zza' },
    { id: 2, name: 'a-b-asda' },
    { id: 5, name: 'a-b-asd' },
    { id: 7, name: 'a-b-2' }
  ];
}

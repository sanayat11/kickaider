import type { Department, UnassignedDevice } from './types';

export const initialDepartments: Department[] = [
  {
    id: 'd1',
    name: 'IT Отдел',
    employees: [
      { id: 'e1', name: 'Иванов Иван', position: 'Frontend Developer' },
      { id: 'e2', name: 'Сауле Абдыкадырова Sakewa', position: 'Backend Developer' },
    ],
  },
  {
    id: 'd2',
    name: 'HR Отдел',
    employees: [
      { id: 'e3', name: 'Смирнова Анна', position: 'HR Manager' },
    ],
  },
];

export const initialUnassigned: UnassignedDevice[] = [
  { id: 'u1', hostname: 'DESKTOP-NEW123', lastSeen: '10 минут назад' },
  { id: 'u2', hostname: 'LAPTOP-GUEST01', lastSeen: '2 часа назад' },
];

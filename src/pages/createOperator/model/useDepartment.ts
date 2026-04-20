import { useMutation } from '@tanstack/react-query';
import { userApi } from '../api/DepartmentApi';

export const useCreateOperator = () => {
  return useMutation({
    mutationFn: userApi.createUser,
  });
};
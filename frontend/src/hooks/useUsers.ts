import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { User, Role } from '@/types';

interface Department {
  id: string;
  name: string;
}

interface Manager {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface CreateUserData {
  email: string;
  name: string;
  password: string;
  role: Role;
  departmentId?: string;
  managerId?: string;
  username?: string;
}

interface UpdateUserData {
  email?: string;
  name?: string;
  role?: Role;
  departmentId?: string | null;
  managerId?: string | null;
  username?: string | null;
}

interface ResetPasswordData {
  password: string;
}

export function useUsers() {
  return useQuery<{ users: User[] }>({
    queryKey: ['users'],
    queryFn: () => apiClient.get('/users'),
  });
}

export function useUser(id: string) {
  return useQuery<{ user: User }>({
    queryKey: ['users', id],
    queryFn: () => apiClient.get(`/users/${id}`),
    enabled: !!id,
  });
}

export function useDepartments() {
  return useQuery<{ departments: Department[] }>({
    queryKey: ['users', 'departments'],
    queryFn: () => apiClient.get('/users/departments'),
  });
}

export function useManagers() {
  return useQuery<{ managers: Manager[] }>({
    queryKey: ['users', 'managers'],
    queryFn: () => apiClient.get('/users/managers'),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) =>
      apiClient.post('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserData) =>
      apiClient.put(`/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      apiClient.post(`/users/${id}/reset-password`, { password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Target } from '@/types';

export function useTargets(month?: number, year?: number) {
  const params = new URLSearchParams();
  if (month) params.append('month', month.toString());
  if (year) params.append('year', year.toString());

  return useQuery<Target[]>({
    queryKey: ['targets', month, year],
    queryFn: () => apiClient.get<Target[]>(`/targets?${params.toString()}`),
  });
}

export function useCreateTarget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.post('/targets', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['targets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

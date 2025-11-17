import { useMutation, useQueryClient } from '@tanstack/react-query';
import { movimentacaoService } from '../../services/movimentacaoService';
import type { UseMovimentacaoCreateOptions, UseMovimentacaoCreateReturn } from './types';
import type { CreateMovimentacaoDto } from '../../types';

/**
 * @hook useMovimentacaoCreate
 * @summary Hook for creating stock movements
 * @domain movimentacao
 * @type domain-hook
 * @category data
 */
export const useMovimentacaoCreate = (
  options: UseMovimentacaoCreateOptions = {}
): UseMovimentacaoCreateReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateMovimentacaoDto) => movimentacaoService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['movimentacoes'] });
      queryClient.invalidateQueries({ queryKey: ['saldo-estoque'] });
      options.onSuccess?.(data);
    },
    onError: (error: Error) => {
      options.onError?.(error);
    },
  });

  return {
    create: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  };
};

import { useQuery } from '@tanstack/react-query';
import { movimentacaoService } from '../../services/movimentacaoService';
import type { UseMovimentacaoHistoricoOptions, UseMovimentacaoHistoricoReturn } from './types';

/**
 * @hook useMovimentacaoHistorico
 * @summary Hook for getting product movement history
 * @domain movimentacao
 * @type domain-hook
 * @category data
 */
export const useMovimentacaoHistorico = (
  options: UseMovimentacaoHistoricoOptions
): UseMovimentacaoHistoricoReturn => {
  const { params, enabled = true } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['movimentacao-historico', params],
    queryFn: () => movimentacaoService.getHistorico(params),
    enabled: enabled && !!params.idProduto,
  });

  return {
    historico: data || [],
    isLoading,
    error,
    refetch,
  };
};

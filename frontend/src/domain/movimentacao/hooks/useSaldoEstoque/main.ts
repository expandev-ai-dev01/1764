import { useQuery } from '@tanstack/react-query';
import { movimentacaoService } from '../../services/movimentacaoService';
import type { UseSaldoEstoqueOptions, UseSaldoEstoqueReturn } from './types';

/**
 * @hook useSaldoEstoque
 * @summary Hook for getting product stock balance
 * @domain movimentacao
 * @type domain-hook
 * @category data
 */
export const useSaldoEstoque = (options: UseSaldoEstoqueOptions): UseSaldoEstoqueReturn => {
  const { idProduto, enabled = true } = options;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['saldo-estoque', idProduto],
    queryFn: () => movimentacaoService.getSaldoEstoque(idProduto),
    enabled: enabled && !!idProduto,
  });

  return {
    saldo: data || null,
    isLoading,
    error,
    refetch,
  };
};

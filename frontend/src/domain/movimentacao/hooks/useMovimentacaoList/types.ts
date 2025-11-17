import type { Movimentacao, MovimentacaoListParams } from '../../types';

export interface UseMovimentacaoListOptions {
  filters?: MovimentacaoListParams;
  enabled?: boolean;
}

export interface UseMovimentacaoListReturn {
  movimentacoes: Movimentacao[];
  metadata: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  } | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

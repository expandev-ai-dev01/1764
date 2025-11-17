import type { MovimentacaoHistorico, MovimentacaoHistoricoParams } from '../../types';

export interface UseMovimentacaoHistoricoOptions {
  params: MovimentacaoHistoricoParams;
  enabled?: boolean;
}

export interface UseMovimentacaoHistoricoReturn {
  historico: MovimentacaoHistorico[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

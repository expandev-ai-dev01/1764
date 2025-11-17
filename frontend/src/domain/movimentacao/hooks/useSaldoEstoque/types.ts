import type { SaldoEstoque } from '../../types';

export interface UseSaldoEstoqueOptions {
  idProduto: number;
  enabled?: boolean;
}

export interface UseSaldoEstoqueReturn {
  saldo: SaldoEstoque | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

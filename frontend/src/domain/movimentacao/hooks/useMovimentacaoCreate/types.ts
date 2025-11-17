import type { CreateMovimentacaoDto } from '../../types';

export interface UseMovimentacaoCreateOptions {
  onSuccess?: (data: { idMovimentacao: string }) => void;
  onError?: (error: Error) => void;
}

export interface UseMovimentacaoCreateReturn {
  create: (data: CreateMovimentacaoDto) => Promise<{ idMovimentacao: string }>;
  isCreating: boolean;
  error: Error | null;
}

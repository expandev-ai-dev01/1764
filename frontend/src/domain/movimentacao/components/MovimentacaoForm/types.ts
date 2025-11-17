import type { CreateMovimentacaoDto } from '../../types';

export interface MovimentacaoFormProps {
  onSuccess?: (data: { idMovimentacao: string }) => void;
  onCancel?: () => void;
}

export interface MovimentacaoFormData {
  tipoMovimentacao: 'entrada' | 'saida' | 'ajuste' | 'criacao' | 'exclusao';
  idProduto: number;
  quantidade: number;
  motivo: string;
  observacao?: string;
  numeroNotaFiscal?: string;
  idLocalizacao?: number;
  custoUnitario?: number;
  lote?: string;
  dataValidade?: string;
}

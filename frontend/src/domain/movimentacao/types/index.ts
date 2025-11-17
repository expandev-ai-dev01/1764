export type TipoMovimentacao = 'entrada' | 'saida' | 'ajuste' | 'criacao' | 'exclusao';

export interface Movimentacao {
  idMovimentacao: string;
  tipoMovimentacao: TipoMovimentacao;
  idProduto: number;
  nomeProduto?: string;
  quantidade: number;
  dataHora: string;
  idUsuario: number;
  nomeUsuario?: string;
  motivo: string;
  observacao?: string | null;
  numeroNotaFiscal?: string | null;
  idLocalizacao?: number | null;
  custoUnitario?: number | null;
  lote?: string | null;
  dataValidade?: string | null;
}

export interface CreateMovimentacaoDto {
  tipoMovimentacao: TipoMovimentacao;
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

export interface MovimentacaoListParams {
  periodoInicio?: string;
  periodoFim?: string;
  tipoMovimentacao?: string;
  idProduto?: number;
  idUsuario?: number;
  ordenacao?: string;
  itensPorPagina?: number;
  paginaAtual?: number;
}

export interface MovimentacaoHistoricoParams {
  idProduto: number;
  periodoInicio?: string;
  periodoFim?: string;
  tipoMovimentacao?: string;
  exibirSaldoAcumulado?: number;
}

export interface MovimentacaoHistorico extends Movimentacao {
  saldoAcumulado?: number;
}

export interface SaldoEstoque {
  idProduto: number;
  nomeProduto: string;
  quantidadeAtual: number;
  valorMedio: number;
  valorTotal: number;
  ultimaMovimentacao: string;
  status: 'normal' | 'baixo' | 'critico' | 'excesso' | 'zerado';
}

/**
 * @summary
 * Stock movement type definitions
 *
 * @module services/movimentacao/movimentacaoTypes
 */

/**
 * @interface MovimentacaoCreateRequest
 * @description Request parameters for creating a stock movement
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {string} tipoMovimentacao - Movement type
 * @property {number} idProduto - Product identifier
 * @property {number} quantidade - Quantity moved
 * @property {string} motivo - Movement reason
 * @property {string | null} [observacao] - Additional observations
 * @property {string | null} [numeroNotaFiscal] - Invoice number
 * @property {number | null} [idLocalizacao] - Location identifier
 * @property {number | null} [custoUnitario] - Unit cost
 * @property {string | null} [lote] - Batch number
 * @property {string | null} [dataValidade] - Expiration date
 */
export interface MovimentacaoCreateRequest {
  idAccount: number;
  idUser: number;
  tipoMovimentacao: string;
  idProduto: number;
  quantidade: number;
  motivo: string;
  observacao?: string | null;
  numeroNotaFiscal?: string | null;
  idLocalizacao?: number | null;
  custoUnitario?: number | null;
  lote?: string | null;
  dataValidade?: string | null;
}

/**
 * @interface MovimentacaoListRequest
 * @description Request parameters for listing stock movements
 *
 * @property {number} idAccount - Account identifier
 * @property {string | null} [periodoInicio] - Start date filter
 * @property {string | null} [periodoFim] - End date filter
 * @property {string | null} [tipoMovimentacao] - Movement type filter
 * @property {number | null} [idProduto] - Product filter
 * @property {number | null} [idUsuario] - User filter
 * @property {string | null} [ordenacao] - Sort order
 * @property {number | null} [itensPorPagina] - Items per page
 * @property {number | null} [paginaAtual] - Current page
 */
export interface MovimentacaoListRequest {
  idAccount: number;
  periodoInicio?: string | null;
  periodoFim?: string | null;
  tipoMovimentacao?: string | null;
  idProduto?: number | null;
  idUsuario?: number | null;
  ordenacao?: string | null;
  itensPorPagina?: number | null;
  paginaAtual?: number | null;
}

/**
 * @interface MovimentacaoHistoricoRequest
 * @description Request parameters for getting movement history
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idProduto - Product identifier
 * @property {string | null} [periodoInicio] - Start date filter
 * @property {string | null} [periodoFim] - End date filter
 * @property {string | null} [tipoMovimentacao] - Movement type filter
 * @property {number | null} [exibirSaldoAcumulado] - Show accumulated balance flag
 */
export interface MovimentacaoHistoricoRequest {
  idAccount: number;
  idProduto: number;
  periodoInicio?: string | null;
  periodoFim?: string | null;
  tipoMovimentacao?: string | null;
  exibirSaldoAcumulado?: number | null;
}

/**
 * @summary
 * Stock movement business rules
 * Handles all stock movement operations
 *
 * @module services/movimentacao/movimentacaoRules
 */

import { dbRequest, ExpectedReturn } from '@/utils/database';
import {
  MovimentacaoCreateRequest,
  MovimentacaoListRequest,
  MovimentacaoHistoricoRequest,
} from './movimentacaoTypes';

/**
 * @summary
 * Creates a new stock movement
 *
 * @function movimentacaoCreate
 * @module movimentacao
 *
 * @param {MovimentacaoCreateRequest} params - Movement creation parameters
 *
 * @returns {Promise<{ idMovimentacao: number }>} Created movement identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {BusinessRuleError} When business rules are violated
 * @throws {DatabaseError} When database operation fails
 */
export async function movimentacaoCreate(
  params: MovimentacaoCreateRequest
): Promise<{ idMovimentacao: number }> {
  const result = await dbRequest(
    '[functional].[spMovimentacaoCreate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      tipoMovimentacao: params.tipoMovimentacao,
      idProduto: params.idProduto,
      quantidade: params.quantidade,
      motivo: params.motivo,
      observacao: params.observacao || null,
      numeroNotaFiscal: params.numeroNotaFiscal || null,
      idLocalizacao: params.idLocalizacao || null,
      custoUnitario: params.custoUnitario || null,
      lote: params.lote || null,
      dataValidade: params.dataValidade || null,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Lists stock movements with filtering and pagination
 *
 * @function movimentacaoList
 * @module movimentacao
 *
 * @param {MovimentacaoListRequest} params - List parameters
 *
 * @returns {Promise<{ data: any[], total: number }>} Movement list and total count
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function movimentacaoList(
  params: MovimentacaoListRequest
): Promise<{ data: any[]; total: number }> {
  const results = await dbRequest(
    '[functional].[spMovimentacaoList]',
    {
      idAccount: params.idAccount,
      periodoInicio: params.periodoInicio || null,
      periodoFim: params.periodoFim || null,
      tipoMovimentacao: params.tipoMovimentacao || null,
      idProduto: params.idProduto || null,
      idUsuario: params.idUsuario || null,
      ordenacao: params.ordenacao || 'data_decrescente',
      itensPorPagina: params.itensPorPagina || 25,
      paginaAtual: params.paginaAtual || 1,
    },
    ExpectedReturn.Multi
  );

  const recordsets = results as any[];
  const data = recordsets[0] || [];
  const totalRecord = recordsets[1] && recordsets[1][0] ? recordsets[1][0] : { total: 0 };

  return {
    data: data,
    total: totalRecord.total,
  };
}

/**
 * @summary
 * Gets movement history for a product
 *
 * @function movimentacaoHistoricoGet
 * @module movimentacao
 *
 * @param {MovimentacaoHistoricoRequest} params - History request parameters
 *
 * @returns {Promise<any[]>} Movement history
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function movimentacaoHistoricoGet(
  params: MovimentacaoHistoricoRequest
): Promise<any[]> {
  const result = await dbRequest(
    '[functional].[spMovimentacaoHistoricoGet]',
    {
      idAccount: params.idAccount,
      idProduto: params.idProduto,
      periodoInicio: params.periodoInicio || null,
      periodoFim: params.periodoFim || null,
      tipoMovimentacao: params.tipoMovimentacao || 'todos',
      exibirSaldoAcumulado:
        params.exibirSaldoAcumulado !== undefined ? params.exibirSaldoAcumulado : 1,
    },
    ExpectedReturn.Multi
  );

  return result;
}

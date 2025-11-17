/**
 * @summary
 * Stock balance business rules
 * Handles stock balance queries
 *
 * @module services/saldoEstoque/saldoEstoqueRules
 */

import { dbRequest, ExpectedReturn } from '@/utils/database';
import { SaldoEstoqueGetRequest } from './saldoEstoqueTypes';

/**
 * @summary
 * Gets stock balance for a product
 *
 * @function saldoEstoqueGet
 * @module saldoEstoque
 *
 * @param {SaldoEstoqueGetRequest} params - Get parameters
 *
 * @returns {Promise<any>} Stock balance information
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function saldoEstoqueGet(params: SaldoEstoqueGetRequest): Promise<any> {
  const result = await dbRequest(
    '[functional].[spSaldoEstoqueGet]',
    {
      idAccount: params.idAccount,
      idProduto: params.idProduto,
    },
    ExpectedReturn.Single
  );

  return result;
}

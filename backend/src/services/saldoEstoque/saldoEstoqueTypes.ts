/**
 * @summary
 * Stock balance type definitions
 *
 * @module services/saldoEstoque/saldoEstoqueTypes
 */

/**
 * @interface SaldoEstoqueGetRequest
 * @description Request parameters for getting stock balance
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idProduto - Product identifier
 */
export interface SaldoEstoqueGetRequest {
  idAccount: number;
  idProduto: number;
}

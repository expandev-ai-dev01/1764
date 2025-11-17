/**
 * @summary
 * Stock balance controller
 * Handles stock balance queries
 *
 * @module api/v1/internal/saldo-estoque/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { saldoEstoqueGet } from '@/services/saldoEstoque';

const securable = 'SALDO_ESTOQUE';

const getSchema = z.object({
  idProduto: z.coerce.number().int().positive(),
});

/**
 * @api {get} /api/v1/internal/saldo-estoque/:idProduto Get Stock Balance
 * @apiName GetSaldoEstoque
 * @apiGroup SaldoEstoque
 * @apiVersion 1.0.0
 *
 * @apiDescription Gets current stock balance for a product
 *
 * @apiParam {Number} idProduto Product identifier
 *
 * @apiSuccess {Number} idProduto Product identifier
 * @apiSuccess {String} nomeProduto Product name
 * @apiSuccess {Number} quantidadeAtual Current quantity
 * @apiSuccess {Number} valorMedio Average unit cost
 * @apiSuccess {Number} valorTotal Total stock value
 * @apiSuccess {String} ultimaMovimentacao Last movement date
 * @apiSuccess {String} status Stock status
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, getSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params as z.infer<typeof getSchema>;
    const result = await saldoEstoqueGet({
      ...validated.credential,
      ...data,
    });

    res.json(successResponse(result));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

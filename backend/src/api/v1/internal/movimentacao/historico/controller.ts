/**
 * @summary
 * Movement history controller
 * Handles movement history queries for products
 *
 * @module api/v1/internal/movimentacao/historico/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { movimentacaoHistoricoGet } from '@/services/movimentacao';

const securable = 'MOVIMENTACAO';

const getSchema = z.object({
  idProduto: z.coerce.number().int().positive(),
  periodoInicio: z.string().nullable().optional(),
  periodoFim: z.string().nullable().optional(),
  tipoMovimentacao: z.string().nullable().optional(),
  exibirSaldoAcumulado: z.coerce.number().int().min(0).max(1).nullable().optional(),
});

/**
 * @api {get} /api/v1/internal/movimentacao/historico/:idProduto Get Movement History
 * @apiName GetMovimentacaoHistorico
 * @apiGroup Movimentacao
 * @apiVersion 1.0.0
 *
 * @apiDescription Gets movement history for a product with optional accumulated balance
 *
 * @apiParam {Number} idProduto Product identifier
 * @apiParam {String} [periodoInicio] Start date filter
 * @apiParam {String} [periodoFim] End date filter
 * @apiParam {String} [tipoMovimentacao] Movement type filter
 * @apiParam {Number} [exibirSaldoAcumulado] Show accumulated balance (0 or 1)
 *
 * @apiSuccess {Array} data Movement history
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
    const result = await movimentacaoHistoricoGet({
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

/**
 * @summary
 * Stock movement controller
 * Handles all stock movement operations
 *
 * @module api/v1/internal/movimentacao/controller
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { movimentacaoCreate, movimentacaoList } from '@/services/movimentacao';

const securable = 'MOVIMENTACAO';

const createSchema = z.object({
  tipoMovimentacao: z.enum(['entrada', 'saida', 'ajuste', 'criacao', 'exclusao']),
  idProduto: z.coerce.number().int().positive(),
  quantidade: z.coerce.number(),
  motivo: z.string().min(1).max(255),
  observacao: z.string().max(1000).nullable().optional(),
  numeroNotaFiscal: z.string().length(9).nullable().optional(),
  idLocalizacao: z.coerce.number().int().positive().nullable().optional(),
  custoUnitario: z.coerce.number().positive().nullable().optional(),
  lote: z.string().max(50).nullable().optional(),
  dataValidade: z.string().nullable().optional(),
});

const listSchema = z.object({
  periodoInicio: z.string().nullable().optional(),
  periodoFim: z.string().nullable().optional(),
  tipoMovimentacao: z.string().nullable().optional(),
  idProduto: z.coerce.number().int().positive().nullable().optional(),
  idUsuario: z.coerce.number().int().positive().nullable().optional(),
  ordenacao: z.string().nullable().optional(),
  itensPorPagina: z.coerce.number().int().positive().nullable().optional(),
  paginaAtual: z.coerce.number().int().positive().nullable().optional(),
});

/**
 * @api {post} /api/v1/internal/movimentacao Create Movement
 * @apiName CreateMovimentacao
 * @apiGroup Movimentacao
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new stock movement transaction
 *
 * @apiParam {String} tipoMovimentacao Movement type (entrada, saida, ajuste, criacao, exclusao)
 * @apiParam {Number} idProduto Product identifier
 * @apiParam {Number} quantidade Quantity moved
 * @apiParam {String} motivo Movement reason
 * @apiParam {String} [observacao] Additional observations
 * @apiParam {String} [numeroNotaFiscal] Invoice number
 * @apiParam {Number} [idLocalizacao] Location identifier
 * @apiParam {Number} [custoUnitario] Unit cost
 * @apiParam {String} [lote] Batch number
 * @apiParam {String} [dataValidade] Expiration date
 *
 * @apiSuccess {Number} idMovimentacao Created movement identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const [validated, error] = await operation.create(req, createSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params as z.infer<typeof createSchema>;
    const result = await movimentacaoCreate({
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

/**
 * @api {get} /api/v1/internal/movimentacao List Movements
 * @apiName ListMovimentacao
 * @apiGroup Movimentacao
 * @apiVersion 1.0.0
 *
 * @apiDescription Lists stock movements with filtering and pagination
 *
 * @apiParam {String} [periodoInicio] Start date filter
 * @apiParam {String} [periodoFim] End date filter
 * @apiParam {String} [tipoMovimentacao] Movement type filter
 * @apiParam {Number} [idProduto] Product filter
 * @apiParam {Number} [idUsuario] User filter
 * @apiParam {String} [ordenacao] Sort order
 * @apiParam {Number} [itensPorPagina] Items per page
 * @apiParam {Number} [paginaAtual] Current page
 *
 * @apiSuccess {Array} data Movement list
 * @apiSuccess {Object} metadata Pagination metadata
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} UnauthorizedError User lacks permission
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const [validated, error] = await operation.read(req, listSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = validated.params as z.infer<typeof listSchema>;
    const result = await movimentacaoList({
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

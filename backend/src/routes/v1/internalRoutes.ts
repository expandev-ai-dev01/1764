/**
 * @summary
 * Internal (authenticated) API routes configuration
 * Handles authenticated endpoints
 *
 * @module routes/v1/internalRoutes
 */

import { Router } from 'express';
import * as movimentacaoController from '@/api/v1/internal/movimentacao/controller';
import * as saldoEstoqueController from '@/api/v1/internal/saldo-estoque/controller';
import * as movimentacaoHistoricoController from '@/api/v1/internal/movimentacao/historico/controller';

const router = Router();

router.post('/movimentacao', movimentacaoController.postHandler);
router.get('/movimentacao', movimentacaoController.getHandler);

router.get('/saldo-estoque/:idProduto', saldoEstoqueController.getHandler);

router.get('/movimentacao/historico/:idProduto', movimentacaoHistoricoController.getHandler);

export default router;

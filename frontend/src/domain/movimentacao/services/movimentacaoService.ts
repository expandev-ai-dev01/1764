import { authenticatedClient } from '@/core/lib/api';
import type {
  Movimentacao,
  CreateMovimentacaoDto,
  MovimentacaoListParams,
  MovimentacaoHistoricoParams,
  MovimentacaoHistorico,
  SaldoEstoque,
} from '../types';

/**
 * @service movimentacaoService
 * @summary Service for stock movement operations
 * @domain movimentacao
 * @type rest-service
 * @apiContext internal
 */
export const movimentacaoService = {
  /**
   * @endpoint POST /api/v1/internal/movimentacao
   * @summary Creates a new stock movement
   */
  async create(data: CreateMovimentacaoDto): Promise<{ idMovimentacao: string }> {
    const response = await authenticatedClient.post('/movimentacao', data);
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/movimentacao
   * @summary Lists stock movements with filters
   */
  async list(params?: MovimentacaoListParams): Promise<{
    data: Movimentacao[];
    metadata: {
      total: number;
      page: number;
      perPage: number;
      totalPages: number;
    };
  }> {
    const response = await authenticatedClient.get('/movimentacao', { params });
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/movimentacao/historico/:idProduto
   * @summary Gets movement history for a product
   */
  async getHistorico(params: MovimentacaoHistoricoParams): Promise<MovimentacaoHistorico[]> {
    const { idProduto, ...queryParams } = params;
    const response = await authenticatedClient.get(`/movimentacao/historico/${idProduto}`, {
      params: queryParams,
    });
    return response.data.data;
  },

  /**
   * @endpoint GET /api/v1/internal/saldo-estoque/:idProduto
   * @summary Gets current stock balance for a product
   */
  async getSaldoEstoque(idProduto: number): Promise<SaldoEstoque> {
    const response = await authenticatedClient.get(`/saldo-estoque/${idProduto}`);
    return response.data.data;
  },
};

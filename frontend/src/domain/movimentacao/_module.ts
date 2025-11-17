/**
 * @module movimentacao
 * @summary Stock movement management domain
 * @domain functional
 * @version 1.0.0
 */

export * from './components/MovimentacaoForm';
export * from './components/MovimentacaoList';
export * from './hooks/useMovimentacaoCreate';
export * from './hooks/useMovimentacaoList';
export * from './hooks/useMovimentacaoHistorico';
export * from './hooks/useSaldoEstoque';
export * from './services/movimentacaoService';
export * from './types';

export const moduleMetadata = {
  name: 'movimentacao',
  domain: 'functional',
  version: '1.0.0',
  publicComponents: ['MovimentacaoForm', 'MovimentacaoList'],
  publicHooks: [
    'useMovimentacaoCreate',
    'useMovimentacaoList',
    'useMovimentacaoHistorico',
    'useSaldoEstoque',
  ],
  publicServices: ['movimentacaoService'],
  dependencies: {
    internal: ['@/core/components', '@/core/lib'],
    external: ['react', 'react-hook-form', 'zod', '@tanstack/react-query', 'date-fns'],
    domains: [],
  },
  exports: {
    components: ['MovimentacaoForm', 'MovimentacaoList'],
    hooks: [
      'useMovimentacaoCreate',
      'useMovimentacaoList',
      'useMovimentacaoHistorico',
      'useSaldoEstoque',
    ],
    services: ['movimentacaoService'],
    types: [
      'Movimentacao',
      'CreateMovimentacaoDto',
      'MovimentacaoListParams',
      'MovimentacaoHistoricoParams',
      'MovimentacaoHistorico',
      'SaldoEstoque',
    ],
  },
} as const;

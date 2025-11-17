import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMovimentacaoCreate } from '../../hooks/useMovimentacaoCreate';
import type { MovimentacaoFormProps, MovimentacaoFormData } from './types';

const movimentacaoSchema = z.object({
  tipoMovimentacao: z.enum(['entrada', 'saida', 'ajuste', 'criacao', 'exclusao']),
  idProduto: z.number().int().positive({ message: 'Produto é obrigatório' }),
  quantidade: z.number().positive({ message: 'Quantidade deve ser um número positivo' }),
  motivo: z
    .string()
    .min(1, 'Motivo é obrigatório')
    .max(255, 'Motivo deve ter no máximo 255 caracteres'),
  observacao: z.string().max(1000, 'Observação deve ter no máximo 1000 caracteres').optional(),
  numeroNotaFiscal: z.string().length(9, 'Nota fiscal deve ter 9 dígitos').optional(),
  idLocalizacao: z.number().int().positive().optional(),
  custoUnitario: z.number().positive('Custo deve ser positivo').optional(),
  lote: z.string().max(50, 'Lote deve ter no máximo 50 caracteres').optional(),
  dataValidade: z.string().optional(),
});

/**
 * @component MovimentacaoForm
 * @summary Form for creating stock movements
 * @domain movimentacao
 * @type domain-component
 * @category form
 */
export const MovimentacaoForm = (props: MovimentacaoFormProps) => {
  const { onSuccess, onCancel } = props;

  const { create, isCreating } = useMovimentacaoCreate({
    onSuccess: (data) => {
      reset();
      onSuccess?.(data);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MovimentacaoFormData>({
    resolver: zodResolver(movimentacaoSchema),
    defaultValues: {
      tipoMovimentacao: 'entrada',
      idProduto: 0,
      quantidade: 0,
      motivo: '',
    },
  });

  const tipoMovimentacao = watch('tipoMovimentacao');

  const onSubmit = async (data: MovimentacaoFormData) => {
    const cleanData = {
      ...data,
      numeroNotaFiscal: data.numeroNotaFiscal || undefined,
      idLocalizacao: data.idLocalizacao || undefined,
      custoUnitario: data.custoUnitario || undefined,
      observacao: data.observacao || undefined,
      lote: data.lote || undefined,
      dataValidade: data.dataValidade || undefined,
    };

    await create(cleanData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="tipoMovimentacao" className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Movimentação *
        </label>
        <select
          id="tipoMovimentacao"
          {...register('tipoMovimentacao')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
          <option value="ajuste">Ajuste</option>
          <option value="criacao">Criação</option>
          <option value="exclusao">Exclusão</option>
        </select>
        {errors.tipoMovimentacao && (
          <p className="mt-1 text-sm text-red-600">{errors.tipoMovimentacao.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="idProduto" className="block text-sm font-medium text-gray-700 mb-1">
          ID do Produto *
        </label>
        <input
          id="idProduto"
          type="number"
          {...register('idProduto', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.idProduto && (
          <p className="mt-1 text-sm text-red-600">{errors.idProduto.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">
          Quantidade *
        </label>
        <input
          id="quantidade"
          type="number"
          step="0.01"
          {...register('quantidade', { valueAsNumber: true })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.quantidade && (
          <p className="mt-1 text-sm text-red-600">{errors.quantidade.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
          Motivo *
        </label>
        <input
          id="motivo"
          type="text"
          {...register('motivo')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.motivo && <p className="mt-1 text-sm text-red-600">{errors.motivo.message}</p>}
      </div>

      {(tipoMovimentacao === 'entrada' || tipoMovimentacao === 'criacao') && (
        <div>
          <label htmlFor="custoUnitario" className="block text-sm font-medium text-gray-700 mb-1">
            Custo Unitário *
          </label>
          <input
            id="custoUnitario"
            type="number"
            step="0.01"
            {...register('custoUnitario', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.custoUnitario && (
            <p className="mt-1 text-sm text-red-600">{errors.custoUnitario.message}</p>
          )}
        </div>
      )}

      {tipoMovimentacao === 'entrada' && (
        <div>
          <label
            htmlFor="numeroNotaFiscal"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Número da Nota Fiscal
          </label>
          <input
            id="numeroNotaFiscal"
            type="text"
            maxLength={9}
            {...register('numeroNotaFiscal')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.numeroNotaFiscal && (
            <p className="mt-1 text-sm text-red-600">{errors.numeroNotaFiscal.message}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="observacao" className="block text-sm font-medium text-gray-700 mb-1">
          Observação
        </label>
        <textarea
          id="observacao"
          rows={3}
          {...register('observacao')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.observacao && (
          <p className="mt-1 text-sm text-red-600">{errors.observacao.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="lote" className="block text-sm font-medium text-gray-700 mb-1">
          Lote
        </label>
        <input
          id="lote"
          type="text"
          maxLength={50}
          {...register('lote')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.lote && <p className="mt-1 text-sm text-red-600">{errors.lote.message}</p>}
      </div>

      <div>
        <label htmlFor="dataValidade" className="block text-sm font-medium text-gray-700 mb-1">
          Data de Validade
        </label>
        <input
          id="dataValidade"
          type="date"
          {...register('dataValidade')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.dataValidade && (
          <p className="mt-1 text-sm text-red-600">{errors.dataValidade.message}</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isCreating}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isCreating ? 'Registrando...' : 'Registrar Movimentação'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

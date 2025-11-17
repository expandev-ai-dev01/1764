import { format } from 'date-fns';
import { useMovimentacaoList } from '../../hooks/useMovimentacaoList';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';
import type { MovimentacaoListProps } from './types';

/**
 * @component MovimentacaoList
 * @summary Displays list of stock movements
 * @domain movimentacao
 * @type domain-component
 * @category display
 */
export const MovimentacaoList = (props: MovimentacaoListProps) => {
  const { filters } = props;
  const { movimentacoes, isLoading, error } = useMovimentacaoList({ filters });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Erro ao carregar movimentações: {error.message}</p>
      </div>
    );
  }

  if (movimentacoes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma movimentação encontrada</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data/Hora
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantidade
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Motivo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuário
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {movimentacoes.map((mov) => (
            <tr key={mov.idMovimentacao} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {format(new Date(mov.dataHora), 'dd/MM/yyyy HH:mm')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    mov.tipoMovimentacao === 'entrada'
                      ? 'bg-green-100 text-green-800'
                      : mov.tipoMovimentacao === 'saida'
                      ? 'bg-red-100 text-red-800'
                      : mov.tipoMovimentacao === 'ajuste'
                      ? 'bg-yellow-100 text-yellow-800'
                      : mov.tipoMovimentacao === 'criacao'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {mov.tipoMovimentacao}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {mov.nomeProduto || `ID: ${mov.idProduto}`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {mov.quantidade}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">{mov.motivo}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {mov.nomeUsuario || `ID: ${mov.idUsuario}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

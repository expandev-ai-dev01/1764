import { useState } from 'react';
import { MovimentacaoForm } from '@/domain/movimentacao/components/MovimentacaoForm';
import { MovimentacaoList } from '@/domain/movimentacao/components/MovimentacaoList';

/**
 * @page MovimentacoesPage
 * @summary Stock movements management page
 * @domain movimentacao
 * @type management-page
 * @category movimentacao-management
 */
export const MovimentacoesPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Movimentações de Estoque</h1>
        <p className="text-gray-600">Registre e consulte todas as movimentações do estoque</p>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Ocultar Formulário' : 'Nova Movimentação'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Registrar Movimentação</h2>
          <MovimentacaoForm
            onSuccess={() => {
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Histórico de Movimentações</h2>
        <MovimentacaoList />
      </div>
    </div>
  );
};

export default MovimentacoesPage;

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState, extractErrorMessage } from '../../components/ErrorState';
import { Spinner } from '../../components/Spinner';
import {
  createProductRequest,
  deleteProductRequest,
  fetchProducts,
  updateProductRequest,
  type Product,
  type ProductInput,
} from '../../api/products';
import { useAuth } from '../../auth/useAuth';
import { ProductCard } from './ProductCard';
import { ProductFormModal } from './ProductFormModal';

export function ProductsPage() {
  const { user } = useAuth();
  const canManage = user?.role === 'admin';
  const queryClient = useQueryClient();

  const [editingProduct, setEditingProduct] = useState<Product | 'new' | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const invalidateProducts = () => queryClient.invalidateQueries({ queryKey: ['products'] });

  const createMutation = useMutation({
    mutationFn: createProductRequest,
    onSuccess: invalidateProducts,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductInput }) => updateProductRequest(id, input),
    onSuccess: invalidateProducts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProductRequest,
    onSuccess: () => {
      invalidateProducts();
      setDeletingProduct(null);
    },
  });

  async function handleFormSubmit(input: ProductInput) {
    if (editingProduct === 'new') {
      await createMutation.mutateAsync(input);
    } else if (editingProduct) {
      await updateMutation.mutateAsync({ id: editingProduct._id, input });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Produtos</h1>
        {canManage && <Button onClick={() => setEditingProduct('new')}>Novo produto</Button>}
      </div>

      {isLoading && <Spinner label="Carregando produtos…" />}

      {isError && <ErrorState message={extractErrorMessage(error, 'Não foi possível carregar os produtos.')} />}

      {!isLoading && !isError && products?.length === 0 && (
        <EmptyState
          title="Nenhum produto ainda"
          description={
            canManage
              ? 'Crie seu primeiro produto para começar.'
              : 'Sua empresa ainda não cadastrou nenhum produto.'
          }
        />
      )}

      {!isLoading && !isError && products && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              canManage={canManage}
              onEdit={() => setEditingProduct(product)}
              onDelete={() => setDeletingProduct(product)}
            />
          ))}
        </div>
      )}

      {editingProduct && (
        <ProductFormModal
          product={editingProduct === 'new' ? undefined : editingProduct}
          onSubmit={handleFormSubmit}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {deletingProduct && (
        <ConfirmDialog
          title="Excluir produto"
          description={`Tem certeza que deseja excluir "${deletingProduct.name}"? Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          isConfirming={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate(deletingProduct._id)}
          onCancel={() => setDeletingProduct(null)}
        />
      )}
    </div>
  );
}

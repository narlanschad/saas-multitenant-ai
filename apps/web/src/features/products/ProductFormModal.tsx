import { useState, type FormEvent } from 'react';
import { Button } from '../../components/Button';
import { ErrorState, extractErrorMessage } from '../../components/ErrorState';
import { Input } from '../../components/Input';
import { Modal } from '../../components/Modal';
import type { Product, ProductInput } from '../../api/products';

interface ProductFormModalProps {
  product?: Product;
  onSubmit: (input: ProductInput) => Promise<void>;
  onClose: () => void;
}

export function ProductFormModal({ product, onSubmit, onClose }: ProductFormModalProps) {
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [category, setCategory] = useState(product?.category ?? '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? '');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit({ name, description, price: Number(price), category, imageUrl });
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err, 'Não foi possível salvar este produto.'));
      setIsSubmitting(false);
    }
  }

  return (
    <Modal title={product ? 'Editar produto' : 'Novo produto'} onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input label="Nome" required value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          label="Descrição"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Preço"
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input label="Categoria" required value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <Input
          label="URL da imagem"
          type="url"
          required
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        {error && <ErrorState message={error} />}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando…' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

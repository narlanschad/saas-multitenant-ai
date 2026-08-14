import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import type { Product } from '../../api/products';

const priceFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

interface ProductCardProps {
  product: Product;
  canManage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductCard({ product, canManage, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-40 w-full object-cover"
        loading="lazy"
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">{product.name}</h3>
          <Badge>{product.category}</Badge>
        </div>
        <p className="flex-1 text-sm text-slate-500 dark:text-slate-400">{product.description}</p>
        <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          {priceFormatter.format(product.price)}
        </p>
        {canManage && (
          <div className="mt-2 flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={onEdit}>
              Editar
            </Button>
            <Button variant="danger" className="flex-1" onClick={onDelete}>
              Excluir
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

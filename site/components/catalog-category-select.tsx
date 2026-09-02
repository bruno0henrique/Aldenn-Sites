'use client';

import { useQuery } from '@tanstack/react-query';
import { getCatalogCategories } from '@/lib/catalog';

export function CatalogCategorySelect({
  id,
  value,
  onChange,
  required = false,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['catalog-categories'],
    queryFn: getCatalogCategories,
  });
  const hasCurrent = categories.some((category) => category.name === value);

  return (
    <select
      id={id}
      value={value}
      required={required}
      disabled={isLoading}
      onChange={(event) => onChange(event.target.value)}
    >
      <option value="">
        {isLoading ? 'Carregando categorias...' : 'Selecione uma categoria'}
      </option>
      {value && !hasCurrent && <option value={value}>{value}</option>}
      {categories.map((category) => (
        <option key={category.id} value={category.name}>
          {category.name}
        </option>
      ))}
    </select>
  );
}

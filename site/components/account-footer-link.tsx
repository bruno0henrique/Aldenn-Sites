'use client';

import { useQuery } from '@tanstack/react-query';
import { getAccountSnapshot } from '@/lib/account';

export function AccountFooterLink() {
  const { data } = useQuery({
    queryKey: ['current-account'],
    queryFn: getAccountSnapshot,
  });

  return (
    <a href={data?.user ? '/conta' : '/admin/login'}>
      {data?.user ? 'Minha conta' : 'Entrar ou criar conta'}
    </a>
  );
}

'use client';
export const dynamic = 'force-dynamic';

import dynamic_import from 'next/dynamic';

const CheckoutContent = dynamic_import(() => import('./CheckoutContent'), { ssr: false });

export default function CheckoutPage() {
  return <CheckoutContent />;
}

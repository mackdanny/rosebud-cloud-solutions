import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  readonly children: React.ReactNode;
  readonly fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children : fallback}</>;
}

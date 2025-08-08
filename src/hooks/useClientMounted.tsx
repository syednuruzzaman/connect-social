"use client";

import { useState, useEffect } from 'react';

/**
 * Hook to prevent hydration mismatches for responsive components
 * Returns false during SSR and initial render, true after client-side hydration
 */
export function useClientMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * Component wrapper to prevent hydration mismatches for responsive elements
 */
interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const mounted = useClientMounted();
  
  if (!mounted) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

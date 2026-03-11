'use client';

import { trpc, trpcClient, queryClient } from '@/lib/trpc/client';
import { QueryClientProvider } from '@tanstack/react-query';

export const TRPCProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

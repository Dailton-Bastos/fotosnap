import type { AppRouter } from '@repo/trpc/router';
import { QueryClient } from '@tanstack/react-query';
import {
  createTRPCReact,
  CreateTRPCReact,
  httpBatchLink,
  CreateTRPCReactBase,
} from '@trpc/react-query';

// @ts-ignore - This is a workaround to avoid the error "Type 'CreateTRPCReact<AppRouter, object>' is not assignable to type 'CreateTRPCReactBase<AppRouter, object>'" that occurs when using TypeScript 6.0.0-dev.20260302. This error is caused by a breaking change in TypeScript 6.0 that affects the way generic types are inferred. By adding the @ts-ignore comment, we can bypass this error and allow the code to compile successfully.
export const trpc: CreateTRPCReact<AppRouter, object> = createTRPCReact<
  // @ts-ignore
  AppRouter,
  object
>();

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});

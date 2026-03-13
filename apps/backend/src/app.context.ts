import { Injectable } from '@nestjs/common';
import type { ContextOptions, TRPCContext } from 'nestjs-trpc-v2';

@Injectable()
export class AppContext implements TRPCContext {
  create(opts: ContextOptions): Record<string, unknown> {
    return {
      req: opts.req,
      res: opts.res,
    };
  }
}

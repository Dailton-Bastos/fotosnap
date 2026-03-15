import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc-v2';
import { AuthTrpcMiddleware } from '../auth/auth-trpc.middleware';
import {
  type CreateStoryInput,
  createStorySchema,
  storyGroupSchema,
} from '@repo/trpc/schemas';
import type { AppContext } from '../app-context.interface';
import { StoriesService } from './stories.service';
import z from 'zod';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class StoriesRouter {
  constructor(private readonly storiesService: StoriesService) {}

  @Mutation({ input: createStorySchema })
  async create(
    @Input() createStoryInput: CreateStoryInput,
    @Ctx() context: AppContext,
  ) {
    return this.storiesService.create(createStoryInput, context.user.id);
  }

  @Query({ output: z.array(storyGroupSchema) })
  async getStories() {
    return this.storiesService.getStories();
  }
}

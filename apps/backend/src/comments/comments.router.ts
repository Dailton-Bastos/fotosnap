import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc-v2';
import { z } from 'zod';
import {
  commentSchema,
  type CreateCommentInput,
  type GetCommentsInput,
  type DeleteCommentInput,
  createCommentSchema,
  getCommentsSchema,
  deleteCommentSchema,
} from '@repo/trpc/schemas';
import { CommentsService } from './comments.service';
import { AuthTrpcMiddleware } from '../auth/auth-trpc.middleware';
import type { AppContext } from '../app-context.interface';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class CommentsRouter {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation({ input: createCommentSchema })
  async create(
    @Input() createCommentInput: CreateCommentInput,
    @Ctx() ctx: AppContext,
  ) {
    return this.commentsService.create(createCommentInput, ctx.user.id);
  }

  @Query({ input: getCommentsSchema, output: z.array(commentSchema) })
  async findByPostId(@Input() getCommentsInput: GetCommentsInput) {
    return this.commentsService.findByPostId(getCommentsInput.postId);
  }

  @Mutation({ input: deleteCommentSchema })
  async delete(
    @Input() deleteCommentInput: DeleteCommentInput,
    @Ctx() ctx: AppContext,
  ) {
    return this.commentsService.delete(
      deleteCommentInput.commentId,
      ctx.user.id,
    );
  }
}

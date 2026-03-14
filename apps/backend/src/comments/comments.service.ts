import { Inject, Injectable } from '@nestjs/common';
import { CreateCommentInput } from '@repo/trpc/schemas';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { schema } from '../database/database.module';
import { comment } from './schema/schema';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(createCommentInput: CreateCommentInput, userId: string) {
    await this.database.insert(comment).values({
      userId,
      text: createCommentInput.text,
      postId: createCommentInput.postId,
      createdAt: new Date(),
    });
  }

  async findByPostId(postId: number) {
    const comments = await this.database.query.comment.findMany({
      where: eq(comment.postId, postId),
      with: { user: true },
    });

    return comments.map((comment) => ({
      id: comment.id,
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
      user: {
        username: comment.user.name,
        avatar: comment.user.image ?? '',
      },
    }));
  }

  async delete(commentId: number, userId: string) {
    await this.database
      .delete(comment)
      .where(and(eq(comment.id, commentId), eq(comment.userId, userId)));
  }
}

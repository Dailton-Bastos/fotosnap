import { Inject, Injectable } from '@nestjs/common';
import { CreatePostInput } from '@repo/trpc/schemas';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../database/database.module';
import { like, post } from './schemas/schema';
import { and, desc, eq } from 'drizzle-orm';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async create(createPostInput: CreatePostInput, userId: string) {
    await this.database.insert(post).values({
      userId,
      caption: createPostInput.caption,
      image: createPostInput.image,
      createdAt: new Date(),
    });
  }

  async findAll(userId: string, postUserId?: string) {
    const posts = await this.database.query.post.findMany({
      where: postUserId ? eq(post.userId, postUserId) : undefined,
      orderBy: [desc(post.createdAt)],
      with: { user: true, likes: true, comments: true },
    });

    return posts.map((post) => ({
      id: post.id,
      caption: post.caption,
      image: post.image,
      likes: post.likes.length,
      isLiked: post.likes.some((like) => like.userId === userId),
      comments: post.comments.length,
      timestamp: post.createdAt.toISOString(),
      user: {
        username: post.user.name,
        avatar: post.user.image ?? '',
      },
    }));
  }

  async likePost(postId: number, userId: string) {
    const existingLike = await this.database.query.like.findFirst({
      where: and(eq(like.postId, postId), eq(like.userId, userId)),
    });

    if (existingLike) {
      return this.database.delete(like).where(eq(like.id, existingLike.id));
    }

    await this.database.insert(like).values({
      postId,
      userId,
    });
  }
}

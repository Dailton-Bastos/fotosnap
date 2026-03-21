import { Inject, Injectable } from '@nestjs/common';
import { CreatePostInput, Post } from '@repo/trpc/schemas';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../database/database.module';
import { like, post, savedPost } from './schemas/schema';
import { and, desc, eq, inArray } from 'drizzle-orm';
import { follow } from 'src/auth/schema';

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

  async findAll(userId: string, postUserId?: string): Promise<Post[]> {
    const posts = await this.database.query.post.findMany({
      where: postUserId
        ? eq(post.userId, postUserId)
        : inArray(post.userId, await this.getFollowedUserIds(userId)),
      orderBy: [desc(post.createdAt)],
      with: { user: true, likes: true, comments: true },
    });

    const savedPosts = await this.getSavedPosts(userId);

    return posts.map((post) => ({
      id: post.id,
      caption: post.caption,
      image: post.image,
      likes: post.likes.length,
      isLiked: post.likes.some((like) => like.userId === userId),
      isSaved: savedPosts.map((savedPost) => savedPost.id).includes(post.id),
      comments: post.comments.length,
      timestamp: post.createdAt.toISOString(),
      user: {
        id: post.user.id,
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

  async savePost(postId: number, userId: string) {
    const existingSavedPost = await this.database.query.savedPost.findFirst({
      where: and(eq(savedPost.postId, postId), eq(savedPost.userId, userId)),
    });

    if (existingSavedPost) {
      return this.database
        .delete(savedPost)
        .where(eq(savedPost.id, existingSavedPost.id));
    }

    await this.database.insert(savedPost).values({
      postId,
      userId,
    });
  }

  async getSavedPosts(userId: string): Promise<Post[]> {
    const savedPosts = await this.database.query.savedPost.findMany({
      where: eq(savedPost.userId, userId),
      orderBy: [desc(savedPost.createdAt)],
      with: { post: { with: { user: true, likes: true, comments: true } } },
    });

    return savedPosts.map((savedPost) => ({
      id: savedPost.post.id,
      caption: savedPost.post.caption,
      image: savedPost.post.image,
      likes: savedPost.post.likes.length,
      isLiked: savedPost.post.likes.some((like) => like.userId === userId),
      comments: savedPost.post.comments.length,
      timestamp: savedPost.post.createdAt.toISOString(),
      isSaved: true,
      user: {
        id: savedPost.post.user.id,
        username: savedPost.post.user.name,
        avatar: savedPost.post.user.image ?? '',
      },
    }));
  }

  private async getFollowedUserIds(userId: string): Promise<string[]> {
    const following = await this.database
      .select({ id: follow.followingId })
      .from(follow)
      .where(eq(follow.followerId, userId));

    return [userId, ...following.map((f) => f.id)];
  }
}

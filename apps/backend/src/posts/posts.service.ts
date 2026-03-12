import { Inject, Injectable } from '@nestjs/common';
import { CreatePostInput, Post } from './schemas/trpc.schema';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from '../database/database.module';
import { post } from './schemas/schema';
import { UsersService } from '../auth/users/users.service';
import { desc } from 'drizzle-orm';

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
    private readonly userService: UsersService,
  ) {}

  async create(createPostInput: CreatePostInput, userId: string) {
    const [newPost] = await this.database
      .insert(post)
      .values({
        userId,
        caption: createPostInput.caption,
        image: createPostInput.image,
        likes: 0,
        createdAt: new Date(),
      })
      .returning();

    return this.formatPostResponse(newPost, userId);
  }

  async findAll() {
    const posts = await this.database.query.post.findMany({
      orderBy: [desc(post.createdAt)],
      with: { user: true },
    });

    return posts.map((post) => ({
      id: post.id,
      caption: post.caption,
      image: post.image,
      likes: post.likes,
      comments: 0,
      timestamp: post.createdAt.toISOString(),
      user: {
        username: post.user.name,
        avatar: post.user.image ?? '',
      },
    }));
  }

  private async formatPostResponse(
    savedPost: typeof post.$inferSelect,
    userId: string,
  ): Promise<Post> {
    const user = await this.userService.findById(userId);

    return {
      id: savedPost.id,
      caption: savedPost.caption,
      image: savedPost.image,
      likes: savedPost.likes,
      comments: 0,
      timestamp: savedPost.createdAt.toISOString(),
      user: {
        username: user.name,
        avatar: '',
      },
    };
  }
}

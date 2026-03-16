import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, ne, notInArray, sql } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database-connection';
import { schema } from '../../database/database.module';
import { follow, user } from '../schema';
import { post } from '../../posts/schemas/schema';
import type { UpdateProfileInput, UserProfile } from '@repo/trpc/schemas';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async findById(userId: string) {
    const foundUser = await this.database.query.user.findFirst({
      where: eq(user?.id, userId),
    });

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }
    return foundUser;
  }

  async follow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new Error('You cannot follow yourself');
    }

    const existingFollow = await this.database.query.follow.findFirst({
      where: and(
        eq(follow?.followerId, followerId),
        eq(follow?.followingId, followingId),
      ),
    });

    if (existingFollow) {
      throw new Error('You are already following this user');
    }

    await this.database.insert(follow).values({
      followerId,
      followingId,
    });
  }

  async unfollow(followerId: string, followingId: string) {
    const existingFollow = await this.database.query.follow.findFirst({
      where: and(
        eq(follow?.followerId, followerId),
        eq(follow?.followingId, followingId),
      ),
    });

    if (!existingFollow) {
      throw new Error('You are not following this user');
    }

    await this.database
      .delete(follow)
      .where(
        and(
          eq(follow.followerId, followerId),
          eq(follow.followingId, followingId),
        ),
      );
  }

  async getFollowers(userId: string) {
    return this.database.query.follow.findMany({
      where: eq(follow?.followingId, userId),
      with: {
        follower: { columns: { id: true, name: true } },
      },
    });
  }

  async getFollowing(userId: string) {
    return this.database.query.follow.findMany({
      where: eq(follow?.followerId, userId),
      with: {
        following: { columns: { id: true, name: true } },
      },
    });
  }

  async getSuggestedUsers(userId: string) {
    const followingIds = await this.database.query.follow.findMany({
      where: eq(follow.followerId, userId),
      columns: { followingId: true },
    });

    return this.database.query.user.findMany({
      where: and(
        ne(user?.id, userId),
        followingIds.length > 0
          ? notInArray(
              user?.id,
              followingIds.map((f) => f.followingId),
            )
          : undefined,
      ),
      columns: { id: true, name: true },
      limit: 5,
    });
  }

  async getUserProfile(
    userId: string,
    currentUserId: string,
  ): Promise<UserProfile | null> {
    const result = await this.database
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        bio: user.bio,
        website: user.website,
        followersCount: sql<number>`(
        SELECT COUNT(*)::int FROM ${follow} f WHERE f.${follow.followingId} = ${user}.${user.id}
      )`,
        followingCount: sql<number>`(
        SELECT COUNT(*)::int FROM ${follow} f WHERE f.${follow.followerId} = ${user}.${user.id}
      )`,
        postCount: sql<number>`(
        SELECT COUNT(*)::int FROM ${post} p WHERE p.${post.userId} = ${user}.${user.id}
      )`,
        isFollowing: sql<boolean>`EXISTS (
        SELECT 1 FROM ${follow} f
        WHERE f.${follow.followerId} = ${currentUserId}
          AND f.${follow.followingId} = ${user}.${user.id}
      )`,
      })
      .from(user)
      .where(eq(user.id, userId));

    return result[0] || null;
  }

  async updateProfile(userId: string, profileData: UpdateProfileInput) {
    await this.database
      .update(user)
      .set({
        name: profileData.name,
        bio: profileData.bio,
        website: profileData.website,
      })
      .where(eq(user.id, userId));
  }
}

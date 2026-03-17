import {
  Ctx,
  Input,
  Mutation,
  Query,
  Router,
  UseMiddlewares,
} from 'nestjs-trpc-v2';
import { AuthTrpcMiddleware } from '../auth-trpc.middleware';
import {
  type UpdateProfileInput,
  type UserIdInput,
  updateProfileSchema,
  userIdSchema,
  userProfileSchema,
  userSchema,
} from '@repo/trpc/schemas';
import { UsersService } from './users.service';
import type { AppContext } from '../../app-context.interface';
import z from 'zod';

@Router()
@UseMiddlewares(AuthTrpcMiddleware)
export class UsersRouter {
  constructor(private readonly usersService: UsersService) {}

  @Mutation({ input: userIdSchema })
  async follow(@Input() input: UserIdInput, @Ctx() ctx: AppContext) {
    return this.usersService.follow(ctx.user.id, input.userId);
  }

  @Mutation({ input: userIdSchema })
  async unfollow(@Input() input: UserIdInput, @Ctx() ctx: AppContext) {
    return this.usersService.unfollow(ctx.user.id, input.userId);
  }

  @Query({ input: userIdSchema, output: z.array(userSchema) })
  async getFollowers(@Input() input: UserIdInput) {
    return this.usersService.getFollowers(input.userId);
  }

  @Query({ input: userIdSchema, output: z.array(userSchema) })
  async getFollowing(@Input() input: UserIdInput) {
    return this.usersService.getFollowing(input.userId);
  }

  @Query({ output: z.array(userSchema) })
  async getSuggestedUsers(@Ctx() ctx: AppContext) {
    return this.usersService.getSuggestedUsers(ctx.user.id);
  }

  @Mutation({ input: updateProfileSchema })
  async updateProfile(
    @Input() input: UpdateProfileInput,
    @Ctx() ctx: AppContext,
  ) {
    return this.usersService.updateProfile(ctx.user.id, input);
  }

  @Query({ input: userIdSchema, output: userProfileSchema })
  async getUserProfile(@Input() input: UserIdInput, @Ctx() ctx: AppContext) {
    return this.usersService.getUserProfile(input.userId, ctx.user.id);
  }
}

import { relations } from 'drizzle-orm';
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { user } from '../../auth/schema';
import { comment } from '../../comments/schema/schema';

export const post = pgTable('post', {
  id: serial('id').primaryKey(),
  image: text('image').notNull(),
  caption: text('caption').notNull(),
  createdAt: timestamp('created_at').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const postRelations = relations(post, ({ one, many }) => ({
  user: one(user, {
    fields: [post.userId],
    references: [user.id],
  }),
  likes: many(like),
  comments: many(comment),
}));

export const like = pgTable('like', {
  id: serial('id').primaryKey(),
  postId: integer('post_id')
    .notNull()
    .references(() => post.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const likeRelations = relations(like, ({ one }) => ({
  post: one(post, {
    fields: [like.postId],
    references: [post.id],
  }),
  user: one(user, {
    fields: [like.userId],
    references: [user.id],
  }),
}));

export const savedPost = pgTable('saved_post', {
  id: serial('id').primaryKey(),
  postId: integer('post_id')
    .notNull()
    .references(() => post.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
});

export const savedPostRelations = relations(savedPost, ({ one }) => ({
  post: one(post, {
    fields: [savedPost.postId],
    references: [post.id],
  }),
  user: one(user, {
    fields: [savedPost.userId],
    references: [user.id],
  }),
}));

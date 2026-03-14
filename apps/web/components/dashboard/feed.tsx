'use client';

import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, User } from 'lucide-react';
import { getImageUrl } from '@/lib/image';
import type { Post } from '@repo/trpc/schemas';
import { useState } from 'react';
import { PostComments } from './post-comments';

interface FeedProps {
  posts: Post[];
  onLikePost: (postId: number) => void;
  onAddComment: (postId: number, text: string) => void;
  onDeleteComment: (commentId: number) => void;
}

export const Feed = ({
  posts,
  onLikePost,
  onAddComment,
  onDeleteComment,
}: FeedProps) => {
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set()
  );

  const toggleComments = (postId: number) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              {getImageUrl(post.user.avatar) ? (
                <Image
                  src={getImageUrl(post.user.avatar)}
                  alt={post.user.username}
                  width={64}
                  height={64}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
              )}

              <span className="font-semibold text-sm">
                {post.user.username}
              </span>
            </div>
          </div>

          <div className="aspect-square relative">
            <Image
              src={getImageUrl(post.image)}
              alt={post.caption}
              className="object-cover"
              fill
            />
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto"
                  onClick={() => onLikePost(post.id)}
                >
                  <Heart
                    className={`w-6 h-6 ${post.isLiked ? 'text-red-500 fill-red-500' : 'text-foreground'}`}
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-auto"
                  onClick={() => toggleComments(post.id)}
                >
                  <MessageCircle
                    className={`w-6 h-6 ${expandedComments.has(post.id) ? 'text-primary fill-primary' : 'text-foreground'}`}
                  />
                </Button>
              </div>
            </div>

            <div className="text-sm font-semibold">{post.likes} likes</div>

            <div className="text-sm">
              <span className="font-semibold">{post.user.username}</span>{' '}
              {post.caption}
            </div>

            {post.comments > 0 && (
              <Button
                variant="link"
                size="sm"
                className="text-sm text-muted-foreground p-0"
              >
                View all {post.comments} comments
              </Button>
            )}

            <div className="text-xs text-muted-foreground uppercase">
              {new Date(post.timestamp).toLocaleDateString()}
            </div>

            {expandedComments.has(post.id) && (
              <div className="pt-4 border-t">
                <PostComments
                  postId={post.id}
                  onAddComment={onAddComment}
                  onDeleteComment={onDeleteComment}
                />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

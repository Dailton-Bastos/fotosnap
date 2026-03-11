'use client';

import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, User } from 'lucide-react';

interface Post {
  id: number;
  user: {
    username: string;
    avatar: string | null;
  };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
}

interface FeedProps {
  posts: Post[];
}

export const Feed = ({ posts }: FeedProps) => {
  const getImageUrl = (imagePath: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${imagePath}`;
  };

  const getAvatarUrl = (avatarPath: string | null) => {
    if (!avatarPath) {
      return '';
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/images/${avatarPath}`;
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              {getAvatarUrl(post.user.avatar) ? (
                <Image
                  src={getAvatarUrl(post.user.avatar)}
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
                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  <Heart className="w-6 h-6 text-foreground" />
                </Button>

                <Button variant="ghost" size="sm" className="p-0 h-auto">
                  <MessageCircle className="w-6 h-6 text-foreground" />
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
              {post.timestamp}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

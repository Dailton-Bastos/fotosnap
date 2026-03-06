'use client';

import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle } from 'lucide-react';

interface Post {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      username: 'john_doe',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    },
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=600&fit=crop',
    caption: 'Enjoying the sunny day!',
    likes: 120,
    comments: 15,
    timestamp: '6 mins ago',
  },
  {
    id: '2',
    user: {
      username: 'jane_smith',
      avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    },
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=600&fit=crop',
    caption: 'Had a great weekend with friends!',
    likes: 200,
    comments: 30,
    timestamp: '1 hour ago',
  },
  {
    id: '3',
    user: {
      username: 'alice_wonder',
      avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
    },
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&h=600&fit=crop',
    caption: 'Loving this new recipe I tried!',
    likes: 80,
    comments: 10,
    timestamp: '2 hours ago',
  },
];

export const Feed = () => {
  return (
    <div className="space-y-6">
      {mockPosts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Image
                src={post.user.avatar}
                alt={post.user.username}
                width={64}
                height={64}
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold text-sm">
                {post.user.username}
              </span>
            </div>
          </div>

          <div className="aspect-square relative">
            <Image
              src={post.image}
              alt={post.caption}
              className="object-cover w-full h-full"
              width={600}
              height={600}
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

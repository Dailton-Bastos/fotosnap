'use cliuent';

import { getImageUrl } from '@/lib/image';
import type { Post } from '@repo/trpc/schemas';
import { Heart, MessageCircle } from 'lucide-react';
import Image from 'next/image';

interface PostsGridProps {
  posts: Post[];
  onPostClick: (post: Post) => void;
}

export const PostsGrid = ({ posts, onPostClick }: PostsGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="aspect-square relative group cursor-pointer overflow-hidden rounded-sm"
          onClick={() => onPostClick(post)}
        >
          <Image
            src={getImageUrl(post.image)}
            alt={post.caption}
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-6">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span className="font-semibold">{post.likes}</span>
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">{post.comments}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

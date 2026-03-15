'use client';

import { Feed } from '@/components/dashboard/feed';
import { PhotoUpload } from '@/components/dashboard/photo-upload';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Stories } from '@/components/dashboard/stories';
import { Fab } from '@/components/ui/fab';
import { trpc } from '@/lib/trpc/client';
import { Plus } from 'lucide-react';
import React from 'react';

function Home() {
  const [showUploadModal, setShowUploadModal] = React.useState(false);

  const utils = trpc.useUtils();

  const posts = trpc.postsRouter.findAll.useQuery();
  const stories = trpc.storiesRouter.getStories.useQuery();

  const createPost = trpc.postsRouter.create.useMutation({
    onSuccess: () => utils.postsRouter.findAll.invalidate(),
  });

  const likePost = trpc.postsRouter.likePost.useMutation({
    onMutate: async ({ postId }) => {
      utils.postsRouter.findAll.setData(undefined, (old) => {
        if (!old) return old;

        return old.map((post) => {
          if (post.id === postId) {
            const isLiked = post.isLiked ?? false;
            const likes = isLiked ? post.likes - 1 : post.likes + 1;

            return { ...post, likes, isLiked: !isLiked };
          }
          return post;
        });
      });
    },
  });

  const handleCreatePost = async (file: File, caption: string) => {
    const formData = new FormData();
    formData.append('image', file);

    const uploadResponse = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image');
    }

    const { filename } = await uploadResponse.json();

    await createPost.mutateAsync({
      image: filename,
      caption,
    });
  };

  const createComment = trpc.commentsRouter.create.useMutation({
    onSuccess: (_, variables) => {
      utils.commentsRouter.findByPostId.invalidate({
        postId: variables.postId,
      });

      utils.postsRouter.findAll.setData(undefined, (old) => {
        if (!old) return old;

        return old.map((post) => {
          if (post.id === variables.postId) {
            return { ...post, comments: post.comments + 1 };
          }
          return post;
        });
      });
    },
  });

  const deleteComment = trpc.commentsRouter.delete.useMutation({
    onSuccess: () => {
      utils.commentsRouter.findByPostId.invalidate();
      utils.postsRouter.findAll.invalidate();
    },
  });

  const createStory = trpc.storiesRouter.create.useMutation({
    onSuccess: () => utils.storiesRouter.getStories.invalidate(),
  });

  const handleStoruyUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const uploadResponse = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image');
    }

    const { filename } = await uploadResponse.json();

    await createStory.mutateAsync({
      image: filename,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Stories
              storyGroups={stories.data ?? []}
              onStoryUpload={handleStoruyUpload}
            />
            <Feed
              posts={posts.data ?? []}
              onLikePost={(postId) => likePost.mutate({ postId })}
              onAddComment={(postId, text) =>
                createComment.mutate({ postId, text })
              }
              onDeleteComment={(commentId) =>
                deleteComment.mutate({ commentId })
              }
            />
          </div>
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <Sidebar />
          </div>
        </div>
      </div>
      <PhotoUpload
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        onSubmit={handleCreatePost}
      />

      <Fab onClick={() => setShowUploadModal(true)}>
        <Plus className="h-6 w-6" />
      </Fab>
    </div>
  );
}

export default Home;

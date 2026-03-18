'use client';

import { PostModal } from '@/components/users/post-modal';
import { ProfileHeader } from '@/components/users/profile-header';
import { ProfileNavigation } from '@/components/users/profile-navigation';
import { ProfileTabs } from '@/components/users/profile-tabs';
import { trpc } from '@/lib/trpc/client';
import type { Post } from '@repo/trpc/schemas';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function ProfilePage() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [followersFollowingModal, setFollowersFollowingModal] = useState<{
    type: 'followers' | 'following';
    isOpen: boolean;
  }>({ type: 'followers', isOpen: false });

  const params = useParams();
  const userId = params.userId as string;

  const utils = trpc.useUtils();

  const { data: profile, isLoading } = trpc.usersRouter.getUserProfile.useQuery(
    {
      userId,
    }
  );

  const { data: posts = [] } = trpc.postsRouter.findAll.useQuery({ userId });

  const unFollowMutation = trpc.usersRouter.unfollow.useMutation({
    onSuccess: () => utils.usersRouter.getUserProfile.invalidate({ userId }),
  });

  const followMutation = trpc.usersRouter.follow.useMutation({
    onSuccess: () => utils.usersRouter.getUserProfile.invalidate({ userId }),
  });

  const handleFollowToggle = () => {
    if (!profile) return;

    if (profile?.isFollowing) {
      unFollowMutation.mutate({ userId: profile.id });
    } else {
      followMutation.mutate({ userId: profile.id });
    }
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setIsPostModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">User not found</h1>
          <p className="text-muted-foreground">This user doesn't exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfileNavigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <ProfileHeader
          profile={profile}
          onFollowToggle={handleFollowToggle}
          onEditProfile={() => setIsEditProfileOpen(true)}
          onOpenFollowers={() =>
            setFollowersFollowingModal({ type: 'followers', isOpen: true })
          }
          onOpenFollowing={() =>
            setFollowersFollowingModal({ type: 'following', isOpen: true })
          }
          isFollowingLoading={
            followMutation.isPending || unFollowMutation.isPending
          }
        />

        <ProfileTabs
          userPosts={posts}
          savedPosts={[]}
          name={profile.name}
          onPostClick={handlePostClick}
        />
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          open={isPostModalOpen}
          onOpenChange={setIsPostModalOpen}
        />
      )}
    </div>
  );
}

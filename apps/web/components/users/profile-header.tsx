import { getImageUrl } from '@/lib/image';
import type { UserProfile } from '@repo/trpc/schemas';
import { Edit, Globe, Settings, User } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ProfileHeaderProps {
  profile: UserProfile;
  onFollowToggle: () => void;
  onEditProfile: () => void;
  onOpenFollowers: () => void;
  onOpenFollowing: () => void;
  isFollowingLoading: boolean;
}

export const ProfileHeader = ({
  profile,
  onFollowToggle,
  onEditProfile,
  onOpenFollowers,
  onOpenFollowing,
  isFollowingLoading,
}: ProfileHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="shrink-0">
          {profile?.image ? (
            <Image
              src={getImageUrl(profile.image)}
              alt={`${profile.name}'s profile picture`}
              width={150}
              height={150}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover flex items-center justify-center border-2"
            />
          ) : (
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-muted flex items-center justify-center border-2">
              <User className="w-16 h-16 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="text-2xl font-normal">{profile.name}</h1>
            <div className="flex gap-2">
              <Button
                variant={profile.isFollowing ? 'outline' : 'default'}
                onClick={onFollowToggle}
                disabled={isFollowingLoading}
              >
                {profile.isFollowing ? 'Following' : 'Follow'}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size={'icon'}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onEditProfile}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex gap-8 text-sm">
            <div>
              <span className="font-semibold">{profile.postCount}</span>{' '}
              <span className="text-muted-foreground">posts</span>
            </div>

            <Button
              variant={'ghost'}
              onClick={onOpenFollowers}
              className="h-auto p-0"
            >
              <span className="font-semibold">{profile.followersCount}</span>{' '}
              <span className="text-muted-foreground">followers</span>
            </Button>

            <Button
              variant={'ghost'}
              onClick={onOpenFollowing}
              className="h-auto p-0"
            >
              <span className="font-semibold">{profile.followingCount}</span>{' '}
              <span className="text-muted-foreground">following</span>
            </Button>
          </div>

          <div className="space-y-1">
            {profile.bio && (
              <p className="text-sm whitespace-pre-wrap">{profile.bio}</p>
            )}

            {profile.website && (
              <a
                href={profile.website}
                className="text-sm text-primary hover:underline flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="h-3 w-3" />
                {profile.website}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

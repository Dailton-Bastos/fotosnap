'use client';

import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';

interface SuggestedUser {
  id: string;
  username: string;
  avatar: string;
  followedBy: string;
}

const suggestedUsers: SuggestedUser[] = [
  {
    id: '1',
    username: 'john_doe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    followedBy: 'alice_smith',
  },
  {
    id: '2',
    username: 'jane_doe',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    followedBy: 'bob_jones',
  },
  {
    id: '3',
    username: 'michael_smith',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    followedBy: 'charlie_brown',
  },
];

export const Sidebar = () => {
  const { data: session } = authClient.useSession();

  const router = useRouter();

  const handleLogOut = async () => {
    await authClient.signOut();

    return router.push('/login');
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Image
            src="https://randomuser.me/api/portraits/women/2.jpg"
            alt="Your profile picture"
            width={60}
            height={60}
            className="w-14 h-14 rounded-full"
          />

          <div className="flex-1 min-w-0">
            <div className="font-semibold truncate">{session?.user?.email}</div>
            <div className="text-sm text-muted-foreground truncate">
              {session?.user?.name}
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              title="Sign Out"
              onClick={handleLogOut}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-muted-foreground">
            Suggestions for you
          </h3>
        </div>

        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center space-x-3">
              <Image
                src={user.avatar}
                alt={`${user.username}'s profile picture`}
                width={40}
                height={40}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{user.username}</div>
                {user.followedBy && (
                  <div className="text-xs text-muted-foreground">
                    Followed by {user.followedBy}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/90 text-xs"
              >
                Follow
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

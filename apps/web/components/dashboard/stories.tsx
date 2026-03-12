import { Card } from '@/components/ui/card';
import { authClient } from '@/lib/auth/client';
import { getImageUrl } from '@/lib/image';
import { User } from 'lucide-react';
import Image from 'next/image';

interface Story {
  id: string;
  username: string;
  avatar: string;
}

const mockStories: Story[] = [
  {
    id: '2',
    username: 'jane_smith',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '3',
    username: 'alice_wonder',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
  {
    id: '4',
    username: 'bob_builder',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    id: '5',
    username: 'charlie_brown',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
];

export const Stories = () => {
  const { data: session } = authClient.useSession();

  return (
    <Card className="p-4">
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
        <div className="flex flex-col items-center space-y-1 shrink-0">
          <div className="relative">
            <div className="p-0.5 rounded-full bg-linear-to-tr from-yellow-400 to-fuchsia-600 bg-gray-200">
              {session?.user?.image ? (
                <Image
                  src={getImageUrl(session?.user?.image)}
                  alt="Your profile picture"
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          <span
            className="text-sm text-center w-16 truncate"
            title="Your Story"
          >
            Your Story
          </span>
        </div>
        {mockStories.map((story) => (
          <div
            key={story.id}
            className="flex flex-col items-center space-y-1 shrink-0"
          >
            <div className="relative">
              <div className="p-0.5 rounded-full bg-linear-to-tr from-yellow-400 to-fuchsia-600 bg-gray-200">
                <Image
                  src={story.avatar}
                  alt={story.username}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white"
                />
              </div>
            </div>

            <span
              className="text-sm text-center w-16 truncate"
              title={story.username}
            >
              {story.username}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

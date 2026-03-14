import { getImageUrl } from '@/lib/image';
import type { Comment } from '@repo/trpc/schemas';
import { Trash, User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '../ui/button';

interface CommentsProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
  onDeleteComment: (commentId: number) => void;
}

export const Comments = ({
  comments = [],
  onAddComment,
  onDeleteComment,
}: CommentsProps) => {
  const [commentText, setCommentText] = useState('');

  const handleAddComment = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (commentText.trim()) {
      onAddComment(commentText.trim());
      setCommentText('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-center space-x-2">
            {getImageUrl(comment.user.avatar) ? (
              <Image
                src={getImageUrl(comment.user.avatar)}
                width={32}
                height={32}
                alt={comment.user.username}
                className="w-8 h-8 rounded-full shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-sm">
                    {comment.user.username}
                  </span>
                  <p className="text-sm wrap-break-word">{comment.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(comment.createdAt).toLocaleString('pt-BR', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1 h-auto shrink-0"
                  onClick={() => onDeleteComment(comment.id)}
                >
                  <Trash className="w-3 h-3 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}

        <form
          onSubmit={handleAddComment}
          className="flex items-center space-x-2"
        >
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 border rounded-md resize-none focus:outline-none"
          />
          <Button type="submit" disabled={!commentText.trim()}>
            Post
          </Button>
        </form>
      </div>
    </div>
  );
};

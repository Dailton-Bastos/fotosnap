'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { FileUpload } from '@/components/ui/file-upload-area';
import { getImageUrl } from '@/lib/image';

interface AvatarUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: File) => Promise<void>;
  currentAvatar?: string | null;
}

export const AvatarUpload = ({
  open,
  onOpenChange,
  onSubmit,
  currentAvatar,
}: AvatarUploadProps) => {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      await onSubmit(selectedFile);

      clearSelection();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating avatar:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>

        {!preview ? (
          <div className="space-y-4">
            {currentAvatar && (
              <div className="flex justify-center">
                <Image
                  src={getImageUrl(currentAvatar)}
                  alt="Current Avatar"
                  width={64}
                  height={64}
                  className="rounded-full object-cover w-24 h-24 border-2 border-muted"
                />
              </div>
            )}
            <FileUpload onFileSelect={handleFileSelect} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src={preview}
                  alt="Preview"
                  width={64}
                  height={64}
                  className="w-32 h-32 rounded-full object-cover border-2 border-primary"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -top-2 -right-2 bg-black/50 text-white hover:bg-black/70 rounded-full p-2"
                  onClick={clearSelection}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={clearSelection}
                disabled={isUploading}
              >
                Back
              </Button>

              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload avatar'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

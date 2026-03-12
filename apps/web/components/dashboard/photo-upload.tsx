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
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/ui/file-upload-area';

interface PhotoUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: File, caption: string) => Promise<void>;
}

export const PhotoUpload = ({
  open,
  onOpenChange,
  onSubmit,
}: PhotoUploadProps) => {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [caption, setCaption] = React.useState('');

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
    setCaption('');
  };

  const handleUpload = async () => {
    if (!selectedFile || !caption.trim()) return;

    setIsUploading(true);

    try {
      await onSubmit(selectedFile, caption.trim());

      clearSelection();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new post</DialogTitle>
        </DialogHeader>

        {!preview ? (
          <FileUpload onFileSelect={handleFileSelect} />
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={preview}
                alt="Preview"
                width={64}
                height={64}
                className="rounded-lg object-cover w-full h-64"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
                onClick={clearSelection}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Write a caption..."
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={clearSelection}
                disabled={isUploading}
              >
                Back
              </Button>

              <Button
                onClick={handleUpload}
                disabled={isUploading || !caption.trim()}
              >
                Share
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

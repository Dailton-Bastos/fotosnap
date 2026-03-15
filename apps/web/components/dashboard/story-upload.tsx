import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FileUpload } from '@/components/ui/file-upload-area';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { X } from 'lucide-react';

interface StoryUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: File) => Promise<void>;
}

export const StoryUpload = ({
  open,
  onOpenChange,
  onSubmit,
}: StoryUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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
      console.error('Error creating post:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to your story</DialogTitle>
        </DialogHeader>

        {!preview ? (
          <FileUpload onFileSelect={handleFileSelect} />
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={preview}
                alt="Story preview"
                width={64}
                height={64}
                className="w-full h-95 object-cover rounded-lg"
              />
              <Button
                onClick={clearSelection}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </Button>
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
                {isUploading ? 'Uploading...' : 'Share to Story'}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

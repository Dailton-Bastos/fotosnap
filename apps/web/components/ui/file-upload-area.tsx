'use client';

import { Image as ImageIcon, UploadIcon } from 'lucide-react';
import React from 'react';
import { Button } from './button';
import { Input } from './input';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];

    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.type.startsWith('image/')) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <UploadIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />

      <p className="text-lg font-medium mb-2">Drag and drop a photo here</p>
      <p className="text-sm text-muted-foreground mb-4">
        or click to select from your computer
      </p>

      <Button variant="outline">
        <ImageIcon className="w-4 h-4 mr-2" />
        Select from your computer
      </Button>

      <Input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        ref={fileInputRef}
      />
    </div>
  );
};

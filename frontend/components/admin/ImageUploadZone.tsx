'use client';

import { useRef, useState, useCallback, DragEvent, ChangeEvent } from 'react';
import {
  filterAcceptedImageFiles,
  createImagePreviews,
  MAX_LISTING_IMAGES,
} from '@/lib/listingImages';

interface ImageUploadZoneProps {
  files: File[];
  previews: string[];
  onFilesChange: (files: File[], previews: string[]) => void;
  label?: string;
  maxFiles?: number;
}

export default function ImageUploadZone({
  files,
  previews,
  onFilesChange,
  label = 'Fotoğraflar',
  maxFiles = MAX_LISTING_IMAGES,
}: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = useCallback(
    async (incoming: FileList | File[]) => {
      const accepted = filterAcceptedImageFiles(incoming);
      if (accepted.length === 0) return;

      const remainingSlots = maxFiles - files.length;
      if (remainingSlots <= 0) {
        alert(`En fazla ${maxFiles} fotoğraf ekleyebilirsiniz.`);
        return;
      }

      const filesToAdd = accepted.slice(0, remainingSlots);
      if (filesToAdd.length < accepted.length) {
        alert(`En fazla ${maxFiles} fotoğraf ekleyebilirsiniz. ${filesToAdd.length} fotoğraf eklendi.`);
      }

      const newFiles = [...files, ...filesToAdd];
      const newPreviews = await createImagePreviews(filesToAdd);
      onFilesChange(newFiles, [...previews, ...newPreviews]);
    },
    [files, previews, onFilesChange, maxFiles],
  );

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    onFilesChange(
      files.filter((_, i) => i !== index),
      previews.filter((_, i) => i !== index),
    );
  };

  return (
    <div>
      <label className="block text-sm font-medium text-luxury-black mb-2">{label}</label>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-luxury-black bg-luxury-light-gray'
            : 'border-luxury-silver hover:border-luxury-black hover:bg-luxury-light-gray/50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
        <p className="text-luxury-black font-medium mb-1">
          Fotoğrafları sürükleyip bırakın veya tıklayarak seçin
        </p>
        <p className="text-sm text-luxury-medium-gray">
          Birden fazla fotoğraf seçebilirsiniz (JPG, PNG, GIF, WebP — dosya başına max 10MB)
        </p>
        {files.length > 0 && (
          <p className="text-sm text-luxury-black mt-2">
            {files.length} fotoğraf seçildi
            {maxFiles ? ` / ${maxFiles} max` : ''}
          </p>
        )}
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={`${preview}-${index}`} className="relative">
              <img
                src={preview}
                alt={`Önizleme ${index + 1}`}
                className="w-full h-32 object-cover border border-luxury-silver"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import api from './api';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const COMPRESS_THRESHOLD = 1.5 * 1024 * 1024; // 1.5MB
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 0.85;

export const MAX_LISTING_IMAGES = 30;

export function isAcceptedImageFile(file: File): boolean {
  return ACCEPTED_IMAGE_TYPES.includes(file.type) || file.type.startsWith('image/');
}

export function filterAcceptedImageFiles(files: FileList | File[]): File[] {
  return Array.from(files).filter((file) => {
    if (!isAcceptedImageFile(file)) return false;
    if (file.size > MAX_FILE_SIZE) {
      console.warn(`Dosya çok büyük, atlandı: ${file.name}`);
      return false;
    }
    return true;
  });
}

async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function createImagePreviews(files: File[]): Promise<string[]> {
  return Promise.all(files.map(readFileAsDataURL));
}

export async function compressImageIfNeeded(file: File): Promise<File> {
  if (!isAcceptedImageFile(file) || file.size <= COMPRESS_THRESHOLD) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file);
            return;
          }
          const baseName = file.name.replace(/\.[^.]+$/, '');
          resolve(new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' }));
        },
        'image/jpeg',
        JPEG_QUALITY,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

async function uploadSingleImage(listingId: string, file: File): Promise<void> {
  const formData = new FormData();
  formData.append('images', file);
  await api.post(`/listings/${listingId}/images`, formData);
}

export async function uploadListingImages(
  listingId: string,
  files: File[],
): Promise<{ uploaded: number; failed: number }> {
  if (files.length === 0) {
    return { uploaded: 0, failed: 0 };
  }

  const compressedFiles = await Promise.all(files.map(compressImageIfNeeded));

  const results = await Promise.allSettled(
    compressedFiles.map((file) => uploadSingleImage(listingId, file)),
  );

  const failed = results.filter((result) => result.status === 'rejected').length;
  return {
    uploaded: results.length - failed,
    failed,
  };
}

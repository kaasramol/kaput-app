import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorage } from '@/lib/firebase';

const UPLOAD_TIMEOUT_MS = 20_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Upload timed out')), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err: unknown) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

/**
 * Upload files and return the download URLs of those that succeeded.
 * Uploads are best-effort: a failed or slow upload is skipped so it never
 * blocks the surrounding action (submitting a quote, finishing onboarding).
 */
async function uploadFiles(
  files: File[],
  pathFor: (file: File, index: number) => string
): Promise<string[]> {
  const storage = getFirebaseStorage();

  const results = await Promise.allSettled(
    files.map(async (file, index) => {
      const storageRef = ref(storage, pathFor(file, index));
      await withTimeout(uploadBytes(storageRef, file), UPLOAD_TIMEOUT_MS);
      return getDownloadURL(storageRef);
    })
  );

  const urls: string[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      urls.push(result.value);
    } else {
      console.warn('File upload skipped:', result.reason);
    }
  }
  return urls;
}

function extension(file: File, fallback: string): string {
  return file.name.includes('.') ? (file.name.split('.').pop() ?? fallback) : fallback;
}

export function uploadQuotePhotos(userId: string, files: File[]): Promise<string[]> {
  const timestamp = Date.now();
  return uploadFiles(files, (file, i) => `quotes/${userId}/${timestamp}_${i}.${extension(file, 'jpg')}`);
}

export function uploadPortfolioPhotos(mechanicId: string, files: File[]): Promise<string[]> {
  const timestamp = Date.now();
  return uploadFiles(
    files,
    (file, i) => `mechanics/${mechanicId}/portfolio/${timestamp}_${i}.${extension(file, 'jpg')}`
  );
}

export function uploadCertificationFiles(mechanicId: string, files: File[]): Promise<string[]> {
  const timestamp = Date.now();
  return uploadFiles(
    files,
    (file, i) => `mechanics/${mechanicId}/certifications/${timestamp}_${i}.${extension(file, 'pdf')}`
  );
}

export async function uploadChatImage(userId: string, file: File): Promise<string | null> {
  const [url] = await uploadFiles([file], () => `chat/${userId}/${Date.now()}_${file.name}`);
  return url ?? null;
}

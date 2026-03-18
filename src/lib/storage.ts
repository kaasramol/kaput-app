import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorage } from '@/lib/firebase';

export async function uploadQuotePhotos(userId: string, files: File[]): Promise<string[]> {
  const storage = getFirebaseStorage();
  const timestamp = Date.now();

  const uploads = files.map(async (file, index) => {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `quotes/${userId}/${timestamp}_${index}.${ext}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  });

  return Promise.all(uploads);
}

export async function uploadPortfolioPhotos(mechanicId: string, files: File[]): Promise<string[]> {
  const storage = getFirebaseStorage();
  const timestamp = Date.now();

  const uploads = files.map(async (file, index) => {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `mechanics/${mechanicId}/portfolio/${timestamp}_${index}.${ext}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  });

  return Promise.all(uploads);
}

export async function uploadCertificationFiles(mechanicId: string, files: File[]): Promise<string[]> {
  const storage = getFirebaseStorage();
  const timestamp = Date.now();

  const uploads = files.map(async (file, index) => {
    const ext = file.name.split('.').pop() ?? 'pdf';
    const path = `mechanics/${mechanicId}/certifications/${timestamp}_${index}.${ext}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  });

  return Promise.all(uploads);
}

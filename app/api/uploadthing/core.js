import { createUploadthing } from 'uploadthing/next';
import { auth } from '@clerk/nextjs/server';
import { isTeacher } from '@/lib/teacher';

const f = createUploadthing();

const handleAuth = () => {
  const { userId } = auth();
  const isAuthorized = isTeacher(userId);
  if (!userId || !isAuthorized) {
    throw new Error('Unauthorized', { status: 401 });
  }
  return { userId };
};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  courseAttachment: f(['text', 'image', 'video', 'audio', 'pdf'])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  chapterVideo: f({ video: { maxFileSize: '512GB', maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
};

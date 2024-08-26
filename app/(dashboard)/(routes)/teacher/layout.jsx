import { auth } from '@clerk/nextjs/server';
import { isTeacher } from '@/lib/teacher';
import { redirect } from 'next/navigation';

const TacherLayout = ({ children }) => {
  const { userId } = auth();

  if (!isTeacher(userId)) {
    return redirect('/');
  }

  return <>{children}</>;
};

export default TacherLayout;

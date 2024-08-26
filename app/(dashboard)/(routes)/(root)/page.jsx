import { auth } from '@clerk/nextjs/server';
import { getDashboardCourses } from '@/actions/getDashboardCourses';
import { redirect } from 'next/navigation';
import CoursesList from '@/components/CoursesList';
import InfoCard from './_components/InfoCard';
import { CheckCircle, Clock } from 'lucide-react';

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }
  const { completedCourses, inProgressCourses } = await getDashboardCourses(
    userId
  );

  return (
    <div className='p-6 space-y-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        <div>
          <InfoCard
            label='In progress'
            icon={Clock}
            numberOfCourses={inProgressCourses.length}
            variant='default'
          />
        </div>
        <div>
          <InfoCard
            label='Completed'
            icon={CheckCircle}
            numberOfCourses={completedCourses.length}
            variant='success'
          />
        </div>
      </div>
      <CoursesList courses={[...inProgressCourses, ...completedCourses]} />
    </div>
  );
}

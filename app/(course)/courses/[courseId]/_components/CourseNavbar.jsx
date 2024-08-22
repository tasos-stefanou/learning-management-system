import NavbarRoutes from '@/components/NavbarRoutes';
import CourseMobileSidebar from './CourseMobileSidebar';

const CourseNavbar = ({ course, progressCount }) => {
  return (
    <div className='p-4 border-b h-full flex items-center bg-white shadow-sm'>
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
};
export default CourseNavbar;

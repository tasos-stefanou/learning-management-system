import IconBadge from '@/components/IconBadge';

const InfoCard = ({ label, icon, variant, numberOfCourses }) => {
  return (
    <div className='border rounded-md flex items-center gap-x-2 p-3'>
      <IconBadge icon={icon} variant={variant} />
      <div>
        <p className='font-medium'>{label}</p>
        <p className='text-sm text-gray-500'>
          {numberOfCourses} {numberOfCourses === 1 ? 'Course' : 'Courses'}
        </p>
      </div>
    </div>
  );
};
export default InfoCard;

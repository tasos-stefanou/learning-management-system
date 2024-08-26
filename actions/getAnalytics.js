import { db } from '@/lib/db';

const groupByCourse = (purchases) => {
  const grouped = {};
  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }
    grouped[courseTitle] += purchase.course.price;
  });
  return grouped;
};

const getAnalytics = async (userId) => {
  try {
    const purchases = await db.purchase.findMany({
      where: {
        course: {
          userId,
        },
      },
      include: {
        course: true,
      },
    });

    const groupedEarnings = groupByCourse(purchases);
    const data = Object.entries(groupedEarnings).map(
      ([courseTitle, total]) => ({
        name: courseTitle,
        total: total,
      })
    );

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.length;

    return {
      totalRevenue,
      data,
      totalSales,
    };
  } catch (error) {
    console.log('[GET_ANALYTICS]', error);
    return {
      totalRevenue: 0,
      data: [],
      totalSales: 0,
    };
  }
};

export { getAnalytics };

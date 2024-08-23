export const formatPrice = (price) => {
  // do it with Intl.NumberFormat
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

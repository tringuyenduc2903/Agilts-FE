export const formatPrice = (str: string | number) => {
  return str.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};

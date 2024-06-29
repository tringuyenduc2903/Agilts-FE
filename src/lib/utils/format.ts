import { format, parse } from 'date-fns';

export const formatPrice = (str: string | number) => {
  return str.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};

export const CustomFormatDate = (str: string, type?: string) => {
  return (
    format(
      parse(str.toString(), 'dd/MM/yyyy', new Date()),
      type ? type : 'yyyy-MM-dd'
    ) || ''
  );
};

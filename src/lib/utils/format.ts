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

export const convertData = (data: { [key: string]: string }) => {
  return Object.entries(data)?.map(([key, value]) => {
    return (
      {
        id: key,
        value: value,
      } || {}
    );
  });
};

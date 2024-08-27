import { format, isValid, parse } from 'date-fns';

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
export const formatDate = (date: string) => {
  const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
  return isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : '';
};
export const convertData = (data: { [key: string]: string }) => {
  return (
    data &&
    Object.entries(data)?.map(([key, value]) => {
      return (
        {
          id: key,
          value: value,
        } || {}
      );
    })
  );
};
export function formatNumber(number: number) {
  return number.toLocaleString('vi-VN');
}

export const formatAndPreserveCursor = (e: any) => {
  const input = e.target;
  const { value } = input;
  const cursorPosition = input.selectionStart;
  const numericValue = value.replace(/\D/g, '');
  const formattedValue = formatNumber(Number(numericValue));

  // Update the input value
  input.value = formattedValue;

  // Restore the cursor position
  const diff = formattedValue.length - numericValue.length;
  input.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
};

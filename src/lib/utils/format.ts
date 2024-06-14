export function formatPhoneNumberToVietnam(
  code: string | number,
  phoneNumber: string
) {
  let formattedNumber = phoneNumber.replace(/\D/g, '');
  if (phoneNumber.startsWith('0')) {
    formattedNumber = phoneNumber.slice(1);
  }
  return `+${code}${formattedNumber}`;
}

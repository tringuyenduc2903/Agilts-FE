export const title = process.env.NEXT_PUBLIC_WEBSITE_NAME;
export const defaultCountry = 'Việt Nam';
export const defaultTimezone = 'Asia/Ho_Chi_Minh';
export const documents = [
  {
    code: 0,
    name: 'identity_card',
  },
  {
    code: 1,
    name: 'citizen_identification_card',
  },
  {
    code: 2,
    name: 'passport',
  },
];

export const registration_options = [
  {
    name: 'registration_options_1',
    value: 0,
  },
  {
    name: 'registration_options_2',
    value: 1,
  },
];

export const license_plate_registration_option = [
  {
    name: 'license_plate_registration_option_1',
    value: 0,
  },
  {
    name: 'license_plate_registration_option_2',
    value: 1,
  },
  {
    name: 'license_plate_registration_option_3',
    value: 2,
  },
];
export const statusOrder = [
  {
    name: 'pending',
    value: 0,
    color: '#eab308',
  },
  {
    name: 'waiting_for_shipping',
    value: 1,
    color: '#06b6d4',
  },
  {
    name: 'waiting_for_delivery',
    value: 2,
    color: '#3b82f6',
  },
  {
    name: 'order_complete',
    value: 3,
    color: '#22c55e',
  },
  {
    name: 'cancelled',
    value: 4,
    color: '#ef4444',
  },
  {
    name: 'return_refund',
    value: 5,
    color: '#f97316',
  },
];

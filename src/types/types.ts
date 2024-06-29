export type User = {
  id: string | number;
  name: string;
  birthday: string;
  gender: 0 | 1 | 2;
  gender_preview: string;
  email: string;
  email_verified_at: string;
  phone_number: string;
  phone_number_verified_at: string;
  two_factor_confirmed_at: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  two_factor?: boolean;
};

export type Address = {
  id: number;
  country: string;
  province: string;
  district: string;
  ward: string;
  address_detail: string;
  address_preview: string;
  type: number;
  type_preview: string;
  default: boolean;
  created_at: string;
  updated_at: string;
};

export type Branch = {
  id: number | string;
  name: string;
  phone_number: number | string;
  addresses: Address[];
  deleted_at: string;
  created_at: string;
  updated_at: string;
};

export type Document = {
  id: number;
  type: number;
  type_preview: string;
  number: number;
  issued_name: string;
  issuance_date: string;
  expiry_date: string;
  default: boolean;
  customer_id: number;
  created_at: string;
  updated_at: string;
};

export const title = process.env.NEXT_PUBLIC_WEBSITE_NAME;
export const defaultCountry = 'Việt Nam';
export const defaultTimezone = 'Asia/Ho_Chi_Minh';
export const sortItem = [
  {
    sortColumn: 'name',
    sortDirection: 'asc',
    preview: 'Tên: A -> Z',
  },
  {
    sortColumn: 'name',
    sortDirection: 'desc',
    preview: 'Tên: Z -> A',
  },
  {
    sortColumn: 'latest',
    sortDirection: null,
    preview: 'Sản phẩm mới nhất',
  },
  {
    sortColumn: 'oldest',
    sortDirection: null,
    preview: 'Sản phẩm cũ',
  },
  {
    sortColumn: 'price',
    sortDirection: 'asc',
    preview: 'Giá từ thấp đến cao',
  },
  {
    sortColumn: 'price',
    sortDirection: 'desc',
    preview: 'Giá từ cao đến thấp',
  },
  {
    sortColumn: 'review',
    sortDirection: null,
    preview: 'Đánh giá trung bình',
  },
];
export const documents = [
  {
    code: 0,
    name: 'Chứng minh nhân dân',
  },
  {
    code: 1,
    name: 'Căn cước công dân',
  },
  {
    code: 2,
    name: 'Hộ chiếu',
  },
];

export const registration_options = [
  {
    name: 'Lần đầu (5%)',
    value: 0,
  },
  {
    name: 'Lần 2 trở đi (1%)',
    value: 1,
  },
];

export const license_plate_registration_option = [
  {
    name: 'Khu vực I (Thành phố Hà Nội, Thành phố Hồ Chí Minh bao gồm tất cả các quận, huyện trực thuộc thành phố không phân biệt nội thành hay ngoại thành)',
    value: 0,
  },
  {
    name: 'Khu vực II (Thành phố trực thuộc Trung ương (trừ Thành phố Hà Nội, Thành phố Hồ Chí Minh) bao gồm tất cả các quận,huyện trực thuộc thành phố không phân biệt nội thành hay ngoại thành; thành phố trực thuộc tỉnh, thị xã bao gồm tất cả các phường, xã thuộc thành phố, thị xã không phân biệt phường nội thành, nội thị hay xã ngoại thành, ngoại thị)',
    value: 1,
  },
  {
    name: 'Khu vực III (Các khu vực khác ngoài khu vực I và khu vực II)',
    value: 2,
  },
];
export const statusOrder = [
  {
    name: 'Chờ thanh toán',
    value: 0,
    color: '#eab308',
  },
  {
    name: 'Chờ vận chuyển',
    value: 1,
    color: '#06b6d4',
  },
  {
    name: 'Chờ nhận hàng',
    value: 2,
    color: '#3b82f6',
  },
  {
    name: 'Đã nhận hàng',
    value: 3,
    color: '#22c55e',
  },
  {
    name: 'Hủy',
    value: 4,
    color: '#ef4444',
  },
  {
    name: 'Trả hàng/Hoàn tiền',
    value: 5,
    color: '#f97316',
  },
];

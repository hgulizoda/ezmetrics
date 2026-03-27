// ============================================================
// Centralized fake data for frontend development without backend
// ============================================================

// Helper: simulate network delay
export const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper: fake axios response wrapper
export const fakeRes = (data: any, status = 200) => ({ data, status, statusText: 'OK', headers: {}, config: {} as any });

// Helper: paginated response
export const paginated = <T>(items: T[], page = 1, limit = 10) => ({
  data: items.slice((page - 1) * limit, page * limit),
  pagination: {
    total_records: items.length,
    current_page: page,
    total_pages: Math.ceil(items.length / limit),
    next_page: page * limit < items.length ? page + 1 : null,
    prev_page: page > 1 ? page - 1 : null,
  },
});

// ============================================================
// USERS
// ============================================================
export const MOCK_USERS = [
  {
    _id: 'u1',
    phone_number: '+998901234567',
    status: 'active',
    user_id: '1000001',
    order_count: 12,
    is_deleted: false,
    created_at: '2025-06-15T10:00:00Z',
    profile: { _id: 'p1', first_name: 'Aziz', last_name: 'Karimov', company_name: 'Silk Road Trade', avatar: '', birth_date: '1990-05-20' },
  },
  {
    _id: 'u2',
    phone_number: '+998931112233',
    status: 'active',
    user_id: '1000002',
    order_count: 8,
    is_deleted: false,
    created_at: '2025-07-01T12:00:00Z',
    profile: { _id: 'p2', first_name: 'Dilnoza', last_name: 'Rakhimova', company_name: 'East Express', avatar: '', birth_date: '1992-11-10' },
  },
  {
    _id: 'u3',
    phone_number: '+998941234567',
    status: 'notverified',
    user_id: '1000003',
    order_count: 3,
    is_deleted: false,
    created_at: '2025-08-20T09:00:00Z',
    profile: { _id: 'p3', first_name: 'Jasur', last_name: 'Toshmatov', company_name: 'Global Cargo', avatar: '', birth_date: '1988-03-15' },
  },
  {
    _id: 'u4',
    phone_number: '+998951234567',
    status: 'active',
    user_id: '1000004',
    order_count: 20,
    is_deleted: false,
    created_at: '2025-05-10T08:30:00Z',
    profile: { _id: 'p4', first_name: 'Malika', last_name: 'Usmanova', company_name: 'Tashkent Import', avatar: '', birth_date: '1995-07-25' },
  },
  {
    _id: 'u5',
    phone_number: '+998971234567',
    status: 'blocked',
    user_id: '1000005',
    order_count: 0,
    is_deleted: false,
    created_at: '2025-09-01T14:00:00Z',
    profile: { _id: 'p5', first_name: 'Bobur', last_name: 'Nazarov', company_name: '', avatar: '', birth_date: '1993-01-05' },
  },
];

export const MOCK_PROFILES: Record<string, any> = {
  u1: {
    _id: 'p1', avatar: '', birth_date: '1990-05-20', company_name: 'Silk Road Trade',
    first_name: 'Aziz', last_name: 'Karimov', is_deleted: false,
    created_at: '2025-06-15T10:00:00Z', updated_at: '2025-06-15T10:00:00Z',
    isBonusEnabled: true,
    user: { _id: 'u1', email: 'aziz@example.com', phone_number: '+998901234567', user_id: '1000001', status: 'active' },
  },
  u2: {
    _id: 'p2', avatar: '', birth_date: '1992-11-10', company_name: 'East Express',
    first_name: 'Dilnoza', last_name: 'Rakhimova', is_deleted: false,
    created_at: '2025-07-01T12:00:00Z', updated_at: '2025-07-01T12:00:00Z',
    isBonusEnabled: true,
    user: { _id: 'u2', email: 'dilnoza@example.com', phone_number: '+998931112233', user_id: '1000002', status: 'active' },
  },
};

// ============================================================
// ORDERS / PACKAGES
// ============================================================
const statuses = ['pending', 'in_china_warehouse', 'to_china_border', 'in_transit', 'to_uzb_customs', 'in_customs', 'delivered'] as const;

export const MOCK_ORDERS = Array.from({ length: 25 }, (_, i) => ({
  _id: `ord${i + 1}`,
  images: [],
  is_paid: i % 3 === 0,
  order_cost: Math.round(50 + Math.random() * 500),
  order_date: new Date(2025, 5 + (i % 6), 1 + i).toISOString(),
  order_weight: +(1 + Math.random() * 30).toFixed(1),
  order_capacity: +(0.5 + Math.random() * 5).toFixed(2),
  order_id: `GM${String(10000 + i)}`,
  status: statuses[i % statuses.length],
  status_updated_at: new Date(2025, 6 + (i % 5), 1 + i).toISOString(),
  total_count: Math.ceil(Math.random() * 10),
  total_places: Math.ceil(Math.random() * 5),
  user: MOCK_USERS[i % MOCK_USERS.length],
  description: `Order description ${i + 1}`,
  truck: i % 4 === 0 ? { _id: `t${(i % 3) + 1}`, name: `Truck-${(i % 3) + 1}` } : null,
  container_number: i % 4 === 0 ? `CONT${1000 + i}` : '',
  isCustomsByUser: i % 5 === 0,
  packagingType: i % 2 === 0 ? 'box' : 'pallet',
  status_history: [
    { status: 'pending', date: new Date(2025, 5, 1 + i).toISOString() },
  ],
}));

export const MOCK_ORDER_COUNTS = {
  data: {
    all: 25,
    pending: 4,
    in_china_warehouse: 4,
    to_china_border: 3,
    in_transit: 4,
    to_uzb_customs: 3,
    in_customs: 4,
    delivered: 3,
  },
};

// ============================================================
// TRUCKS
// ============================================================
export const MOCK_TRUCKS = [
  { _id: 't1', name: 'Truck-Alpha', status: 'active', estimated_arrival_date: '2025-12-01T00:00:00Z', created_at: '2025-10-01T00:00:00Z', container_number: 'CONT1001' },
  { _id: 't2', name: 'Truck-Beta', status: 'active', estimated_arrival_date: '2025-12-15T00:00:00Z', created_at: '2025-10-10T00:00:00Z', container_number: 'CONT1002' },
  { _id: 't3', name: 'Truck-Gamma', status: 'in_transit', estimated_arrival_date: '2025-11-20T00:00:00Z', created_at: '2025-09-25T00:00:00Z', container_number: 'CONT1003' },
];

export const MOCK_TRUCK_ORDERS = MOCK_TRUCKS.map((truck) => ({
  count: 5,
  total_weight: 120.5,
  total_capacity: 15.3,
  truck,
  orders: MOCK_ORDERS.slice(0, 5).map((o) => ({ ...o, truck })),
}));

// ============================================================
// BONUSES
// ============================================================
const getBonusStatus = (i: number) => {
  if (i % 3 === 0) return 'used';
  if (i % 3 === 1) return 'not_used';
  return 'inprogress';
};

export const MOCK_BONUSES = MOCK_USERS.filter((u) => u.status === 'active').map((u, i) => ({
  _id: `bonus${i + 1}`,
  ball: Math.floor(10 + Math.random() * 90),
  total_weight: +(50 + Math.random() * 200).toFixed(1),
  total_capacity: +(5 + Math.random() * 30).toFixed(2),
  volume_limit: 100,
  status: getBonusStatus(i),
  removed_count: i % 2,
  profile: u.profile,
  user: { _id: u._id, phone_number: u.phone_number, user_id: u.user_id },
}));

export const MOCK_BONUS_LIMIT = { _id: 'bl1', volume_limit: 100 };

// ============================================================
// STORES
// ============================================================
export const MOCK_STORES = [
  { _id: 's1', receiver: 'Wang Wei', phone_number: '+8613812345678', recieving_date: '2025-11-01', store_address: 'Guangzhou, Baiyun District, 123', wechat_id: 'wang_wei_123' },
  { _id: 's2', receiver: 'Li Na', phone_number: '+8613987654321', recieving_date: '2025-11-15', store_address: 'Yiwu, International Trade City, B-205', wechat_id: 'li_na_456' },
];

// ============================================================
// STATISTICS
// ============================================================
export const MOCK_STATISTICS_USERS = {
  users: MOCK_USERS.map((u) => ({
    ...u,
    total_orders: u.order_count,
    total_weight: +(u.order_count * 5.5).toFixed(1),
    total_capacity: +(u.order_count * 1.2).toFixed(2),
    total_places: u.order_count * 2,
  })),
  pagination: { total_records: MOCK_USERS.length, current_page: 1, total_pages: 1, next_page: null, prev_page: null },
  totals: { total_weight: 500, total_capacity: 60, total_counts: 43, total_places: 86 },
};

export const MOCK_USER_STATS = (id: string) => {
  const u = MOCK_USERS.find((usr) => usr._id === id) || MOCK_USERS[0];
  return {
    total_orders: u.order_count,
    total_weight: +(u.order_count * 5.5).toFixed(1),
    total_capacity: +(u.order_count * 1.2).toFixed(2),
    total_places: u.order_count * 2,
    profile: u.profile,
  };
};

// ============================================================
// PRICES
// ============================================================
export const MOCK_PRICES = [
  {
    _id: 'pr1',
    name_uz: 'Oddiy yuk', name_ru: 'Обычный груз', name_en: 'Standard Cargo', name_cn: '普通货物',
    description_uz: 'Oddiy yuk tashish', description_ru: 'Обычная доставка', description_en: 'Standard cargo delivery', description_cn: '标准货运',
    is_dangerous_goods: false, with_customs_clearance: false,
    transport_type: 'ground', kg_in_1m3: 200, price_per_kg: 3.5, documentation_price: 10,
    pricing: [
      { weight_range: '0-50', unit: 'kg', price: 4.0, dangerous_goods_price: 6.0, price_with_customs: 5.5 },
      { weight_range: '51-200', unit: 'kg', price: 3.5, dangerous_goods_price: 5.5, price_with_customs: 5.0 },
    ],
  },
  {
    _id: 'pr2',
    name_uz: 'Xavfli yuk', name_ru: 'Опасный груз', name_en: 'Hazardous Cargo', name_cn: '危险货物',
    description_uz: 'Xavfli yuk tashish', description_ru: 'Перевозка опасных грузов', description_en: 'Hazardous cargo delivery', description_cn: '危险货物运输',
    is_dangerous_goods: true, with_customs_clearance: true,
    transport_type: 'ground', kg_in_1m3: 250, price_per_kg: 5.0, documentation_price: 25,
    pricing: [
      { weight_range: '0-50', unit: 'kg', price: 6.0, dangerous_goods_price: 8.0, price_with_customs: 7.5 },
    ],
  },
];

// ============================================================
// NOTIFICATIONS
// ============================================================
export const MOCK_NOTIFICATIONS = [
  {
    _id: 'n1',
    title: { uz: 'Yangi aksiya', ru: 'Новая акция', en: 'New promotion' },
    body: { uz: 'Barcha buyurtmalarga 10% chegirma', ru: 'Скидка 10% на все заказы', en: '10% off all orders' },
    image: { uz: '', ru: '', en: '' },
    type: 'promotion',
    date: '2025-10-01T10:00:00Z',
    updated_at: '2025-10-01T10:00:00Z',
  },
  {
    _id: 'n2',
    title: { uz: 'Texnik xizmat', ru: 'Техобслуживание', en: 'Maintenance' },
    body: { uz: 'Tizim 2 soat ichida yangilanadi', ru: 'Система будет обновлена в течение 2 часов', en: 'System will be updated within 2 hours' },
    image: { uz: '', ru: '', en: '' },
    type: 'system',
    date: '2025-10-15T08:00:00Z',
    updated_at: '2025-10-15T08:00:00Z',
  },
];

// ============================================================
// FEEDBACKS & SUGGESTIONS
// ============================================================
export const MOCK_SUGGESTIONS = [
  { _id: 'sg1', text: 'Ilovada til tanlash imkoniyatini qo\'shing', user: MOCK_USERS[0], created_at: '2025-10-05T12:00:00Z' },
  { _id: 'sg2', text: 'Buyurtma kuzatish xaritasini qo\'shing', user: MOCK_USERS[1], created_at: '2025-10-10T14:00:00Z' },
];

export const MOCK_FEEDBACKS = [
  { _id: 'fb1', text: 'Yetkazib berish tez va sifatli bo\'ldi', rating: 5, user: MOCK_USERS[0], created_at: '2025-10-03T11:00:00Z' },
  { _id: 'fb2', text: 'Qadoqlash yaxshiroq bo\'lishi kerak', rating: 3, user: MOCK_USERS[2], created_at: '2025-10-08T16:00:00Z' },
];

// ============================================================
// BANNERS
// ============================================================
export const MOCK_BANNERS = [
  { _id: 'b1', image_url: { uz: '/assets/illustrations/illustration_dashboard.png', ru: '/assets/illustrations/illustration_dashboard.png', en: '/assets/illustrations/illustration_dashboard.png' }, order: 1 },
  { _id: 'b2', image_url: { uz: '/assets/illustrations/illustration_dashboard.png', ru: '/assets/illustrations/illustration_dashboard.png', en: '/assets/illustrations/illustration_dashboard.png' }, order: 2 },
];

// ============================================================
// CHAT
// ============================================================
export const MOCK_CHAT_ROOMS = [
  {
    _id: 'chat1',
    admin: { _id: 'admin1', first_name: 'Admin', last_name: '', phone: '', role: 'admin' },
    last_message: { _id: 'msg2', content: 'Buyurtmangiz yo\'lda', sender_type: 'admin', status: 'read', created_at: '2025-10-20T15:00:00Z' },
    last_message_at: '2025-10-20T15:00:00Z',
    profile: MOCK_USERS[0].profile,
    user: { _id: MOCK_USERS[0]._id, phone_number: MOCK_USERS[0].phone_number, role: 'user', status: 'active' },
    unread_count_admin: 0,
  },
  {
    _id: 'chat2',
    admin: { _id: 'admin1', first_name: 'Admin', last_name: '', phone: '', role: 'admin' },
    last_message: { _id: 'msg4', content: 'Rahmat!', sender_type: 'user', status: 'read', created_at: '2025-10-21T09:30:00Z' },
    last_message_at: '2025-10-21T09:30:00Z',
    profile: MOCK_USERS[1].profile,
    user: { _id: MOCK_USERS[1]._id, phone_number: MOCK_USERS[1].phone_number, role: 'user', status: 'active' },
    unread_count_admin: 2,
  },
];

export const MOCK_MESSAGES: Record<string, any[]> = {
  chat1: [
    { _id: 'msg1', content: 'Salom, buyurtmam qayerda?', created_at: '2025-10-20T14:00:00Z', is_deleted: false, room: 'chat1', sender: MOCK_USERS[0]._id, sender_type: 'user', status: 'read', type: 'text', file_url: [], metadata: null, reply_to: null },
    { _id: 'msg2', content: 'Buyurtmangiz yo\'lda', created_at: '2025-10-20T15:00:00Z', is_deleted: false, room: 'chat1', sender: 'admin1', sender_type: 'admin', status: 'read', type: 'text', file_url: [], metadata: null, reply_to: null },
  ],
  chat2: [
    { _id: 'msg3', content: 'Yangi buyurtma berdim', created_at: '2025-10-21T09:00:00Z', is_deleted: false, room: 'chat2', sender: MOCK_USERS[1]._id, sender_type: 'user', status: 'read', type: 'text', file_url: [], metadata: null, reply_to: null },
    { _id: 'msg4', content: 'Rahmat!', created_at: '2025-10-21T09:30:00Z', is_deleted: false, room: 'chat2', sender: MOCK_USERS[1]._id, sender_type: 'user', status: 'read', type: 'text', file_url: [], metadata: null, reply_to: null },
  ],
};

// ============================================================
// ADMIN
// ============================================================
export const MOCK_ADMIN = [
  { _id: 'admin1', branch: 'Tashkent', dob: '1985-01-15', father_name: 'Ikromovich', first_name: 'Admin', last_name: 'Adminov', phone: '+998901000000' },
];

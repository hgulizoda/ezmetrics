import { _id } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

export const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/hjxMnGUJCjY7pX8lQbS7kn/%5BPreview%5D-Minimal-Web.v5.4.0?type=design&node-id=0-1&mode=design&t=2fxnS70DuiTLGzND-0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    demo: {
      details: `/product/${MOCK_ID}`,
    },
  },

  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },

  // DASHBOARD
  dashboard: {
    root: `${ROOTS.DASHBOARD}/all`,
    users: `${ROOTS.DASHBOARD}/users`,
    settings: `${ROOTS.DASHBOARD}/settings`,
    bonus: `${ROOTS.DASHBOARD}/bonus`,
    archive: `${ROOTS.DASHBOARD}/archive`,
    prices: `${ROOTS.DASHBOARD}/prices`,
    store: `${ROOTS.DASHBOARD}/store`,
    notification: `${ROOTS.DASHBOARD}/notifications`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    statistics: `${ROOTS.DASHBOARD}/statistics`,
    feedbacks: `${ROOTS.DASHBOARD}/feedbacks`,
  },
};

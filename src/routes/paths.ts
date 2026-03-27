const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

const paths = {
  page404: '/404',
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/login`,
    },
    login: `${ROOTS.AUTH}/login`,
  },
  dashboard: {
    root: ROOTS.DASHBOARD,
    // EZ Metric paths
    workers: `${ROOTS.DASHBOARD}/workers`,
    clock: `${ROOTS.DASHBOARD}/clock`,
    efficiency: `${ROOTS.DASHBOARD}/efficiency`,
    salary: `${ROOTS.DASHBOARD}/salary`,
    settings: `${ROOTS.DASHBOARD}/settings`,
    progress: `${ROOTS.DASHBOARD}/progress`,
    // Legacy paths (keep for backward compatibility)
    users: `${ROOTS.DASHBOARD}/users`,
    statistics: `${ROOTS.DASHBOARD}/statistics`,
    packages: `${ROOTS.DASHBOARD}/all`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    store: `${ROOTS.DASHBOARD}/store`,
    bonus: `${ROOTS.DASHBOARD}/bonus`,
    notifications: `${ROOTS.DASHBOARD}/notifications`,
    archive: `${ROOTS.DASHBOARD}/archive`,
    prices: `${ROOTS.DASHBOARD}/prices`,
    feedbacks: `${ROOTS.DASHBOARD}/feedbacks`,
  },
};

export { ROOTS, paths };

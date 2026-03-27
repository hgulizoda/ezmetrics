import { delay, fakeRes, paginated, MOCK_USERS, MOCK_PROFILES } from 'src/_mock/fake-backend';

import { UserFormType } from '../libs/userScheme';
import { IFilterProps } from '../../package/types/Filter';
import { UserFormTypeRequired } from '../libs/useSchemeRequired';

export const user = {
  getAll: async (params?: IFilterProps) => {
    await delay();
    const searched = params?.search
      ? MOCK_USERS.filter((u) =>
          `${u.profile.first_name} ${u.profile.last_name}`.toLowerCase().includes(params.search!.toLowerCase())
        )
      : MOCK_USERS;
    return paginated(searched, params?.page, params?.limit) as any;
  },
  updateStatus: async (_id: string, _status: string) => {
    await delay();
    return fakeRes({ success: true });
  },
  create: async (values: UserFormTypeRequired) => {
    await delay();
    return { data: { _id: `u_new_${Date.now()}`, ...values } };
  },
  delete: async (_id: string) => {
    await delay();
    return { data: { success: true } };
  },
};

export const profile = {
  getProfile: async (id: string) => {
    await delay();
    const p = MOCK_PROFILES[id] || {
      _id: 'p_unknown', avatar: '', birth_date: '2000-01-01', company_name: 'Unknown',
      first_name: 'Unknown', last_name: 'User', is_deleted: false,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      isBonusEnabled: false,
      user: { _id: id, email: 'unknown@example.com', phone_number: '+998900000000', user_id: '0000000', status: 'active' },
    };
    return { data: p } as any;
  },
  updateProfile: async (_id: string, _data: UserFormType) => {
    await delay();
    return { data: { success: true } };
  },
};

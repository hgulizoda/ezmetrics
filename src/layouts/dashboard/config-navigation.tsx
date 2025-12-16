import { useMemo, useState, useEffect } from 'react';

import { paths, ROOTS } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useGetChatLists } from 'src/modules/chat/hooks/useGetChatLists';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate('lang');
  const { data } = useGetChatLists();
  const [unreadCount, setUnreadCount] = useState(0);
  useEffect(() => {
    setUnreadCount(data?.data.filter((el: any) => el.unread_count_admin > 0).length);
  }, [data?.data]);
  return useMemo(
    () => [
      {
        subheader: t('title'),
        roles: ['superadmin', 'admin'],
        items: [
          {
            title: t('users.title'),
            path: paths.dashboard.users,
            icon: <Iconify icon="hugeicons:user" width={24} height={24} />,
          },
          {
            title: t('packages.title'),
            path: paths.dashboard.root,
            icon: <Iconify icon="hugeicons:dropbox" width={24} height={24} />,
          },
          {
            title: t('transport.title'),
            path: `${paths.dashboard.settings}/trucks`,
            icon: <Iconify icon="hugeicons:shipping-truck-01" width={24} height={24} />,
          },
          {
            title: t('banner.title'),
            path: `${ROOTS.DASHBOARD}/banner`,
            icon: <Iconify icon="hugeicons:image-add-02" width={24} height={24} />,
          },
          {
            title: t('bonus.title'),
            path: `${paths.dashboard.bonus}`,
            icon: <Iconify icon="mage:gift" width={24} height={24} />,
          },
          {
            title: t('archive.title'),
            path: paths.dashboard.archive,
            icon: <Iconify icon="solar:archive-up-minimlistic-linear" width={24} height={24} />,
            children: [
              {
                title: t('users.title'),
                path: `${paths.dashboard.archive}/users`,
                roles: ['superadmin', 'admin'],
              },
              {
                title: t('packages.title'),
                path: `${paths.dashboard.archive}/packages`,
                roles: ['superadmin', 'admin'],
              },

              {
                title: t('transport.title'),
                path: `${paths.dashboard.archive}/transports`,
                roles: ['superadmin', 'admin'],
              },
            ],
          },
          {
            title: t('prices.title'),
            path: paths.dashboard.prices,
            icon: <Iconify icon="ic:outline-price-change" width={24} />,
            children: [
              {
                title: t('prices.auto'),
                path: `${paths.dashboard.prices}/auto`,
                roles: ['superadmin', 'admin'],
              },
              {
                title: t('prices.air'),
                path: `${paths.dashboard.prices}/air`,
                roles: ['superadmin', 'admin'],
              },
            ],
          },
          {
            title: t('store.title'),
            path: paths.dashboard.store,
            roles: ['superadmin', 'admin'],
            icon: <Iconify icon="material-symbols:warehouse-outline-rounded" width={24} />,
          },
          {
            title: t('notification.table.title'),
            path: paths.dashboard.notification,
            roles: ['superadmin', 'admin'],
            icon: <Iconify icon="tdesign:notification" width={24} />,
          },
          {
            title: t('chat.title'),
            path: paths.dashboard.chat,
            roles: ['superadmin', 'admin'],
            icon: <Iconify icon="hugeicons:bubble-chat-user" width={24} />,
            info: (
              <Label variant="filled" color="info">
                {unreadCount}
              </Label>
            ),
          },
          {
            title: t('statistics.title'),
            path: paths.dashboard.statistics,
            roles: ['superadmin', 'admin'],
            icon: <Iconify icon="uil:statistics" width={24} />,
          },
          {
            title: t('feedbacks.title'),
            path: paths.dashboard.feedbacks,
            icon: <Iconify icon="fluent:person-feedback-20-regular" width={24} />,
            children: [
              {
                title: t('feedbacks.ratings'),
                path: `${paths.dashboard.feedbacks}/ratings`,
                roles: ['superadmin', 'admin'],
              },
              {
                title: t('feedbacks.suggestions'),
                path: `${paths.dashboard.feedbacks}/suggestions`,
                roles: ['superadmin', 'admin'],
              },
            ],
          },
        ],
      },
    ],
    [t, unreadCount]
  );
}

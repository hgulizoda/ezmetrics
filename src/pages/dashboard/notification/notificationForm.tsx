import { useMemo } from 'react';

import { useParams } from 'src/routes/hooks';

import { NotificationsForm } from 'src/modules/notification/ui/NotificationForm';
import { useGetAllNotifications } from 'src/modules/notification/hooks/useNotification';

const NotificationFormRoot = () => {
  const params = useParams();
  const { data } = useGetAllNotifications({
    page: 1,
    limit: 10,
  });
  const notification = useMemo(() => {
    if (data) {
      return data.notifications.find((el) => el.id === params.id);
    }
    return undefined;
  }, [data, params.id]);

  return <NotificationsForm notification={notification} />;
};
export default NotificationFormRoot;

import { Suspense } from 'react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';

import { Box, Card, Button, Divider, CardHeader, CardContent } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useGetUserOrderCount } from 'src/modules/package/hook/useGetCount';

import Label from 'src/components/label';

const UserOrders = () => {
  const { t } = useTranslate('lang');
  const params = useParams() as { id: string; status: string };
  const navigate = useNavigate();
  const { orderCount } = useGetUserOrderCount(params.id);
  return (
    <Card>
      <CardHeader title={t('profile.ordersTabs.title')} />
      <CardContent>
        <Box display="flex" gap={4} pb={1.5}>
          <Button
            sx={{ display: 'inline-flex', gap: 1 }}
            onClick={() => navigate(`${paths.dashboard.users}/${params.id}/orders`)}
            variant={params.status ? 'outlined' : 'soft'}
            color={params.status ? 'inherit' : 'primary'}
          >
            {t('profile.ordersTabs.miniTabs.all')}
            <Label
              variant={params.status ? 'soft' : 'filled'}
              color={params.status ? 'default' : 'primary'}
            >
              {orderCount?.total}
            </Label>
          </Button>
          <Button
            sx={{ display: 'inline-flex', gap: 1 }}
            onClick={() => navigate(`${paths.dashboard.users}/${params.id}/orders/pending`)}
            variant={params.status === 'pending' ? 'soft' : 'outlined'}
            color={params.status === 'pending' ? 'primary' : 'inherit'}
          >
            {t('profile.ordersTabs.miniTabs.inProgress')}
            <Label
              variant={params.status === 'pending' ? 'filled' : 'soft'}
              color={params.status === 'pending' ? 'primary' : 'default'}
            >
              {orderCount?.active}
            </Label>
          </Button>
          <Button
            sx={{ display: 'inline-flex', gap: 1 }}
            variant={params.status === 'delivered' ? 'soft' : 'outlined'}
            color={params.status === 'delivered' ? 'primary' : 'inherit'}
            onClick={() => navigate(`${paths.dashboard.users}/${params.id}/orders/delivered`)}
          >
            {t('profile.ordersTabs.miniTabs.delivered')}
            <Label
              variant={params.status === 'delivered' ? 'filled' : 'soft'}
              color={params.status === 'delivered' ? 'primary' : 'default'}
            >
              {orderCount?.delivered}
            </Label>
          </Button>
        </Box>
        <Divider />

        <Suspense>
          <Outlet />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default UserOrders;

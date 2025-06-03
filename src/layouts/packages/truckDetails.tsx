import { Suspense } from 'react';
import { useParams } from 'react-router';
import { Outlet, useNavigate } from 'react-router-dom';

import { Box } from '@mui/material';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useFormatDate } from 'src/utils/iso-date';

import { useTranslate } from 'src/locales';

import { OrderStatus, useShipmentTypeLabels } from 'src/types/TableStatus';

import Iconify from '../../components/iconify';
import { useGetTruckDetails } from '../../modules/settings/hooks/useTruckDetails';

export const PackageTruckDetails = () => {
  const { t } = useTranslate('lang');
  const shipmentLabels = useShipmentTypeLabels();
  const navigate = useNavigate();
  const formatDate = useFormatDate();

  const params = useParams() as { id: string };
  const { data, isLoading } = useGetTruckDetails({ id: params.id, params: {} });

  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          mb: 2,
          gap: 1,
        }}
      >
        <IconButton size="small" onClick={() => navigate(-1)}>
          <Iconify icon="weui:back-filled" />
        </IconButton>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography variant="subtitle2">
            {isLoading ? '...' : data?.name.toUpperCase()}
          </Typography>
          -
          <Typography variant="subtitle2" color="textSecondary">
            ({data?.orders.length})
          </Typography>
        </Box>
        {data && (
          <Box display="flex" gap={0.5}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                {t('transport.form.containerNumber')}:
              </Typography>
              <Typography variant="subtitle2">{data.containerNumber}</Typography>
            </Box>
            <Iconify icon="tabler:separator" />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                {t('transport.createdTime')}:
              </Typography>
              <Typography variant="subtitle2">{formatDate(data.createdAt)}</Typography>
            </Box>
            <Iconify icon="tabler:separator" />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                {t('transport.estimatedArrivalTime')}:
              </Typography>
              <Typography variant="subtitle2">{formatDate(data.estimatedArrivalDate)}</Typography>
            </Box>
            <Iconify icon="tabler:separator" />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                {t('transport.truckStatus')}:
              </Typography>
              <Typography variant="subtitle2">
                {data.status && shipmentLabels[data.status as OrderStatus]}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          borderRadius: '16px',
          border: '1px solid #919EAB1F',
          boxShadow: '0px 12px 24px -4px #919EAB1F',
          overflow: 'hidden',
        }}
      >
        <Box height={700}>
          <Suspense fallback="...">
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </Container>
  );
};

import { useState } from 'react';
import { useNavigate } from 'react-router';

import { LoadingButton } from '@mui/lab';
import { Box, Button, Container, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useFormatDateHour } from 'src/utils/iso-date-hour';

import { allLangs, useTranslate } from 'src/locales';
import SettingsButton from 'src/layouts/common/settings-button';
import AccountPopover from 'src/layouts/common/account-popover';
import { LanguagePopover } from 'src/layouts/common/language-popover';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custome-dialog';
import { ErrorData } from 'src/components/error-data/error-data';
import DataGridCustom from 'src/components/data-grid-view/data-grid-custom';

import { baseColumn } from './col';
import { usePagination } from '../hooks/usePagination';
import { useDeleteNotifications, useGetAllNotifications } from '../hooks/useNotification';

export const Notifications = () => {
  const { t } = useTranslate('lang');

  const formatDateHour = useFormatDateHour();
  const navigate = useNavigate();
  const [notificationID, setNotificationID] = useState<string>('');
  const { onPaginationChange, pagination, search, onSearchChange } = usePagination();
  const { deleteNotification, isPending } = useDeleteNotifications();
  const { data, error, isLoading } = useGetAllNotifications({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search,
  });
  const openDialog = useBoolean();

  const onDeleteNotification = async () => {
    await deleteNotification(notificationID);
    openDialog.onFalse();
  };

  if (error) return <ErrorData />;
  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          mb: 2,
          gap: 3,
        }}
      >
        <Box display="flex" width="100%" alignItems="center" justifyContent="space-between" gap={1}>
          <Typography variant="h6" color="textSecondary">
            {t('notification.table.title')} ({data?.notifications.length})
          </Typography>

          <Box display="flex" ml={1} gap={1} alignItems="center">
            <Button
              endIcon={<Iconify icon="proicons:send" />}
              onClick={() => navigate('/dashboard/notifications/send')}
              variant="contained"
              sx={{ mr: 3 }}
            >
              {t('notification.table.send')}
            </Button>
            <LanguagePopover data={allLangs} />
            <SettingsButton />
            <AccountPopover />
          </Box>
        </Box>
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
          <DataGridCustom
            initialState={{ pagination: { paginationModel: pagination } }}
            loading={isLoading}
            data={data?.notifications || []}
            search={search}
            onSearchChange={onSearchChange}
            col={baseColumn({
              onDelete: (id: string) => {
                setNotificationID(id);
                openDialog.onTrue();
              },
              t,
              formatDateHour,
            })}
            hasTotal={false}
            onPaginationModelChange={onPaginationChange}
          />

          <ConfirmDialog
            open={openDialog.value}
            onClose={openDialog.onFalse}
            title={t('notification.actions.delete')}
            content={t('notification.actions.content')}
            action={
              <>
                <Button onClick={openDialog.onFalse} variant="contained" color="error">
                  {t('actions.not')}
                </Button>
                <LoadingButton
                  onClick={onDeleteNotification}
                  variant="contained"
                  color="primary"
                  loading={isPending}
                >
                  {t('actions.yes')}
                </LoadingButton>
              </>
            }
          />
        </Box>
      </Box>
    </Container>
  );
};

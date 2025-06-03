import { useState } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Button,
  Container,
  Typography,
  IconButton,
  CardContent,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { allLangs, useTranslate } from 'src/locales';
import SettingsButton from 'src/layouts/common/settings-button';
import AccountPopover from 'src/layouts/common/account-popover';
import { LanguagePopover } from 'src/layouts/common/language-popover';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custome-dialog';
import { ErrorData } from 'src/components/error-data/error-data';
import Circular from 'src/components/loading-screen/circular-screen';

import { UpdateWarehouse } from '../action/Update';
import { useGetStore } from '../../hooks/useGetStore';
import { CreateWarehouse } from '../action/CreateWarehouse';
import { useDeleteStore } from '../../hooks/useDeleteStore';

export const Store = () => {
  const { t } = useTranslate('lang');
  const [deletedStoreId, setDeletedStoreId] = useState<string>('');
  const [id, setId] = useState<string>('');
  const { data, isLoading, error } = useGetStore();
  const { deleteAsync, isDeleting } = useDeleteStore({ t });
  const openDialog = useBoolean();

  const openDeleteDialog = useBoolean();
  const openUpdateDialog = useBoolean();

  if (isLoading) return <Circular />;
  if (error) return <ErrorData />;
  return (
    <Container maxWidth={false}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">{t('store.info')}</Typography>
        <Box display="flex" ml={1} gap={1} alignItems="center">
          <IconButton onClick={openDialog.onTrue}>
            <Iconify icon="mynaui:plus-solid" width={35} />
          </IconButton>
          <LanguagePopover data={allLangs} />
          <SettingsButton />
          <AccountPopover />
        </Box>
      </Box>
      <Grid container spacing={2} mt={2}>
        {data?.map((store) => (
          <Grid item xs={4}>
            <Card sx={{ position: 'relative' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Iconify icon="bxs:user" color="#98A2B3" width={20} />
                  <Typography variant="body2" fontWeight="600">
                    {store?.receiver}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Iconify icon="mingcute:phone-fill" color="#98A2B3" width={20} />
                  <Typography variant="body2" fontWeight="600">
                    {store?.phone}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Iconify icon="mingcute:time-fill" color="#98A2B3" width={20} />
                  <Typography variant="body2" fontWeight="600">
                    {store?.date}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Iconify icon="ic:baseline-wechat" color="#98A2B3" width={22} />
                  <Typography variant="body2" fontWeight="600">
                    {store?.wechat}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="mingcute:location-line" color="#98A2B3" width={20} />
                  <Typography whiteSpace="pre-wrap" variant="body2" fontWeight="600">
                    {store?.address}
                  </Typography>
                </Box>
              </CardContent>
              <Box position="absolute" zIndex={10} top={5} right={5}>
                <IconButton
                  color="error"
                  onClick={() => {
                    openDeleteDialog.onTrue();
                    setDeletedStoreId(store.id);
                  }}
                >
                  <Iconify icon="hugeicons:delete-01" />
                </IconButton>
                <IconButton
                  color="success"
                  onClick={() => {
                    setId(store.id);
                    openUpdateDialog.onTrue();
                  }}
                >
                  <Iconify icon="hugeicons:edit-02" />
                </IconButton>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <CreateWarehouse open={openDialog.value} onClose={openDialog.onFalse} />
      {id && (
        <UpdateWarehouse open={openUpdateDialog.value} onClose={openUpdateDialog.onFalse} id={id} />
      )}
      <ConfirmDialog
        title={t('store.delete.title')}
        content={t('store.delete.content')}
        open={openDeleteDialog.value}
        action={
          <>
            <Button variant="outlined" color="primary" onClick={openDeleteDialog.onFalse}>
              {t('actions.cancel')}
            </Button>
            <LoadingButton
              loading={isDeleting}
              variant="contained"
              color="error"
              onClick={async () => {
                await deleteAsync(deletedStoreId);
                openDeleteDialog.onFalse();
              }}
            >
              {t('actions.delete')}
            </LoadingButton>
          </>
        }
        onClose={openDeleteDialog.onFalse}
      />
    </Container>
  );
};

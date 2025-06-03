import { useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Button, useTheme, Container, Typography, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useFormatDate } from 'src/utils/iso-date';

import { allLangs, useTranslate } from 'src/locales';
import SettingsButton from 'src/layouts/common/settings-button';
import AccountPopover from 'src/layouts/common/account-popover';
import { LanguagePopover } from 'src/layouts/common/language-popover';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custome-dialog';
import { ErrorData } from 'src/components/error-data/error-data';
import DataGridCustom from 'src/components/data-grid-view/data-grid-custom';

import { baseColumns } from './col';
import { ITruck } from '../../types/truck';
import { useTrucksFilter } from './filter';
import { UpdateTruck } from '../actions/UpdateTruck';
import { useTruckEnumLabels } from '../../libs/truckEnum';
import { CreateNewTruck } from '../actions/CreateNewTruck';
import {
  useGetTrucks,
  useDeleteTruck,
  useArchiveTruck,
  useDeleteTruckMultiple,
  useArchiveTruckMultiple,
} from '../../hooks/trucks';

export const TrucksTable = () => {
  const { t } = useTranslate('lang');
  const formatDate = useFormatDate();
  const truckLabels = useTruckEnumLabels();
  const [rowSelectionModel, setRowSelectionModel] = useState<string[]>([]);
  const openDialog = useBoolean();
  const openEditDialog = useBoolean();
  const confirmDialog = useBoolean();
  const archiveDialog = useBoolean();
  const archiveDialogMultiple = useBoolean();
  const deleteDialogMultiple = useBoolean();
  const [initialValue, setInitialValue] = useState<ITruck>();
  const [truckID, setTruckID] = useState<string>('');
  const [archiveID, setArchiveID] = useState<string>('');
  const { onPaginationChange, pagination, search, onSearchChange } = useTrucksFilter();
  const { data, error, isLoading } = useGetTrucks({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search,
  });
  const { deleteTruck, isPending } = useDeleteTruck();
  const { deleteTruckMultiple, multipending } = useDeleteTruckMultiple(rowSelectionModel);
  const { archiveTruck, archiving } = useArchiveTruck();
  const { archiveTruckMultiple, multiarchiving } = useArchiveTruckMultiple(rowSelectionModel);
  const theme = useTheme();
  const onEdit = (value: ITruck) => {
    setInitialValue(value);
    openEditDialog.onTrue();
  };
  const onDelete = (id: string) => {
    setTruckID(id);
    confirmDialog.onTrue();
  };

  const onArchive = (id: string) => {
    setArchiveID(id);
    archiveDialog.onTrue();
  };

  const onConfirmDelete = async () => {
    if (rowSelectionModel.length) {
      await deleteTruckMultiple();
    } else {
      await deleteTruck(truckID);
    }
    confirmDialog.onFalse();
    deleteDialogMultiple.onFalse();
  };

  const onConfirmArchive = async () => {
    if (rowSelectionModel.length) {
      await archiveTruckMultiple();
    } else {
      await archiveTruck(archiveID);
    }
    archiveDialogMultiple.onFalse();
    archiveDialog.onFalse();
  };

  if (error) return <ErrorData />;
  return (
    <Container maxWidth={false} sx={{ height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h2" display="flex" gap={1}>
          {t('transport.title')}
          <Typography variant="h4" color={theme.palette.grey[400]}>
            ({data?.trucks.length})
          </Typography>
        </Typography>
        <Box display="flex" alignItems="center">
          <IconButton onClick={openDialog.onTrue}>
            <Iconify icon="gravity-ui:plus" width={25} />
          </IconButton>
          <Box display="flex" ml={1} gap={1}>
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
          <DataGridCustom<ITruck>
            data={data?.trucks || []}
            loading={isLoading}
            col={baseColumns({
              edit: onEdit,
              remove: onDelete,
              archive: onArchive,
              t,
              truckLabels,
              formatDate,
            })}
            search={search}
            onSearchChange={onSearchChange}
            hasTotal={false}
            onPaginationModelChange={onPaginationChange}
            initialState={{ pagination: { paginationModel: pagination } }}
            checkBoxSelection
            rowSelectionModel={rowSelectionModel}
            setRowSelectionModel={setRowSelectionModel}
            multiStatusAction={() => archiveDialogMultiple.onTrue()}
            multiStatusTitle={t('actions.archive')}
            multiStatusComponent={
              <Button onClick={deleteDialogMultiple.onTrue} color="error" variant="contained">
                {t('actions.delete')}
              </Button>
            }
          />
        </Box>
      </Box>
      <CreateNewTruck open={openDialog.value} onClose={openDialog.onFalse} />
      {initialValue && (
        <UpdateTruck
          initialValue={initialValue}
          open={openEditDialog.value}
          onClose={openEditDialog.onFalse}
        />
      )}
      <ConfirmDialog
        open={confirmDialog.value}
        title={t('transport.actions.deleteTruck')}
        content={t('transport.actions.confirmDeletion')}
        action={
          <>
            <Button onClick={confirmDialog.onFalse} variant="contained" color="error">
              {t('actions.not')}
            </Button>
            <LoadingButton
              loading={isPending || multipending}
              onClick={onConfirmDelete}
              variant="contained"
              color="primary"
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
        onClose={confirmDialog.onFalse}
      />

      <ConfirmDialog
        open={archiveDialog.value}
        title={t('transport.actions.archiveTruck')}
        content={t('transport.actions.confirmArchive')}
        action={
          <>
            <Button onClick={onConfirmArchive} variant="contained" color="error">
              {t('actions.not')}
            </Button>
            <LoadingButton onClick={onConfirmArchive} variant="contained" color="primary">
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
        onClose={archiveDialog.onFalse}
      />

      <ConfirmDialog
        open={deleteDialogMultiple.value}
        title={t('transport.actions.doubleDelete')}
        action={
          <>
            <Button onClick={deleteDialogMultiple.onFalse} variant="contained" color="error">
              {t('actions.not')}
            </Button>
            <LoadingButton
              loading={isPending || multipending}
              onClick={onConfirmDelete}
              variant="contained"
              color="primary"
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
        onClose={deleteDialogMultiple.onFalse}
      />
      <ConfirmDialog
        open={archiveDialogMultiple.value}
        title={t('transport.actions.doubleArchive')}
        action={
          <>
            <Button onClick={archiveDialogMultiple.onFalse} variant="contained" color="error">
              {t('actions.not')}
            </Button>
            <LoadingButton
              loading={archiving || multiarchiving}
              onClick={onConfirmArchive}
              variant="contained"
              color="primary"
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
        onClose={archiveDialogMultiple.onFalse}
      />
    </Container>
  );
};

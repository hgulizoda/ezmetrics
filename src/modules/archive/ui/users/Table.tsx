import { useState } from 'react';

import { Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';

import { useUserStatusLabels } from 'src/types/UserStatus';

import { baseColumns } from './col';
import { useBoolean } from '../../../../hooks/use-boolean';
import { useArchivePagination } from '../../hooks/usePagination';
import { ConfirmDialog } from '../../../../components/custome-dialog';
import { ErrorData } from '../../../../components/error-data/error-data';
import DataGridCustom from '../../../../components/data-grid-view/data-grid-custom';
import { useDeleteUser, useUnarchiveUser, useGetArchivedUsers } from '../../hooks/useUser';

export const ArchivedUsers = () => {
  const userStatus = useUserStatusLabels();
  const { t } = useTranslate('lang');
  const { pagination, onPaginationChange, search, onSearchChange } = useArchivePagination();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [deleteIDs, setDeleteID] = useState<string>('');
  const [unarchiveIDs, setUnarchiveID] = useState<string>('');
  const { onDeleting, isDeleting } = useDeleteUser({
    selectedUsers,
    params: {
      page: pagination.page + 1,
      limit: pagination.pageSize,
      search,
    },
  });
  const { onUnarchiving, isUnarchiving } = useUnarchiveUser({
    selectedUsers,
  });
  const deleteConfirm = useBoolean();
  const unarchiveConfirm = useBoolean();
  const multiConfirmDelete = useBoolean();
  const multiConfirmArchive = useBoolean();
  const { data, error, isLoading } = useGetArchivedUsers({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search,
  });
  const unarchive = (id: string) => {
    setUnarchiveID(id);
    unarchiveConfirm.onTrue();
  };

  const onDeleteUser = (id: string) => {
    setDeleteID(id);
    deleteConfirm.onTrue();
  };

  const deleteUser = async () => {
    await onDeleting(deleteIDs);
    multiConfirmDelete.onFalse();
  };
  const unarchiveUser = async () => {
    await onUnarchiving(unarchiveIDs);
    multiConfirmArchive.onFalse();
  };

  if (error) return <ErrorData />;

  return (
    <>
      <DataGridCustom
        col={baseColumns({
          unarchive,
          onDeleteUser,
          isMultiple: selectedUsers.length > 0,
          t,
          userStatus,
        })}
        data={data?.users || []}
        search={search}
        onSearchChange={onSearchChange}
        hasTotal={false}
        checkBoxSelection
        rowSelectionModel={selectedUsers}
        setRowSelectionModel={setSelectedUsers}
        multiStatusAction={multiConfirmArchive.onTrue}
        loading={isLoading}
        onPaginationModelChange={onPaginationChange}
        initialState={{ pagination: { paginationModel: pagination } }}
        multiStatusTitle={t('archive.takeArchive')}
        multiStatusComponent={
          <Button onClick={multiConfirmDelete.onTrue} color="error" variant="contained">
            {t('actions.delete')}
          </Button>
        }
      />
      <ConfirmDialog
        open={deleteConfirm.value}
        onClose={deleteConfirm.onFalse}
        title={t('archive.actions.userDelete')}
        action={
          <>
            <Button variant="contained" color="error" onClick={deleteConfirm.onFalse}>
              {t('actions.not')}
            </Button>
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={deleteUser}
              loading={isDeleting}
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
      />
      <ConfirmDialog
        open={unarchiveConfirm.value}
        onClose={unarchiveConfirm.onFalse}
        title={t('archive.actions.userUnArchive')}
        action={
          <>
            <Button variant="contained" color="error" onClick={unarchiveConfirm.onFalse}>
              {t('actions.not')}
            </Button>
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={unarchiveUser}
              loading={isUnarchiving}
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
      />
      <ConfirmDialog
        open={multiConfirmArchive.value}
        onClose={multiConfirmArchive.onFalse}
        title={t('archive.actions.multiArchive')}
        action={
          <>
            <Button variant="contained" color="error" onClick={multiConfirmArchive.onFalse}>
              {t('actions.not')}
            </Button>
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={unarchiveUser}
              loading={isUnarchiving}
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
      />
      <ConfirmDialog
        open={multiConfirmDelete.value}
        onClose={multiConfirmDelete.onFalse}
        title={t('archive.actions.multiDelete')}
        action={
          <>
            <Button variant="contained" color="error" onClick={multiConfirmDelete.onFalse}>
              {t('actions.not')}
            </Button>
            <LoadingButton
              variant="contained"
              color="primary"
              onClick={deleteUser}
              loading={isDeleting}
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
      />
    </>
  );
};

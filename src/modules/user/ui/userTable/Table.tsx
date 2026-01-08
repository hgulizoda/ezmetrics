import { useRef, useMemo, useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Button, useTheme, Container, Typography, IconButton } from '@mui/material';

import { useFormatDateHour } from 'src/utils/iso-date-hour';

import { allLangs, useTranslate } from 'src/locales';
import SettingsButton from 'src/layouts/common/settings-button';
import AccountPopover from 'src/layouts/common/account-popover';
import { LanguagePopover } from 'src/layouts/common/language-popover';

import { ErrorData } from 'src/components/error-data/error-data';
import DataGridCustom from 'src/components/data-grid-view/data-grid-custom';

import { useUserStatusLabels } from 'src/types/UserStatus';

import { baseColumns } from './col';
import { IUser } from '../../types/User';
import { useUsersFilter } from './useUsersFilter';
import { IUserId } from '../../../../types/UserId';
import { CreateUser } from '../actions/CreateUser';
import Iconify from '../../../../components/iconify';
import { useBoolean } from '../../../../hooks/use-boolean';
import { GiveVerification } from '../actions/GiveVerification';
import { getMatchingObjects } from '../../../package/libs/sortByID';
import { ConfirmDialog } from '../../../../components/custome-dialog';
import { useDeleteUser, useGetUsersList, useDeleteUserMultiple } from '../../hook/user';

interface IProps extends IUserId {
  isVerified: boolean;
}

const UsersTable = () => {
  const formatDate = useFormatDateHour();
  const [rowSelectionModel, setRowSelectionModel] = useState<string[]>([]);
  const { t } = useTranslate('lang');
  const userStatus = useUserStatusLabels();
  const { deleteUser, isDeleting } = useDeleteUser();
  const { deleteUserMultiple, isDeletingMultipe } = useDeleteUserMultiple(rowSelectionModel);
  const [verifyStatus, setVerifyStatus] = useState<string>('');
  const theme = useTheme();
  const confirm = useBoolean();
  const archive = useBoolean();
  const { onPaginationChange, pagination, search, onSearchChange } = useUsersFilter();
  const { data, isLoading, error } = useGetUsersList({
    page: pagination.page + 1,
    limit: pagination.pageSize,
    search,
  });
  const [usersID, setUsersID] = useState<IProps>({ id: '', userId: '', isVerified: false });
  const [deleteUserId, setDeleteUser] = useState<string>();
  const openDialog = useBoolean();

  const handleVerification = (id: string, userId: string, isVerified: boolean) => {
    setUsersID({ id, userId, isVerified });
    confirm.onTrue();
  };

  const openVerifyModal = () => {
    setVerifyStatus('verify');
    confirm.onTrue();
  };
  const openUnVerifyModal = () => {
    setVerifyStatus('unverify');
    confirm.onTrue();
  };

  const onArchiveMultiple = () => {
    archive.onTrue();
  };

  const openConfirmModalDelete = useBoolean();

  const selectedUsers = getMatchingObjects(data.users, rowSelectionModel);

  const onDeleteUser = (id: string) => {
    setDeleteUser(id);
    openConfirmModalDelete.onTrue();
  };

  const rowCountRef = useRef(data?.pagination?.total_records || 0);

  const rowCount = useMemo(() => {
    if (data?.pagination?.total_records !== undefined) {
      rowCountRef.current = data.pagination.total_records;
    }
    return rowCountRef.current;
  }, [data?.pagination?.total_records]);

  if (error || !data) return <ErrorData />;

  return (
    <Container maxWidth={false} sx={{ height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          gap: 3,
          mb: 2,
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4" component="h2" display="flex" gap={1}>
          {t('users.title')}
          <Typography variant="h4" color={theme.palette.grey[400]}>
            ({data.users.length})
          </Typography>
        </Typography>
        <Box display="flex" ml={1} gap={1}>
          <IconButton onClick={openDialog.onTrue}>
            <Iconify icon="gravity-ui:plus" width={25} />
          </IconButton>
          <LanguagePopover data={allLangs} />
          <SettingsButton />
          <AccountPopover />
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
          <DataGridCustom<IUser>
            data={data.users}
            loading={isLoading}
            col={baseColumns({ handleVerification, onDeleteUser, t, userStatus, formatDate })}
            rowCount={rowCount}
            onPaginationModelChange={onPaginationChange}
            initialState={{ pagination: { paginationModel: pagination } }}
            rowSelectionModel={rowSelectionModel}
            setRowSelectionModel={setRowSelectionModel}
            checkBoxSelection
            multiStatusAction={openVerifyModal}
            hasTotal={false}
            multiStatusComponent={
              <>
                <Button onClick={onArchiveMultiple} variant="contained" color="inherit">
                  {t('actions.archive')}
                </Button>
                <Button onClick={openUnVerifyModal} variant="contained" color="error">
                  {t('actions.cancel')}
                </Button>
              </>
            }
            multiStatusTitle={t('users.actions.giveVerification')}
            onSearchChange={onSearchChange}
            search={search}
            getRowClassName={({ row }) => row.isBonusEnabled ? '' : 'colored-row'}
          />
        </Box>

        <GiveVerification
          onClose={confirm.onFalse}
          open={confirm.value}
          userId={usersID}
          rowIDs={selectedUsers}
          status={verifyStatus}
        />
      </Box>
      <CreateUser open={openDialog.value} onClose={openDialog.onFalse} />

      {deleteUserId && (
        <ConfirmDialog
          open={openConfirmModalDelete.value}
          action={
            <LoadingButton
              onClick={async () => {
                await deleteUser(deleteUserId);
                openConfirmModalDelete.onFalse();
              }}
              color="primary"
              variant="contained"
              loading={isDeleting}
            >
              {t('actions.save')}
            </LoadingButton>
          }
          title={t('users.confirm.title')}
          onClose={openConfirmModalDelete.onFalse}
          content={t('users.confirm.extra')}
        />
      )}

      {deleteUserId && (
        <ConfirmDialog
          open={openConfirmModalDelete.value}
          action={
            <>
              <Button onClick={openConfirmModalDelete.onFalse} color="error" variant="contained">
                {t('actions.not')}
              </Button>
              <LoadingButton
                onClick={async () => {
                  await deleteUser(deleteUserId);
                  openConfirmModalDelete.onFalse();
                }}
                color="primary"
                variant="contained"
                loading={isDeleting}
              >
                {t('actions.yes')}
              </LoadingButton>
            </>
          }
          title={t('users.confirm.title')}
          onClose={openConfirmModalDelete.onFalse}
          content={t('users.confirm.extra')}
        />
      )}

      <ConfirmDialog
        open={archive.value}
        action={
          <>
            <Button onClick={archive.onFalse} color="error" variant="contained">
              {t('actions.not')}
            </Button>
            <LoadingButton
              onClick={async () => {
                await deleteUserMultiple();
                archive.onFalse();
              }}
              color="primary"
              variant="contained"
              loading={isDeletingMultipe}
            >
              {t('actions.yes')}
            </LoadingButton>
          </>
        }
        title={t('users.confirm.title')}
        onClose={openConfirmModalDelete.onFalse}
        content={t('users.confirm.extra')}
      />
    </Container>
  );
};

export default UsersTable;

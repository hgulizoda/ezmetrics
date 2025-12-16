import { useParams } from 'react-router';
import { useRef, useMemo, useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { DataGrid, gridClasses, GridPaginationModel } from '@mui/x-data-grid';
import { Box, Card, Button, Dialog, Container, CardHeader, CardContent } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { TruckOrderDetail } from 'src/modules/settings/ui/truckDetails/TruckOrderDetail';

import { ConfirmDialog } from 'src/components/custome-dialog';
import Circular from 'src/components/loading-screen/circular-screen';

import { baseColumn } from './col';
import { useGetSingleUsers } from '../../services/useGetSingleUsers';
import { useRemoveBonus } from '../../services/useRemoveSingeOrderBall';

export const UsersBonusSingle = () => {
  const { t } = useTranslate('lang');
  const { isPending: isDeleting, mutateAsync: deleteAsync } = useRemoveBonus();
  const [rowSelectionModel, setRowSelectionModel] = useState<string[]>([]);
  const params = useParams() as { id: string; name: string };
  const [orderID, setOrderID] = useState<string>();
  const viewOrder = useBoolean();
  const isMultipleDelete = useBoolean();
  const [orderBallId, setOrderBallId] = useState<string>();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 100,
  });
  const openRemove = useBoolean();
  const { data, isLoading } = useGetSingleUsers({
    id: params.id,
    params: {
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
    },
  });

  const rowCountRef = useRef(data?.total_records || 0);

  const rowCount = useMemo(() => {
    if (data?.total_records !== undefined) {
      rowCountRef.current = data?.total_records;
    }
    return rowCountRef.current;
  }, [data?.total_records]);

  const deleteMultipleOrderBall = async () => {
    try {
      await Promise.all(
        rowSelectionModel.map(async (id) => {
          if (id) {
            await deleteAsync(id);
          }
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <Circular />;
  return (
    <Container maxWidth="xl">
      <Card>
        <CardHeader
          title={params.name}
          action={
            rowSelectionModel.length > 0 ? (
              <Button onClick={isMultipleDelete.onTrue} variant="contained" color="error">
                {t('actions.delete')}
              </Button>
            ) : null
          }
        />
        <CardContent
          sx={{
            px: 0,
            ':last-child': {
              pb: 0,
            },
          }}
        >
          <Box>
            <DataGrid
              checkboxSelection
              columns={baseColumn({
                onRemove(id) {
                  setOrderBallId(id);
                  openRemove.onTrue();
                },
                onView(id) {
                  setOrderID(id);
                  viewOrder.onTrue();
                },
                t,
              })}
              sx={{
                [`& .${gridClasses.cell}`]: {
                  borderBottom: 'none',
                },
              }}
              rows={data?.orders}
              rowSelectionModel={rowSelectionModel}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel as string[]);
              }}
              loading={isLoading}
              rowCount={rowCount}
              getRowId={(row) => row.id || crypto.randomUUID()}
              onPaginationModelChange={setPaginationModel}
              initialState={{
                pagination: { paginationModel },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {orderBallId && (
        <ConfirmDialog
          open={openRemove.value}
          onClose={openRemove.onFalse}
          title={t('actions.delete')}
          content={t('bonus.singleUser.removeSingle')}
          action={
            <>
              <Button variant="outlined" color="inherit" onClick={openRemove.onFalse}>
                {t('actions.cancel')}
              </Button>
              <LoadingButton
                loading={isDeleting}
                onClick={async () => {
                  await deleteAsync(orderBallId);
                  openRemove.onFalse();
                }}
                variant="contained"
                color="error"
              >
                {t('actions.delete')}
              </LoadingButton>
            </>
          }
        />
      )}

      {rowSelectionModel.length > 0 && (
        <ConfirmDialog
          open={isMultipleDelete.value}
          onClose={isMultipleDelete.onFalse}
          title={t('actions.delete')}
          content={t('bonus.singleUser.removeMultiple')}
          action={
            <>
              <Button variant="outlined" color="inherit" onClick={isMultipleDelete.onFalse}>
                {t('actions.cancel')}
              </Button>
              <LoadingButton
                loading={isDeleting}
                onClick={deleteMultipleOrderBall}
                variant="contained"
                color="error"
              >
                {t('actions.delete')}
              </LoadingButton>
            </>
          }
        />
      )}

      {orderID && (
        <Dialog
          open={viewOrder.value}
          onClose={viewOrder.onFalse}
          fullWidth
          maxWidth="md"
          scroll="body"
        >
          <TruckOrderDetail orderID={orderID} onClose={viewOrder.onFalse} />
        </Dialog>
      )}
    </Container>
  );
};

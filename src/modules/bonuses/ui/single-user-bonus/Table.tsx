import { useState } from 'react';
import { useParams } from 'react-router';

import { LoadingButton } from '@mui/lab';
import { DataGrid, gridClasses, GridPaginationModel } from '@mui/x-data-grid';
import { Box, Card, Button, Dialog, Container, CardHeader, CardContent } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { TruckOrderDetail } from 'src/modules/settings/ui/truckDetails/TruckOrderDetail';

import { ConfirmDialog } from 'src/components/custome-dialog';
import Circular from 'src/components/loading-screen/circular-screen';

import { baseColumn } from './col';
import { useGetSingleUsers } from '../../services/useGetSingleUsers';
import { useRemoveBonus } from '../../services/useRemoveSingeOrderBall';

export const UsersBonusSingle = () => {
  const params = useParams() as { id: string; name: string };
  const [orderID, setOrderID] = useState<string>();
  const viewOrder = useBoolean();
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

  const { isPending, mutateAsync } = useRemoveBonus();
  if (isLoading) return <Circular />;
  return (
    <Container maxWidth="xl">
      <Card>
        <CardHeader title={params.name} />
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
              columns={baseColumn({
                onRemove(id) {
                  setOrderBallId(id);
                  openRemove.onTrue();
                },
                onView(id) {
                  setOrderID(id);
                  viewOrder.onTrue();
                },
              })}
              sx={{
                [`& .${gridClasses.cell}`]: {
                  borderBottom: 'none',
                },
              }}
              rows={data?.orders}
              loading={isLoading}
              rowCount={data?.total_records || 0}
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
          title="O'chirish"
          content="Order uchun berilgan ballni olib tashlash"
          action={
            <>
              <Button variant="outlined" color="inherit" onClick={openRemove.onFalse}>
                Bekor qilish
              </Button>
              <LoadingButton
                loading={isPending}
                onClick={async () => {
                  await mutateAsync(orderBallId);
                  openRemove.onFalse();
                }}
                variant="contained"
                color="error"
              >
                O&apos;chirish
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

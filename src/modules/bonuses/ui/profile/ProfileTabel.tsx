import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Box, Card, TextField, CardHeader } from '@mui/material';

import { baseColumns } from '../col';
import { useBonusesFilter } from '../useFilter';
import { useTranslate } from '../../../../locales';
import { useUnuseBouns } from '../../services/unUseBonus';
import { useUpdateStatus } from '../../services/updateStatus';
import { useGetUserBonuses } from '../../services/getUserBonus';
import { ErrorData } from '../../../../components/error-data/error-data';

const BonusesProfileView = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<string>(searchParams.get('bonusID') ?? '');
  const { t } = useTranslate('lang');
  const params = useParams();

  const { onPaginationChange, pagination: paginationInfo } = useBonusesFilter();

  const { bonuses, pagination, isLoading } = useGetUserBonuses(params.id!);

  const { updateBunusStatus } = useUpdateStatus();
  const { unuseBouns } = useUnuseBouns();

  const handleUpdateStatus = async (bonus_id: string, user_id: string) => {
    await updateBunusStatus({ bonus_id, user_id });
  };
  const handleUnuseBonuse = async (bonus_id: string, user_id: string) => {
    await unuseBouns({ bonus_id, user_id });
  };

  const filteredBonuses = useMemo(() => {
    if (!search) return bonuses;
    return bonuses.filter((e) => e._id === search);
  }, [bonuses, search]);

  if (!bonuses) return <ErrorData />;

  return (
    <Box sx={{ height: '100%' }}>
      <Box position="relative">
        <Box
          sx={{
            borderRadius: '16px',
            border: '1px solid #919EAB1F',
            boxShadow: '0px 12px 24px -4px #919EAB1F',
            overflow: 'hidden',
            width: '100%',
          }}
        >
          <Card>
            <CardHeader
              sx={{ pb: 2 }}
              action={
                <TextField
                  size="small"
                  fullWidth
                  sx={{
                    width: 300,
                  }}
                  onChange={(e) => setSearch(e.target.value)}
                  label="ID"
                  value={search}
                  defaultValue={searchParams.get('bonusID') ?? ''}
                />
              }
              title="User bonuses"
            />
            <DataGrid
              rows={filteredBonuses}
              columns={baseColumns({ t, handleUpdateStatus, handleUnuseBonuse })}
              loading={isLoading}
              rowCount={pagination.total_records}
              onPaginationModelChange={onPaginationChange}
              initialState={{ pagination: { paginationModel: paginationInfo } }}
              getRowId={(row) => row._id || crypto.randomUUID()}
              sx={{
                [`& .${gridClasses.cell}`]: {
                  borderBottom: 'none',
                },
              }}
            />
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default BonusesProfileView;

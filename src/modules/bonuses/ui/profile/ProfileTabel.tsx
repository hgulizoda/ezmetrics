import { useParams, useSearchParams } from 'react-router-dom';

import { Box, Button } from '@mui/material';

import { baseColumns } from '../col';
import { useBonusesFilter } from '../useFilter';
import { useTranslate } from '../../../../locales';
import { IBonusesList } from '../../types/BunusesList';
import { useUnuseBouns } from '../../services/unUseBonus';
import { useUpdateStatus } from '../../services/updateStatus';
import { useGetUserBonuses } from '../../services/getUserBonus';
import { ErrorData } from '../../../../components/error-data/error-data';
import DataGridCustom from '../../../../components/data-grid-view/data-grid-custom';

const BonusesProfileView = () => {
  const { t } = useTranslate('lang');
  const { id } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const { onPaginationChange, pagination: paginationInfo } = useBonusesFilter();

  const { bonuses, pagination, isLoading } = useGetUserBonuses(
    {
      page: paginationInfo.page + 1,
      limit: paginationInfo.pageSize,
    },
    id!
  );
  const { updateBunusStatus } = useUpdateStatus();
  const { unuseBouns } = useUnuseBouns();

  const handleUpdateStatus = async (bonus_id: string, user_id: string) => {
    await updateBunusStatus({ bonus_id, user_id });
  };
  const handleUnuseBonuse = async (bonus_id: string, user_id: string) => {
    await unuseBouns({ bonus_id, user_id });
  };

  if (!bonuses) return <ErrorData />;

  return (
    <Box sx={{ height: '100%' }}>
      <Box position="relative">
        <Box
          position="absolute"
          left={10}
          top={25}
          zIndex={999}
          maxWidth={480}
          gap={2}
          display="flex"
        >
          <Button
            variant={searchParams.get('status') === null ? 'contained' : 'outlined'}
            onClick={() =>
              setSearchParams((prev) => {
                const parns = new URLSearchParams(prev);
                parns.delete('status');
                return parns;
              })
            }
          >
            {t('bonus.all')}
          </Button>
          <Button
            variant={searchParams.get('status') === 'used' ? 'contained' : 'outlined'}
            onClick={() => setSearchParams((prev) => ({ ...prev, status: 'used' }))}
          >
            {t('bonus.used')}
          </Button>
          <Button
            variant={searchParams.get('status') === 'not_used' ? 'contained' : 'outlined'}
            onClick={() => setSearchParams((prev) => ({ ...prev, status: 'not_used' }))}
          >
            {t('bonus.notUsed')}
          </Button>
          <Button
            variant={searchParams.get('status') === 'in_progress' ? 'contained' : 'outlined'}
            onClick={() => setSearchParams((prev) => ({ ...prev, status: 'in_progress' }))}
          >
            {t('bonus.enum.in_progress')}
          </Button>
        </Box>
        <Box
          sx={{
            borderRadius: '16px',
            border: '1px solid #919EAB1F',
            boxShadow: '0px 12px 24px -4px #919EAB1F',
            overflow: 'hidden',
            width: '100%',
          }}
        >
          <Box height={700} p={1} sx={{ width: '100%' }}>
            <DataGridCustom<IBonusesList>
              data={bonuses}
              col={baseColumns({ t, handleUpdateStatus, handleUnuseBonuse })}
              loading={isLoading}
              rowCount={pagination.total_records}
              onPaginationModelChange={onPaginationChange}
              isSearch={false}
              search=""
              onSearchChange={() => {}}
              initialState={{ pagination: { paginationModel: paginationInfo } }}
              hasTotal={false}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BonusesProfileView;

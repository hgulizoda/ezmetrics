import { Box } from '@mui/material';

import { baseColumns } from './col';
import { useBonusesFilter } from './useFilter';
import { useTranslate } from '../../../locales';
import { IBonusesList } from '../types/BunusesList';
import { useGetAllBonuses } from '../services/getAll';
import { useUpdateStatus } from '../services/updateStatus';
import { ErrorData } from '../../../components/error-data/error-data';
import DataGridCustom from '../../../components/data-grid-view/data-grid-custom';

const BonusesView = () => {
  const { t } = useTranslate('lang');

  const {
    onPaginationChange,
    pagination: paginationInfo,
    onSearchChange,
    search,
  } = useBonusesFilter();

  const { bonuses, pagination, isLoading } = useGetAllBonuses({
    page: paginationInfo.page + 1,
    limit: paginationInfo.pageSize,
    search,
  });
  const { updateBunusStatus } = useUpdateStatus();

  const handleUpdateStatus = async (bonus_id: string, user_id: string) => {
    await updateBunusStatus({ bonus_id, user_id });
  };

  if (!bonuses) return <ErrorData />;

  return (
    <Box sx={{ height: '100%' }}>
      <h1>{t('bonus.title')}</h1>
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
            col={baseColumns({ t, handleUpdateStatus })}
            loading={isLoading}
            rowCount={pagination.total_records}
            onPaginationModelChange={onPaginationChange}
            initialState={{ pagination: { paginationModel: paginationInfo } }}
            onSearchChange={onSearchChange}
            search={search}
            hasTotal={false}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BonusesView;

import { TFunction } from 'i18next';

import { Box } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

import { fNumber } from 'src/utils/format-number';

import Label, { LabelColor } from 'src/components/label';

import { Bonus } from '../types/BunusesList';

interface Props {
  t: TFunction;
}

export const baseColumns = ({ t }: Props): GridColDef<Bonus>[] => {
  const bonusStatus = {
    not_used: t('bonus.notUsed'),
    used: t('bonus.used'),
    in_progress: t('bonus.enum.in_progress'),
  };

  const bonusColor = {
    not_used: 'secondary',
    used: 'success',
    in_progress: 'warning',
  };

  return [
    {
      field: 'ball',
      headerName: t('bonus.table.ball'),
      flex: 1,
      renderCell: ({ row }) => <Box>{fNumber(row.ball)}</Box>,
    },
    {
      field: 'total_capacity',
      headerName: t('bonus.table.capacity'),
      flex: 1,
      renderCell: ({ row }) => <Box>{fNumber(row.total_capacity)}</Box>,
    },
    {
      field: 'total_weight',
      headerName: t('bonus.table.weight'),
      flex: 1,
      renderCell: ({ row }) => <Box>{fNumber(row.total_weight)}</Box>,
    },
    {
      field: 'status',
      headerName: t('bonus.table.status'),
      flex: 1,
      renderCell: ({ row }) => {
        const status = row.status as keyof typeof bonusStatus;
        return <Label color={bonusColor[status] as LabelColor}>{bonusStatus[status]}</Label>;
      },
    },
    {
      field: '_id',
      headerName: 'ID',
      flex: 1,
    },
  ];
};

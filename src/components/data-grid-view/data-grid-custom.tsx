import React, { useState } from 'react';

import Box from '@mui/material/Box';
import { Button, useTheme, TextField, Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  gridClasses,
  GridDensity,
  GridPagination,
  GridValidRowModel,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { fNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import EmptyContent from 'src/components/empty-content';

import Iconify from '../iconify';
import { Density } from '../density/Density';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

interface IProps<T> extends Omit<React.ComponentProps<typeof DataGrid>, 'columns' | 'rows'> {
  data: T[];
  col: GridColDef[];
  loading: boolean;
  multiStatusAction?: () => void;
  multiStatusComponent?: React.ReactNode;
  multiStatusTitle?: string;
  setRowSelectionModel?: React.Dispatch<React.SetStateAction<string[]>>;
  rowSelectionModel?: string[];
  checkBoxSelection?: boolean;
  onSearchChange: (e: string) => void;
  hasTotal?: boolean;
  search: string;
  isSearch?: boolean;
  filterComponent?: React.ReactNode;
  totals?: {
    total_capacity: number;
    total_weight: number;
    average_weight?: number;
    counts?: number;
    places?: number;
  };
  multiStatusIcon?: string;
}

const HIDE_COLUMNS = {
  id: false,
};

export default function DataGridCustom<T>({
  data: rows,
  col,
  loading,
  multiStatusAction,
  setRowSelectionModel,
  rowSelectionModel,
  checkBoxSelection,
  totals,
  hasTotal = true,
  isSearch = true,
  rowCount = rows.length,
  filterComponent,
  multiStatusTitle,
  multiStatusComponent,
  multiStatusIcon,
  onSearchChange,
  search,
  ...props
}: IProps<T>) {
  const { t } = useTranslate('lang');
  const theme = useTheme();
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const [density, setDensity] = useState<GridDensity>('standard');

  const fPlaces = fNumber(totals?.places ?? 0);
  const fCounts = fNumber(totals?.counts ?? 0);

  const CustomeFooter = (
    <Box
      display="flex"
      alignItems="center"
      pl={2}
      sx={{
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      {hasTotal && (
        <Box display="flex" alignItems="center" width={1} gap={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="subtitle2">
              {t('packages.actions.totalPackagesCapacity')}:
            </Typography>
            <Box display="flex" gap={1}>
              <Typography variant="subtitle2">
                {fNumber(totals?.total_capacity ?? 0) || 0} {t('profile.ordersTabs.card.m3')}
              </Typography>
              -
              <Typography variant="subtitle2">
                {fNumber(totals?.total_weight ?? 0) || 0} {t('profile.ordersTabs.card.kg')};
              </Typography>
              -
              {totals?.average_weight ? (
                <Typography variant="subtitle2">
                 ({totals?.average_weight?.toFixed(1) || 0} {t('profile.ordersTabs.card.kg')});
                </Typography>
              ): null}
              
              {totals?.places && (
                <Typography variant="subtitle2">
                  {t('profile.ordersTabs.card.places')}: {fPlaces};
                </Typography>
              )}
              {totals?.counts && (
                <Typography variant="subtitle2">
                  {t('profile.ordersTabs.card.counts')}: {fCounts}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
      <GridPagination />
    </Box>
  );

  return (
    <Box position="relative" height="100%">
      {isSearch && (
        <Box position="absolute" width={250} left={16} top={12} zIndex={100}>
          <TextField
            fullWidth
            placeholder={t('actions.search')}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </Box>
      )}
      {!rowSelectionModel?.length && (
        <Box position="absolute" right={16} top={22} zIndex={100}>
          <Density onDensityChange={setDensity} />
        </Box>
      )}
      <DataGrid
        loading={loading}
        sx={{
          [`& .${gridClasses.cell}`]: {
            borderBottom: 'none',
            borderRight: `1px solid ${theme.palette.divider}`,
            ':focus-within': {
              outline: 'none',
            },
          },
          [`& .${gridClasses.row}`]: { borderBottom: 'none' },
          '& .MuiTablePagination-selectLabel': { display: 'none' },
          '& .MuiDataGrid-toolbarContainer': { py: 3 },
        }}
        disableRowSelectionOnClick
        rows={rows as GridValidRowModel[]}
        getRowId={(row) => row.id}
        columns={col}
        editMode="cell"
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
        slots={{
          toolbar: () => (
            <GridToolbarContainer>
              <Box sx={{ flexGrow: 1 }} />
              {!rowSelectionModel?.length ? (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <GridToolbarColumnsButton
                    slotProps={{
                      button: {
                        style: {
                          fontSize: 0,
                          width: 30,
                          minWidth: 0,
                          display: 'flex',
                          justifyContent: 'center',
                        },
                        startIcon: <Iconify icon="mdi:eye" sx={{ mr: -1 }} width={22} />,
                      },
                    }}
                  />
                  <Box pr={4}>{filterComponent}</Box>
                </Box>
              ) : (
                <Box display="flex" alignItems="center" gap={2}>
                  {multiStatusComponent}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={multiStatusAction}
                    endIcon={multiStatusIcon && <Iconify icon={multiStatusIcon} />}
                  >
                    {multiStatusTitle}
                  </Button>
                </Box>
              )}
            </GridToolbarContainer>
          ),
          noRowsOverlay: () => <EmptyContent title={t('packages.actions.dataNotFound')} />,
          noResultsOverlay: () => <EmptyContent title={t('packages.actions.noResultsFound')} />,
          footer: () => CustomeFooter,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          if (setRowSelectionModel) {
            setRowSelectionModel(newRowSelectionModel as string[]);
          }
        }}
        rowSelectionModel={rowSelectionModel}
        checkboxSelection={checkBoxSelection}
        paginationMode="server"
        rowCount={rowCount}
        density={density}
        {...props}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

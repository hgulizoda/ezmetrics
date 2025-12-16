/* eslint-disable no-nested-ternary */
import { useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import {
  Card,
  Dialog,
  Button,
  Divider,
  Container,
  CardHeader,
  Typography,
  CardContent,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import { ConfirmDialog } from 'src/components/custome-dialog';

import { sugCol } from './sugCol';
import { useGetSuggestions } from '../hooks/useGetSuggestions';
import { FeedbackItem, SuggestionEnum } from '../types/suggestions';
import { useDeleteSuggestions } from '../hooks/useDeleteSuggestions';

export const Suggestions = () => {
  const { t } = useTranslate('lang');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 25,
  });
  const { data, isLoading } = useGetSuggestions({
    params: {
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
    },
  });
  const [suggestions, setSuggestions] = useState<FeedbackItem>();
  const [suggestionsId, setSuggestionsId] = useState<string>('');
  const { isPending, mutateAsync } = useDeleteSuggestions(suggestionsId);
  const openView = useBoolean();
  const openDelete = useBoolean();

  return (
    <Container maxWidth="xl">
      <Card>
        <CardHeader title={t('feedbacks.suggestions')} />
        <CardContent
          sx={{
            px: 0,
            ':last-child': { pb: 0 },
          }}
        >
          <DataGrid
            columns={sugCol({
              onView: (item) => {
                setSuggestions(item);
                openView.onTrue();
              },
              onDelete(id) {
                setSuggestionsId(id);
                openDelete.onTrue();
              },
              t,
            })}
            rows={data?.suggestions || []}
            loading={isLoading}
            getRowId={(row) => row.id || crypto.randomUUID()}
            sx={{
              [`& .${gridClasses.cell}`]: {
                borderBottom: 'none',
              },
            }}
            rowCount={data?.totalRecords ?? 0}
            onPaginationModelChange={setPaginationModel}
            initialState={{
              pagination: { paginationModel },
            }}
          />
        </CardContent>
      </Card>

      {suggestions && (
        <Dialog open={openView.value} onClose={openView.onFalse} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h5">{suggestions.fullName}</Typography>
            <Label
              color={
                // eslint-disable-next-line no-nested-ternary
                suggestions.type === SuggestionEnum.COMPLAINT
                  ? 'error'
                  : suggestions.type === SuggestionEnum.SUGGESTION
                    ? 'success'
                    : 'info'
              }
            >
              {suggestions.type === SuggestionEnum.COMPLAINT
                ? t('feedbacks.types.complaint')
                : suggestions.type === SuggestionEnum.SUGGESTION
                  ? t('feedbacks.types.suggestion')
                  : t('feedbacks.types.other')}
            </Label>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 2 }}>{suggestions.description}</DialogContent>
          <DialogActions>
            <Button variant="contained" color="primary" onClick={openView.onFalse}>
              {t('feedbacks.actions.close')}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {suggestionsId && (
        <ConfirmDialog
          open={openDelete.value}
          onClose={openDelete.onFalse}
          title={t('feedbacks.deleteConfirm.title')}
          content={t('feedbacks.deleteConfirm.suggestionContent')}
          action={
            <>
              <Button variant="outlined" color="inherit" onClick={openDelete.onFalse}>
                {t('actions.cancel')}
              </Button>
              <LoadingButton
                variant="contained"
                color="error"
                onClick={async () => {
                  await mutateAsync();
                  openDelete.onFalse();
                }}
                loading={isPending}
              >
                {t('actions.delete')}
              </LoadingButton>
            </>
          }
        />
      )}
    </Container>
  );
};

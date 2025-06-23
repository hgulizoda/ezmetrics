import { useState } from 'react';
import { useNavigate } from 'react-router';

import { LoadingButton } from '@mui/lab';
import { Box, Button } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { useBoolean } from 'src/hooks/use-boolean';

import { ConfirmDialog } from 'src/components/custome-dialog';
import Circular from 'src/components/loading-screen/circular-screen';

import { archiveChatColumn } from './col';
import { useDeleteChat } from '../hooks/useDeleteChat';
import { useUnArchiveChat } from '../hooks/useUnArchiveChat';
import { useGetArchivedChats } from '../hooks/useGetArchivedChats';

export const ArchivedChats = () => {
  const [chatId, setChatId] = useState<string>('');
  const navigate = useNavigate();
  const { isDeletingChat, deleteChatAsync } = useDeleteChat(chatId);
  const { isUnArchivingChat, unArchiveChatAsync } = useUnArchiveChat(chatId);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 100,
  });
  const { data, isLoading } = useGetArchivedChats({
    params: {
      limit: paginationModel.pageSize,
      page: paginationModel.page + 1,
    },
  });

  const openDeleteChat = useBoolean();
  const openUnArchiveChat = useBoolean();

  if (isLoading) return <Circular />;

  return (
    <>
      <Box py={2} pl={2}>
        <Button onClick={() => navigate('/dashboard/chat')} variant="contained" color="inherit">
          Ortga qaytish
        </Button>
      </Box>
      <DataGrid
        columns={archiveChatColumn({
          unArchive(id) {
            setChatId(id);
            openUnArchiveChat.onTrue();
          },
          onDelete(id) {
            setChatId(id);
            openDeleteChat.onTrue();
          },
        })}
        rows={data?.data}
        loading={isLoading}
        getRowId={(row) => row._id || crypto.randomUUID()}
        sx={{
          [`& .${gridClasses.cell}`]: {
            borderBottom: 'none',
          },
        }}
        onPaginationModelChange={setPaginationModel}
        initialState={{
          pagination: { paginationModel },
        }}
        rowCount={data?.pagination.total_records ?? 0}
      />
      {chatId && (
        <ConfirmDialog
          open={openDeleteChat.value}
          onClose={openDeleteChat.onFalse}
          title="Chatni o'chirish"
          content="Tanlangan chatni o'chirmoqchimisiz? O'chirilgan chat butunlay o'chib ketadi , ularni orqaga qaytarish imkoni bo'lmaydi"
          action={
            <>
              <Button variant="outlined" color="primary" onClick={openDeleteChat.onFalse}>
                Bekor qilish
              </Button>
              <LoadingButton
                variant="contained"
                color="error"
                loading={isDeletingChat}
                onClick={async () => {
                  await deleteChatAsync();
                  openDeleteChat.onFalse();
                }}
              >
                O&apos;chirish
              </LoadingButton>
            </>
          }
        />
      )}
      {chatId && (
        <ConfirmDialog
          open={openUnArchiveChat.value}
          onClose={openUnArchiveChat.onFalse}
          title="Chatni arxivlash"
          content="Tanlangan chatni arxivdan chiqarmoqchimisiz ?"
          action={
            <>
              <Button variant="outlined" color="inherit" onClick={openUnArchiveChat.onFalse}>
                Bekor qilish
              </Button>
              <LoadingButton
                loading={isUnArchivingChat}
                onClick={async () => {
                  await unArchiveChatAsync();
                  openUnArchiveChat.onFalse();
                }}
                variant="contained"
                color="primary"
              >
                Arxivdan chiqarish
              </LoadingButton>
            </>
          }
        />
      )}
    </>
  );
};

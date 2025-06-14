import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Box,
  Link,
  Stack,
  Button,
  useTheme,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { queryClient } from 'src/query';
import { useChatContext } from 'src/pages/dashboard/chat/chatContext';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custome-dialog';

import { IMessageRes } from '../types/messages';
import { useGetMessages } from '../hooks/useGetMessages';
import useMessagesScroll from '../hooks/useScrollBottom';

export default function ChatArea() {
  const [messageId, setMessageId] = useState<string>('');
  const openDeleteMesage = useBoolean();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const chatId = searchParams.get('id');
  const { data, isLoading } = useGetMessages(chatId || '');
  const { emit } = useChatContext();
  const { messagesEndRef } = useMessagesScroll(data?.data || []);

  const deleteMessage = async () => {
    await emit('delete_message', {
      message_id: messageId,
      room_id: chatId,
    });
    queryClient.invalidateQueries({
      queryKey: ['messages', chatId],
    });
    openDeleteMesage.onFalse();
  };

  useEffect(() => {
    if (!chatId || !data?.data?.length) return;

    const lastMessage = data.data[data.data.length - 1];

    if (lastMessage?.sender_type !== 'admin' && lastMessage?.status !== 'read') {
      emit('mark_as_read', {
        room_id: chatId,
      });
    }
  }, [data?.data.length, chatId, data?.data, emit]);

  if (isLoading)
    return (
      <Box width="full" height="100%" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );

  return (
    <Scrollbar ref={messagesEndRef} sx={{ px: 3, pt: 5, pb: 3, flex: '1 1 auto' }}>
      {data?.data?.map(
        (message: IMessageRes) =>
          !message.is_deleted && (
            <Stack
              direction="row"
              justifyContent={message.sender_type === 'user' ? 'unset' : 'flex-end'}
              sx={{ mb: 2 }}
            >
              <Box sx={{ maxWidth: '70%' }} display="flex" gap={1}>
                <Box>
                  {message.type === 'text' ? (
                    <Stack
                      sx={{
                        p: 1,
                        minWidth: 48,
                        maxWidth: 320,
                        typography: 'body2',
                        bgcolor: theme.palette.background.neutral,
                        borderTopLeftRadius: message.sender_type === 'admin' ? '12px' : '0px',
                        borderTopRightRadius: '12px',
                        borderBottomLeftRadius: '12px',
                        borderBottomRightRadius: message.sender_type === 'admin' ? '0px' : '12px',
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {message.content}
                      </Typography>
                      <Box display="flex" alignItems="flex-end" gap={1} justifyContent="flex-end">
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            color: 'text.secondary',
                            textAlign: message.sender_type === 'user' ? 'left' : 'right',
                          }}
                        >
                          {dayjs(message.created_at).format('D MMM, h:mm A')}
                        </Typography>

                        {message.sender_type === 'admin' &&
                          (message.status === 'sent' ? (
                            <Iconify icon="lucide:check" width={17} />
                          ) : (
                            <Iconify icon="solar:check-read-linear" />
                          ))}
                      </Box>
                    </Stack>
                  ) : (
                    <Box
                      sx={{
                        bgcolor: theme.palette.background.neutral,
                        borderRadius: 1.5,
                        overflow: 'hidden',
                      }}
                    >
                      <Box display="flex" flexDirection="column">
                        {message.file_url?.map((url) => <FileRender url={url} />)}
                      </Box>
                      <Typography p={1} variant="body1">
                        {message.content}
                      </Typography>
                      <Box
                        display="flex"
                        alignItems="flex-end"
                        gap={1}
                        justifyContent="flex-end"
                        pr={1}
                        pb={0.5}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            color: 'text.secondary',
                            textAlign: message.sender_type === 'user' ? 'left' : 'right',
                          }}
                        >
                          {dayjs(message.created_at).format('D MMM, h:mm A')}
                        </Typography>
                        {message.sender_type === 'admin' &&
                          (message.status === 'sent' ? (
                            <Iconify icon="lucide:check" width={17} />
                          ) : (
                            <Iconify icon="solar:check-read-linear" />
                          ))}
                      </Box>
                    </Box>
                  )}
                  <Box display="flex" justifyContent="flex-end" mt="2px">
                    <IconButton sx={{ p: '4px' }}>
                      <Iconify icon="fluent:arrow-reply-16-filled" width={17} />
                    </IconButton>
                    <IconButton
                      sx={{ p: '4px' }}
                      onClick={() => {
                        setMessageId(message._id);
                        openDeleteMesage.onTrue();
                      }}
                    >
                      <Iconify icon="tabler:trash-filled" width={17} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Stack>
          )
      )}

      <ConfirmDialog
        open={openDeleteMesage.value}
        title="Habarni o'chirish"
        onClose={openDeleteMesage.onFalse}
        content="Ushbu habarni o'chirishni hohlaysizmi?"
        action={
          <>
            <Button variant="outlined" color="inherit" onClick={openDeleteMesage.onFalse}>
              Bekor qilish
            </Button>
            <Button variant="contained" color="error" onClick={deleteMessage}>
              O&apos;chirish
            </Button>
          </>
        }
      />
    </Scrollbar>
  );
}

function FileRender({ url }: { url: string }) {
  const fileType = getFileType(url);
  console.log(url);
  const theme = useTheme();

  switch (fileType) {
    case 'image':
      return (
        <Link href={url} target="_blank">
          <Image
            alt="attachment"
            src={url}
            sx={{
              width: 200,
              height: 'auto',

              cursor: 'pointer',
              objectFit: 'cover',
              aspectRatio: '16/11',
              '&:hover': { opacity: 0.9 },
            }}
          />
        </Link>
      );
    case 'video':
      return (
        <Link href={url} target="_blank">
          <video width="200px" height="150px" src={url} title="Embedded Video" controls autoPlay>
            <track kind="captions" srcLang="en" src="" />
          </video>
        </Link>
      );
    case 'gif':
      return (
        <Link href={url} target="_blank">
          <Image
            alt="attachment"
            src={url}
            sx={{
              width: 200,
              height: 'auto',

              cursor: 'pointer',
              objectFit: 'cover',
              aspectRatio: '16/11',
              '&:hover': { opacity: 0.9 },
            }}
          />
        </Link>
      );
    default:
      return (
        <Box
          sx={{
            borderRadius: '10px',
            border: `1px solid ${theme.palette.divider}`,
            height: 65,
            width: 70,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: theme.palette.background.neutral,
          }}
          component={Link}
          href={url}
          target="_blank"
          color="inherit"
        >
          <Iconify icon="solar:file-bold-duotone" width={50} />
        </Box>
      );
  }
}

function getFileType(url: string) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'webp'];
  const videoExtensions = ['mp4', 'webm', 'ogg'];
  const audioExtensions = ['mp3', 'wav', 'ogg'];
  const gifExtensions = ['gif'];

  const extension = url.toLowerCase().split('.').pop();

  if (!extension) return 'file';

  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  if (audioExtensions.includes(extension)) return 'audio';
  if (gifExtensions.includes(extension)) return 'gif';

  return 'file';
}

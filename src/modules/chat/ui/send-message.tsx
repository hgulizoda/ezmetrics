import { useSearchParams } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import EmojiPicker, { Theme, EmojiStyle } from 'emoji-picker-react';

import { Box, Stack, useTheme, InputBase, IconButton, Typography } from '@mui/material';

import { queryClient } from 'src/query';
import { useTranslate } from 'src/locales';
import { useChatContext } from 'src/pages/dashboard/chat/chatContext';
import { useUploadImage } from 'src/modules/package/hook/useUploadImage';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IMessageRes } from '../types/messages';
import GifSearchComponent from './gir-search-component';

interface SendMessageProps {
  replyMessage: IMessageRes | null;
  clearReply: () => void;
  editMessage?: IMessageRes | null;
  setEditMessage?: (msg: IMessageRes | null) => void;
}

export const SendMessage = ({
  replyMessage,
  clearReply,
  editMessage,
  setEditMessage,
}: SendMessageProps) => {
  const popover = usePopover();
  const popoverGif = usePopover();
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('id');
  const [newMessage, setNewMessage] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const { emit } = useChatContext();
  const { t } = useTranslate('lang');
  const { uploadAsync, isPending } = useUploadImage();

  const handleEmojiClick = (emojiData: { emoji: string }) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (editMessage) {
      setNewMessage(editMessage.content);
      inputRef.current?.focus();
    }
  }, [editMessage]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' && !replyMessage) return;

    if (editMessage && setEditMessage) {
      emit('update_message', {
        message_id: editMessage._id,
        content: newMessage,
        room_id: chatId,
      });
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      setEditMessage(null);
      setNewMessage('');
      return;
    }

    const messagePayload = {
      room: chatId,
      content: newMessage,
      type: 'text',
      ...(replyMessage && { reply_to: replyMessage._id }),
    };

    try {
      emit('send_message', messagePayload);
      emit('mark_as_read', { room_id: chatId });
      queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
      setNewMessage('');
      clearReply();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleMediaClick = () => {
    imageInputRef.current?.click();
  };

  const handleDocClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files?.length || !chatId) return;

    try {
      const uploadedUrls = await Promise.all([...files].map((file) => uploadAsync({ file })));
      if (uploadedUrls.length > 0) {
        emit('send_message', {
          room: chatId,
          file_url: uploadedUrls.map((url) => url.url),
          type: files[0].type === 'video/mp4' ? 'video' : 'image',
          ...(replyMessage && { reply_to: replyMessage._id }),
        });
        queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
        clearReply();
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleDocChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files?.length || !chatId) return;

    try {
      const uploadedUrls = await Promise.all([...files].map((file) => uploadAsync({ file })));
      if (uploadedUrls.length > 0) {
        emit('send_message', {
          room: chatId,
          file_url: uploadedUrls.map((url) => url.url),
          type: 'file',
          ...(replyMessage && { reply_to: replyMessage._id }),
        });
        queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
        clearReply();
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    emit('mark_as_read', { room_id: chatId });
  }, [emit, chatId]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, {
          type: 'audio/webm',
        });
        try {
          const uploadedUrl = await uploadAsync({ file: audioFile });
          if (uploadedUrl) {
            emit('send_message', {
              room: chatId,
              file_url: [uploadedUrl.url],
              type: 'audio',
              ...(replyMessage && { reply_to: replyMessage._id }),
            });
            queryClient.invalidateQueries({ queryKey: ['messages', chatId] });
            clearReply();
          }
        } catch (err) {
          console.error('Audio upload failed:', err);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (errors) {
      console.error('Microphone access denied or error:', errors);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Box width="100%">
      {(replyMessage || editMessage) && (
        <Box
          sx={{
            p: 1,
            bgcolor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            {editMessage ? (
              <Typography
                variant="body2"
                noWrap
                sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                Edit: {editMessage.content}
              </Typography>
            ) : (
              <Typography
                variant="body2"
                noWrap
                sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {replyMessage?.content}
              </Typography>
            )}
          </Box>
          {editMessage && setEditMessage ? (
            <IconButton
              onClick={() => {
                setEditMessage(null);
                setNewMessage('');
              }}
              size="small"
            >
              <Iconify icon="eva:close-fill" width={16} />
            </IconButton>
          ) : (
            <IconButton onClick={clearReply} size="small">
              <Iconify icon="eva:close-fill" width={16} />
            </IconButton>
          )}
        </Box>
      )}
      <InputBase
        name="chat-message"
        id="chat-message-input"
        fullWidth
        value={newMessage}
        multiline
        onKeyDown={handleKeyPress}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder={editMessage ? `${t('chat.editMessage')}...` : `${t('chat.typeAMessage')}`}
        autoFocus
        inputRef={inputRef}
        startAdornment={
          <Box display="flex" pr={2}>
            <IconButton onClick={popover.onOpen} sx={{ p: '4px' }}>
              <Iconify icon="eva:smiling-face-fill" />
            </IconButton>
            <IconButton onClick={popoverGif.onOpen} sx={{ p: '4px' }}>
              <Iconify icon="fluent:gif-20-filled" />
            </IconButton>
          </Box>
        }
        endAdornment={
          <Stack direction="row" sx={{ flexShrink: 0, pl: 2 }}>
            <IconButton onClick={handleMediaClick}>
              <Iconify icon={isPending ? 'line-md:uploading-loop' : 'solar:gallery-add-bold'} />
            </IconButton>
            <IconButton onClick={handleDocClick}>
              <Iconify icon={isPending ? 'line-md:uploading-loop' : 'eva:attach-2-fill'} />
            </IconButton>
            <IconButton onClick={isRecording ? stopRecording : startRecording}>
              <Iconify
                icon={
                  // eslint-disable-next-line no-nested-ternary
                  isPending
                    ? 'line-md:uploading-loop'
                    : isRecording
                      ? 'solar:record-bold-duotone'
                      : 'solar:microphone-bold'
                }
                color={isRecording ? theme.palette.error.dark : undefined}
              />
            </IconButton>
          </Stack>
        }
        sx={{
          px: 1,
          flexShrink: 0,
          borderTop: `solid 1px ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'flex-end',
          '.css-yubm5r-MuiInputBase-input': {
            mb: '3px',
          },
        }}
      />

      <input
        type="file"
        style={{ display: 'none' }}
        ref={imageInputRef}
        multiple
        onChange={handleFileChange}
        accept="image/*,.mp4"
      />

      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleDocChange}
        accept="application/pdf,.doc,.docx,.xml"
      />

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        arrow="right-center"
      >
        <EmojiPicker
          emojiStyle={EmojiStyle.GOOGLE}
          onEmojiClick={handleEmojiClick}
          theme={Theme.DARK}
        />
      </CustomPopover>

      <CustomPopover
        open={popoverGif.open}
        onClose={popoverGif.onClose}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        arrow="right-center"
      >
        <GifSearchComponent onClose={popoverGif.onClose} />
      </CustomPopover>
    </Box>
  );
};

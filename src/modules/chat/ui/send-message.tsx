import { useSearchParams } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import EmojiPicker, { Theme, EmojiStyle } from 'emoji-picker-react';

import { Box, Stack, useTheme, InputBase, IconButton } from '@mui/material';

import { useChatContext } from 'src/pages/dashboard/chat/chatContext';
import { useUploadImage } from 'src/modules/package/hook/useUploadImage';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import GifSearchComponent from './gir-search-component';

export const SendMessage = () => {
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
  const { uploadAsync, isPending } = useUploadImage();
  const { uploadAsync: uploadFile, isPending: isFiling } = useUploadImage();
  const { uploadAsync: uploadAudio, isPending: isAudioing } = useUploadImage();
  const handleEmojiClick = (emojiData: any) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    emit('send_message', {
      room: chatId,
      content: newMessage,
      type: 'text',
    });
    emit('mark_as_read', {
      room_id: chatId,
    });
    setNewMessage('');
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
      const uploadedUrl = await Promise.all([...files].map((file) => uploadAsync({ file })));
      if (uploadedUrl) {
        emit('send_message', {
          room: chatId,
          file_url: uploadedUrl.map((url) => url.url),
          type: files[0].type === 'video/mp4' ? 'video' : 'image',
        });
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
      const uploadedUrl = await Promise.all([...files].map((file) => uploadAsync({ file })));
      if (uploadedUrl) {
        emit('send_message', {
          room: chatId,
          file_url: uploadedUrl.map((url) => url.url),
          type: 'file',
        });
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  useEffect(() => {
    emit('mark_as_read', {
      room_id: chatId,
    });
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
          const uploadedUrl = await uploadAudio({ file: audioFile });
          if (uploadedUrl) {
            emit('send_message', {
              room: chatId,
              file_url: uploadedUrl.url,
              type: 'audio',
            });
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
      <InputBase
        name="chat-message"
        id="chat-message-input"
        fullWidth
        value={newMessage}
        multiline
        onKeyUp={handleKeyPress}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
        autoFocus
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
              <Iconify icon={isFiling ? 'line-md:uploading-loop' : 'eva:attach-2-fill'} />
            </IconButton>
            <IconButton onClick={isRecording ? stopRecording : startRecording}>
              <Iconify
                icon={
                  // eslint-disable-next-line no-nested-ternary
                  isAudioing
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
            mb: '4px',
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

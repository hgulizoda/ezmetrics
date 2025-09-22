import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { memo, useRef, useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link as RoutLink } from 'react-router-dom';

import {
  Box,
  Card,
  Link,
  Stack,
  Button,
  AppBar,
  Toolbar,
  Checkbox,
  useTheme,
  IconButton,
  Typography,
  CardContent,
  CircularProgress,
  Chip,
  Divider,
  Tooltip,
  tooltipClasses,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { queryClient } from 'src/query';
import Coin from 'src/assets/icons/coin.png';
import { useChatContext } from 'src/pages/dashboard/chat/chatContext';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custome-dialog';

import { IMessageRes } from '../types/messages';
import { useGetMessages } from '../hooks/useGetMessages';
import useMessagesScroll from '../hooks/useScrollBottom';
import {
  ShipmentTypeIcons,
  ShipmentTypeLabelsColors,
  useShipmentTypeLabels,
  useShipmentTooltipTypeLabels,
} from 'src/types/TableStatus';
import Label from 'src/components/label';
import { useTranslate } from 'src/locales';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('uz');

type MessageOrSeparator =
  | { type: 'separator'; date: string; key: string }
  | { type: 'message'; message: IMessageRes; key: string };

interface ChatAreaProps {
  onReplyMessage: (message: IMessageRes) => void;
  searchChat: Date | undefined;
  setEditMessage: (msg: IMessageRes | null) => void;
}

const ChatArea = memo(({ onReplyMessage, searchChat, setEditMessage }: ChatAreaProps) => {
  const navigate = useNavigate();
  const { t } = useTranslate('lang');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [focusedMessageId, setFocusedMessageId] = useState<string | null>(null);
  const [noMessagesForDate, setNoMessagesForDate] = useState(false);
  const openDeleteMessages = useBoolean();
  const openArchiveMessages = useBoolean();
  const [searchParams] = useSearchParams();
  const theme = useTheme();
  const chatId = searchParams.get('id');
  const { data, isLoading } = useGetMessages(chatId || '');
  const { emit } = useChatContext();
  const { messagesEndRef } = useMessagesScroll(data?.data || [], () => {});
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const skipScrollRef = useRef(false);
  const prevMessageCountRef = useRef<number>(0);

  useEffect(() => {
    const handleEscPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        navigate(-1);
      }
    };
    document.addEventListener('keydown', handleEscPress);
    return () => {
      document.removeEventListener('keydown', handleEscPress);
    };
  }, [navigate]);

  const handleMessageSelect = (messageId: string) => {
    setSelectedMessages((prev) => {
      const isSelected = prev.includes(messageId);
      if (!isMultiSelectMode && !isSelected) {
        setIsMultiSelectMode(true);
      }
      return isSelected ? prev.filter((id) => id !== messageId) : [...prev, messageId];
    });
  };

  const handleCancelSelection = () => {
    setSelectedMessages([]);
    setIsMultiSelectMode(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMultiSelectMode) {
        handleCancelSelection();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMultiSelectMode]);

  const deleteMessages = async () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !chatId) return;

    const currentScrollHeight = scrollContainer.scrollHeight;
    const currentScrollPosition = scrollContainer.scrollTop;
    const distanceFromBottom =
      currentScrollHeight - currentScrollPosition - scrollContainer.clientHeight;

    skipScrollRef.current = true;
    await Promise.all(
      selectedMessages.map((messageId) =>
        emit('delete_message', {
          message_id: messageId,
          room_id: chatId,
        })
      )
    );

    queryClient.invalidateQueries({
      queryKey: ['messages', chatId],
    });

    setTimeout(() => {
      const newScrollHeight = scrollContainer.scrollHeight;
      scrollContainer.scrollTop =
        newScrollHeight - scrollContainer.clientHeight - distanceFromBottom;
      skipScrollRef.current = false;
    }, 100);

    handleCancelSelection();
    openDeleteMessages.onFalse();
  };

  const archiveMessages = async () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !chatId) return;

    const currentScrollHeight = scrollContainer.scrollHeight;
    const currentScrollPosition = scrollContainer.scrollTop;
    const distanceFromBottom =
      currentScrollHeight - currentScrollPosition - scrollContainer.clientHeight;

    skipScrollRef.current = true;
    await emit('archive_messages', {
      message_ids: selectedMessages,
      room_id: chatId,
    });

    queryClient.invalidateQueries({
      queryKey: ['messages', chatId],
    });

    setTimeout(() => {
      const newScrollHeight = scrollContainer.scrollHeight;
      scrollContainer.scrollTop =
        newScrollHeight - scrollContainer.clientHeight - distanceFromBottom;
      skipScrollRef.current = false;
    }, 100);

    handleCancelSelection();
    openArchiveMessages.onFalse();
  };

  useEffect(() => {
    if (!chatId || !data?.data?.length) return;

    const lastMessage = data.data[data.data.length - 1];

    if (lastMessage?.sender_type !== 'admin' && lastMessage?.status !== 'read') {
      emit('mark_as_read', {
        room_id: chatId,
      });
    }
  }, [data?.data?.length, chatId, data?.data, emit]);

  useEffect(() => {
    if (messagesEndRef.current?.parentElement) {
      scrollContainerRef.current = messagesEndRef.current.parentElement as HTMLDivElement;
    }
  }, [messagesEndRef]);

  useEffect(() => {
    if (!searchChat || !data?.data?.length) {
      setNoMessagesForDate(false);
      return;
    }

    const selectedDate = dayjs(searchChat).tz('Asia/Tashkent').startOf('day');
    const firstMatchingMessage = data.data.find((message) =>
      dayjs(message.created_at).tz('Asia/Tashkent').isSame(selectedDate, 'day')
    );

    if (firstMatchingMessage) {
      setNoMessagesForDate(false);
      setTimeout(() => {
        const element = document.getElementById(`message-${firstMatchingMessage._id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      setNoMessagesForDate(true);
    }
  }, [searchChat, data?.data]);

  useEffect(() => {
    const messageCount = data?.data?.length || 0;
    const prevCount = prevMessageCountRef.current;
    // Only scroll to bottom if messages increased or chatId changed
    if (
      messagesEndRef.current &&
      (messageCount > prevCount || prevCount === 0 || prevCount === undefined)
    ) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
    prevMessageCountRef.current = messageCount;
  }, [data?.data, chatId, messagesEndRef]);

  // @ts-ignore
  const messagesWithSeparators = useMemo<MessageOrSeparator[]>(() => {
    if (!data?.data) return [];

    // Deduplicate messages by _id
    const uniqueMessages = Array.from(new Map(data.data.map((msg) => [msg._id, msg])).values());

    return uniqueMessages.reduce(
      (acc: MessageOrSeparator[], message: IMessageRes, index: number) => {
        if (message.is_deleted) return acc;

        const messageDate = dayjs(message.created_at).tz('Asia/Tashkent').startOf('day');
        const prevMessage = index > 0 ? uniqueMessages[index - 1] : null;
        const prevMessageDate = prevMessage
          ? dayjs(prevMessage.created_at).tz('Asia/Tashkent').startOf('day')
          : null;

        const needsSeparator = !prevMessage || !messageDate.isSame(prevMessageDate, 'day');

        if (needsSeparator) {
          acc.push({
            type: 'separator',
            date: messageDate.format('D MMMM'),
            key: `separator-${messageDate.format('YYYY-MM-DD')}`,
          });
        }

        acc.push({
          type: 'message',
          message,
          key: message._id,
        });

        return acc;
      },
      []
    );
  }, [data?.data]);

  const shipmentLabel = useShipmentTypeLabels();
  const shipmentToolTip = useShipmentTooltipTypeLabels();

  if (isLoading) {
    return (
      <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Selection Toolbar */}
      {isMultiSelectMode && selectedMessages.length > 0 && (
        <AppBar position="static" color="default" sx={{ zIndex: 10 }}>
          <Toolbar>
            <Typography variant="subtitle1">{selectedMessages.length} ta habar tanlandi</Typography>
            <Box flexGrow={1} />
            <IconButton onClick={handleCancelSelection} aria-label="Cancel selection">
              <Iconify icon="material-symbols:cancel" />
            </IconButton>
            <IconButton onClick={openDeleteMessages.onTrue} aria-label="Delete selected messages">
              <Iconify icon="tabler:trash-filled" />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}

      <Scrollbar
        ref={scrollContainerRef}
        sx={{
          flex: '1 1 auto',
          minHeight: 0,
          height: '100%',
          overflowY: 'auto',
          px: 3,
          pt: 3,
          pb: 3,
        }}
      >
        {data?.data?.length === 0 || (searchChat && noMessagesForDate) ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {searchChat ? 'Bu kunda habar topilmadi' : 'Habarlar mavjud emas'}
            </Typography>
          </Box>
        ) : (
          <>
            {messagesWithSeparators.map((item) =>
              item.type === 'separator' ? (
                <Box
                  key={item.key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    my: 2,
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      flexGrow: 1,
                      height: '1px',
                      bgcolor: theme.palette.divider,
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      mx: 2,
                      px: 2,
                      py: 0.5,
                      bgcolor: theme.palette.background.paper,
                      color: theme.palette.text.secondary,
                      borderRadius: 1,
                    }}
                  >
                    {item.date}
                  </Typography>
                  <Box
                    sx={{
                      flexGrow: 1,
                      height: '1px',
                      bgcolor: theme.palette.divider,
                    }}
                  />
                </Box>
              ) : (
                <Stack
                  key={item.key}
                  direction="row"
                  justifyContent={item.message.sender_type === 'user' ? 'unset' : 'flex-end'}
                  sx={{
                    transition: 'background-color 1s ease-out',
                    bgcolor:
                      focusedMessageId === item.message._id
                        ? theme.palette.primary.lighter
                        : 'transparent',
                    mb: 2,
                    borderRadius: 2,
                  }}
                  role="region"
                  aria-label={`Message from ${item.message.sender_type} at ${dayjs(item.message.created_at).format('D MMM, h:mm A')}`}
                >
                  <Box sx={{ maxWidth: '70%' }} display="flex" gap={1}>
                    <Box>
                      {item.message.reply_to && (
                        <Box
                          sx={{
                            p: 1,
                            mb: 1,
                            bgcolor: theme.palette.background.paper,
                            borderRadius: 1,
                            borderLeft: `3px solid ${theme.palette.primary.dark}`,
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            const replyToId =
                              typeof item.message.reply_to === 'string'
                                ? item.message.reply_to
                                : item.message.reply_to._id;
                            setFocusedMessageId(replyToId);
                            const element = document.getElementById(`message-${replyToId}`);
                            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            setTimeout(() => setFocusedMessageId(null), 1000);
                          }}
                        >
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontStyle: !data?.data?.find(
                                (m) =>
                                  m._id ===
                                  (typeof item.message.reply_to === 'string'
                                    ? item.message.reply_to
                                    : item.message.reply_to._id)
                              )
                                ? 'italic'
                                : 'normal',
                            }}
                          >
                            {typeof item.message.reply_to === 'string'
                              ? data?.data?.find((m) => m._id === item.message.reply_to)?.content ||
                                `Habar topilmadi yoki o'chirilgan`
                              : item.message.reply_to.content || `Habar topilmadi yoki o'chirilgan`}
                          </Typography>
                        </Box>
                      )}
                      <Box id={`message-${item.message._id}`}>
                        {item.message.type === 'text' && (
                          <Stack
                            sx={{
                              p: 1,
                              minWidth: 48,
                              maxWidth: 450,
                              typography: 'body2',
                              bgcolor: selectedMessages.includes(item.message._id)
                                ? theme.palette.action.selected
                                : theme.palette.background.neutral,
                              borderTopLeftRadius:
                                item.message.sender_type === 'admin' ? '12px' : '0px',
                              borderTopRightRadius: '12px',
                              borderBottomLeftRadius: '12px',
                              borderBottomRightRadius:
                                item.message.sender_type === 'admin' ? '0px' : '12px',
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
                            >
                              {item.message.content}
                            </Typography>
                            {item.message.additional_info && (
                              <Card
                                sx={{
                                  maxWidth: 400,
                                  mx: 'auto',
                                  borderRadius: 3,
                                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                  border: '1px solid #e0e0e0',
                                }}
                              >
                                <CardContent>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      mb: 2,
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Tooltip
                                        title={shipmentToolTip[item.message.additional_info.status]}
                                        arrow
                                        placement="top"
                                        slotProps={{
                                          popper: {
                                            sx: {
                                              [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                                                {
                                                  marginTop: '0px',
                                                },
                                            },
                                          },
                                        }}
                                      >
                                        {ShipmentTypeIcons[item.message.additional_info.status] ===
                                        '' ? (
                                          <Label
                                            color={
                                              ShipmentTypeLabelsColors[
                                                item.message.additional_info.status
                                              ]
                                            }
                                          >
                                            {shipmentLabel[item.message.additional_info.status]}
                                          </Label>
                                        ) : (
                                          <Label
                                            color={
                                              ShipmentTypeLabelsColors[
                                                item.message.additional_info.status
                                              ]
                                            }
                                            endIcon={
                                              <Iconify
                                                icon={
                                                  ShipmentTypeIcons[
                                                    item.message.additional_info.status
                                                  ]
                                                }
                                              />
                                            }
                                          >
                                            {shipmentLabel[item.message.additional_info.status]}
                                          </Label>
                                        )}
                                      </Tooltip>
                                    </Box>
                                  </Box>

                                  <Typography
                                    variant="h6"
                                    sx={{
                                      mb: 1,
                                      fontWeight: 500,
                                      lineHeight: 1.3,
                                      maxWidth: 300,
                                      overflow: 'hidden',
                                      whiteSpace: 'wrap',
                                    }}
                                  >
                                    {item?.message?.additional_info?.description}
                                  </Typography>

                                  {/* Product Details */}
                                  <Box sx={{ mb: 1 }}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 0.5,
                                      }}
                                    >
                                      <Typography variant="body2" color="text.secondary">
                                        {t('packages.tableTitle.weight')}
                                      </Typography>
                                      <Typography variant="body2" fontWeight="medium">
                                        {item?.message?.additional_info?.order_weight}
                                      </Typography>
                                    </Box>

                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 0.5,
                                      }}
                                    >
                                      <Typography variant="body2" color="text.secondary">
                                        {t('packages.tableTitle.capacity')}
                                      </Typography>
                                      <Typography variant="body2" fontWeight="medium">
                                        {item?.message?.additional_info?.order_capacity}
                                      </Typography>
                                    </Box>

                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 0.5,
                                      }}
                                    >
                                      <Typography variant="body2" color="text.secondary">
                                        {t('packages.tableTitle.stockNumber')}
                                      </Typography>
                                      <Typography variant="body2" fontWeight="medium">
                                        {item?.message?.additional_info?.total_count}
                                      </Typography>
                                    </Box>

                                    <Box
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        mb: 0.5,
                                      }}
                                    >
                                      <Typography variant="body2" color="text.secondary">
                                        {t('packages.status.uzbCustoms')}
                                      </Typography>
                                      <Typography variant="body2" fontWeight="medium">
                                        {item?.message?.additional_info?.transit_zone}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  <Divider sx={{ my: 2 }} />

                                  {/* Status */}
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ mb: 0.5 }}
                                    >
                                      {t('packages.tableTitle.updatedDate')}
                                    </Typography>
                                    <Typography variant="body2" fontWeight="medium">
                                      {dayjs(item.message.additional_info.status_updated_at)
                                        .tz('Asia/Tashkent')
                                        .format('D MMM, h:mm A')}
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </Card>
                            )}
                            {item.message.metadata && (
                              <Card
                                sx={{
                                  mt: 1,
                                }}
                              >
                                <RoutLink
                                  style={{
                                    color: 'inherit',
                                    textDecoration: 'none',
                                  }}
                                  to={`/dashboard/users/${item.message.sender}/bonus?bonusID=${item.message.metadata.id}`}
                                >
                                  <CardContent
                                    sx={{
                                      p: 1,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        gap: 2,
                                        alignItems: 'start',
                                      }}
                                    >
                                      <img src={Coin} width={40} height={40} alt="" />
                                      <Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                          <Typography variant="subtitle1">Bonus ID:</Typography>
                                          <Typography variant="subtitle1">
                                            {item.message.metadata.id}
                                          </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                          <Typography variant="subtitle1">Ball:</Typography>
                                          <Typography variant="subtitle1">
                                            {item.message.metadata.ball} ball
                                          </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                          <Typography variant="subtitle2">Umumiy hajmi:</Typography>
                                          <Typography variant="subtitle1">
                                            {item.message.metadata.total_capacity} m³
                                          </Typography>
                                        </Box>
                                        <Box display="flex" alignItems="center" gap={1}>
                                          <Typography variant="subtitle2">
                                            Umumiy og&apos;irlik:
                                          </Typography>
                                          <Typography variant="subtitle1">
                                            {item.message.metadata.total_weight.toFixed(2)} kg
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </CardContent>
                                </RoutLink>
                              </Card>
                            )}
                            <Box
                              display="flex"
                              alignItems="flex-end"
                              gap={1}
                              justifyContent="flex-end"
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  display: 'block',
                                  mt: 0.5,
                                  color: 'text.secondary',
                                  textAlign: item.message.sender_type === 'user' ? 'left' : 'right',
                                }}
                              >
                                {dayjs(item.message.created_at)
                                  .tz('Asia/Tashkent')
                                  .format('D MMM, h:mm A')}
                              </Typography>
                              {item.message.sender_type === 'admin' &&
                                (item.message.status === 'sent' ? (
                                  <Iconify icon="lucide:check" width={17} />
                                ) : (
                                  <Iconify icon="solar:check-read-linear" />
                                ))}
                            </Box>
                          </Stack>
                        )}
                        {item.message.type !== 'text' && (
                          <Box
                            sx={{
                              bgcolor: selectedMessages.includes(item.message._id)
                                ? theme.palette.action.selected
                                : theme.palette.background.neutral,
                              borderRadius: 1.5,
                              overflow: 'hidden',
                            }}
                          >
                            <Box display="flex" flexDirection="column">
                              {item.message.file_url?.map((url) => (
                                <FileRender key={url} url={url} />
                              ))}
                            </Box>
                            <Typography p={1} variant="body1">
                              {item.message.content}
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
                                  textAlign: item.message.sender_type === 'user' ? 'left' : 'right',
                                }}
                              >
                                {dayjs(item.message.created_at)
                                  .tz('Asia/Tashkent')
                                  .format('D MMM, h:mm A')}
                              </Typography>
                              {item.message.sender_type === 'admin' &&
                                (item.message.status === 'sent' ? (
                                  <Iconify icon="lucide:check" width={17} />
                                ) : (
                                  <Iconify icon="solar:check-read-linear" />
                                ))}
                            </Box>
                          </Box>
                        )}

                        <Box
                          display="flex"
                          justifyContent="flex-end"
                          mt="2px"
                          alignItems="center"
                          gap={0.5}
                        >
                          <Checkbox
                            checked={selectedMessages.includes(item.message._id)}
                            onChange={() => handleMessageSelect(item.message._id)}
                            aria-label={`Select message ${item.message._id}`}
                            sx={{ p: '4px' }}
                          />
                          <IconButton
                            sx={{ p: '4px' }}
                            onClick={() => onReplyMessage(item.message)}
                            aria-label="Reply to message"
                          >
                            <Iconify icon="fluent:arrow-reply-16-filled" width={17} />
                          </IconButton>
                          <IconButton
                            sx={{ p: '4px' }}
                            onClick={() => {
                              setSelectedMessages([item.message._id]);
                              openDeleteMessages.onTrue();
                            }}
                            aria-label="Delete message"
                          >
                            <Iconify icon="tabler:trash-filled" width={17} />
                          </IconButton>
                          {item.message.sender_type === 'admin' && (
                            <IconButton
                              sx={{ p: '4px' }}
                              onClick={() => setEditMessage(item.message)}
                              aria-label="Edit message"
                            >
                              <Iconify icon="eva:edit-2-fill" width={17} />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              )
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </Scrollbar>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={openDeleteMessages.value}
        title={selectedMessages.length > 1 ? "Habarlarni o'chirish" : "Habarni o'chirish"}
        onClose={openDeleteMessages.onFalse}
        content={
          selectedMessages.length > 1
            ? `Ushbu ${selectedMessages.length} ta habarni o'chirishni hohlaysizmi?`
            : "Ushbu habarni o'chirishni hohlaysizmi?"
        }
        action={
          <>
            <Button variant="outlined" color="inherit" onClick={openDeleteMessages.onFalse}>
              Bekor qilish
            </Button>
            <Button variant="contained" color="error" onClick={deleteMessages}>
              O&apos;chirish
            </Button>
          </>
        }
      />

      {/* Archive Confirmation Dialog */}
      <ConfirmDialog
        open={openArchiveMessages.value}
        title={selectedMessages.length > 1 ? 'Habarlarni arxivlash' : 'Habarni arxivlash'}
        onClose={openArchiveMessages.onFalse}
        content={
          selectedMessages.length > 1
            ? `Ushbu ${selectedMessages.length} ta habarni arxivlashni hohlaysizmi?`
            : 'Ushbu habarni arxivlashni hohlaysizmi?'
        }
        action={
          <>
            <Button variant="outlined" color="inherit" onClick={openArchiveMessages.onFalse}>
              Bekor qilish
            </Button>
            <Button variant="contained" color="primary" onClick={archiveMessages}>
              Arxivlash
            </Button>
          </>
        }
      />
    </Box>
  );
});

export default ChatArea;

const FileRender = memo(({ url }: { url: string }) => {
  const fileType = getFileType(url);
  const theme = useTheme();

  switch (fileType) {
    case 'image':
      return (
        <Link href={url} target="_blank" aria-label="View image attachment">
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
        <Link href={url} target="_blank" aria-label="View video attachment">
          <video width="200px" height="150px" src={url} title="Embedded Video" controls autoPlay>
            <track kind="captions" srcLang="en" src="" />
          </video>
        </Link>
      );
    case 'gif':
      return (
        <Link href={url} target="_blank" aria-label="View GIF attachment">
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
          aria-label="Download file attachment"
        >
          <Iconify icon="solar:file-bold-duotone" width={50} />
        </Box>
      );
  }
});

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

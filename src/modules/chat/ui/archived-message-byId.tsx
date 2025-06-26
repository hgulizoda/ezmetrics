import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, IconButton, Typography, DialogTitle, DialogContent } from '@mui/material';

import Circular from 'src/components/loading-screen/circular-screen';

import { useGetArchivedMessages } from '../hooks/useGetArchivedMessages';

interface ArchivedMessagesDialogProps {
  open: boolean;
  onClose: () => void;
  chatId: string;
}

export function ArchivedMessagesDialog({ open, onClose, chatId }: ArchivedMessagesDialogProps) {
  const { data, isLoading } = useGetArchivedMessages(chatId);

  if (isLoading) return <Circular />;

  // Helper to find replied message content
  const getReplyContent = (replyToId: string) => {
    const repliedMsg = data?.data.find((msg: any) => msg._id === replyToId);
    return repliedMsg ? repliedMsg.content : '';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Arxivlangan Chat Xabarlari
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={1}>
          {data && data.data.length > 0 ? (
            data.data.map((msg: any) => {
              const isAdmin = msg.sender_type === 'admin';
              return (
                <Box
                  key={msg._id}
                  display="flex"
                  flexDirection="column"
                  alignItems={isAdmin ? 'flex-end' : 'flex-start'}
                >
                  <Box
                    sx={{
                      bgcolor: isAdmin ? 'primary.lighter' : 'background.neutral',
                      borderRadius: 2,
                      p: 1,
                      mb: 0.5,
                      maxWidth: '75%',
                      boxShadow: 1,
                    }}
                  >
                    {msg.reply_to && (
                      <Box
                        sx={{
                          mb: 1,
                          pl: 1,
                          borderLeft: '2px solid',
                          borderColor: 'grey.300',
                          bgcolor: 'grey.100',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Reply to:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getReplyContent(msg.reply_to)}
                        </Typography>
                      </Box>
                    )}
                    <Typography variant="body1">{msg.content}</Typography>
                    {msg.file_url && msg.file_url.length > 0 && (
                      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {msg.file_url.map((url: string, idx: number) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`attachment-${idx}`}
                            style={{ maxWidth: '100%', borderRadius: 8 }}
                          />
                        ))}
                      </Box>
                    )}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: 'block', textAlign: isAdmin ? 'right' : 'left' }}
                    >
                      {new Date(msg.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Typography color="text.secondary" align="center">
              Xabarlar topilmadi
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

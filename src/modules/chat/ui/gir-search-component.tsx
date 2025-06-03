import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Grid, Paper, TextField, Typography, CircularProgress } from '@mui/material';

import { useChatContext } from 'src/pages/dashboard/chat/chatContext';

import Scrollbar from 'src/components/scrollbar';

import { useGetGifs } from '../hooks/useGetGifs';

const GifSearchComponent = () => {
  const { emit } = useChatContext();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const { isLoading, error, data, isFetching } = useGetGifs(searchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleGifClick = (url: string) => {
    emit('send_message', {
      room: searchParams.get('id'),
      content: url,
      type: 'gif',
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLImageElement>, url: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleGifClick(url);
    }
  };

  return (
    <Paper
      sx={{
        textAlign: 'center',
        width: '450px',
        height: '350px',
        margin: 'auto',
        overflow: 'hidden',
        p: 1,
      }}
    >
      <TextField
        label="Search GIFs"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 1 }}
      />

      {isLoading && <CircularProgress />}
      {error && (
        <Typography color="error">Oops! Something went wrong. Please try again.</Typography>
      )}

      <Scrollbar style={{ maxHeight: '350px', overflowY: 'auto' }}>
        <Grid container spacing={1} justifyContent="center">
          {data?.map((gif: any) => (
            <Grid item xs={3} key={gif.id}>
              <img
                src={gif.images.fixed_height.url}
                alt={gif.title}
                width="100%"
                height="80px"
                style={{
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                role="button"
                tabIndex={0} // Makes the element focusable
                onClick={() => handleGifClick(gif.images.fixed_height.url)}
                onKeyDown={(e) => handleKeyDown(e, gif.images.fixed_height.url)}
              />
            </Grid>
          ))}
        </Grid>

        {isFetching && !isLoading && (
          <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '20px' }} />
        )}
      </Scrollbar>
    </Paper>
  );
};

export default GifSearchComponent;

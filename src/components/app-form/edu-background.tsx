import { useState } from 'react';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Grid, Button, TextField, Container, Typography, } from '@mui/material';

export default function EduBackground() {
  const [submittedDate, setSubmittedDate] = useState(null);
  const [entryDate, setEntryDate] = useState(null);

  return (
    <Container
      sx={{
        background: '#fff',
        padding: { xs: 2, sm: 4 },
        borderRadius: 2,
        boxShadow: 3,
        width: '100%',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Educational background
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            Topic level
          </Typography>
          <TextField
            required
            fullWidth
            placeholder='Enter your topic level'
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            The date topic submitted
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={submittedDate}
              onChange={(newValue: any) => {
                setSubmittedDate(newValue);
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            High school
          </Typography>
          <TextField
            required
            fullWidth
            variant="outlined"
            placeholder="Enter your high school"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            Entry date
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={entryDate}
              onChange={(newValue: any) => {
                setEntryDate(newValue);
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={12} display="flex" justifyContent="flex-end" alignItems="center">
          <Button variant="outlined" color="success" sx={{ borderRadius: 3, padding: '0 32px', fontSize: 16, fontWeight: 600, mr: 2 }} size='large'>
            Cancel
          </Button>
          <Button variant="contained" color="success" sx={{ borderRadius: 3, padding: '0 32px', fontSize: 16, fontWeight: 600 }} size='large'>
            Next
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}

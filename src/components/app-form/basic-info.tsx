import { useState } from 'react';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Grid, Radio, Button, TextField, Container, RadioGroup, Typography, FormControlLabel, } from '@mui/material';

export default function BasicInfo() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [givenDate, setGivenDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

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
        Basic information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2">
            Full name
          </Typography>
          <TextField
            required
            fullWidth
            variant="outlined"
            placeholder="Enter your full name"
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography variant="body2">
            Date of birth
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={selectedDate}
              onChange={(newValue: any) => {
                setSelectedDate(newValue);
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2">
            Gender
          </Typography>
          <RadioGroup row aria-label="gender" name="gender">
            <FormControlLabel value="man" control={<Radio />} label="Man" />
            <FormControlLabel value="woman" control={<Radio />} label="Woman" />
          </RadioGroup>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2">
            Passport
          </Typography>
          <TextField
            required
            fullWidth
            variant="outlined"
            placeholder="Your passport serial number"
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography variant="body2">
            Given Date
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={givenDate}
              onChange={(newValue: any) => {
                setGivenDate(newValue);
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={6} sm={4}>
          <Typography variant="body2">
            End Date
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={endDate}
              onChange={(newValue: any) => {
                setEndDate(newValue);
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            Citizenship
          </Typography>
          <TextField
            required
            fullWidth
            variant="outlined"
            placeholder="Your citizenship"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            Telephone number
          </Typography>
          <TextField
            required
            fullWidth
            variant="outlined"
            placeholder="Enter your telephone number"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            Email
          </Typography>
          <TextField
            required
            fullWidth
            variant="outlined"
            placeholder="Enter your email"
          />
        </Grid>
        <Grid item xs={12} sm={6} display="flex" justifyContent="flex-end" alignItems="end">
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

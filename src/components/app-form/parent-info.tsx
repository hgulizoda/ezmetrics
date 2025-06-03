import { useState } from 'react';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Grid, Button, TextField, Container, Typography, } from '@mui/material';

export default function ParentInfo() {
  const [fatherDate, setFatherDate] = useState(null);
  const [motherDate, setMotherDate] = useState(null);

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
        Parent&#39;s full information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2">
            Father&#39;s full name
          </Typography>
          <TextField
            required
            fullWidth
            variant="outlined"
            placeholder="Enter your father’s full name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            Father&#39;s DOB
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={fatherDate}
              onChange={(newValue: any) => {
                setFatherDate(newValue);
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2">
            Father&#39;s passport
          </Typography>
          <TextField
            required
            fullWidth
            variant="outlined"
            placeholder="Enter your father’s serial number"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2">
            Father&#39;s phone
          </Typography>
          <TextField
            required
            fullWidth
            variant="outlined"
            placeholder="Enter your father’s phone number"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2">
            Father&#39;s occupation
          </Typography>
          <TextField
            required
            fullWidth
            variant="outlined"
            placeholder="Enter your father’s occupation"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2">
            Mother&#39;s full name
          </Typography>
          <TextField
            required
            fullWidth
            variant="outlined"
            placeholder="Enter your mother’s full name"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2">
            Mother&#39;s full DOB
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              value={motherDate}
              onChange={(newValue: any) => {
                setMotherDate(newValue);
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2">
            Mother&#39;s passport
          </Typography>
          <TextField
            required
            fullWidth
            variant="outlined"
            placeholder="Enter your mother’s serial number"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2">
            Mother&#39;s phone
          </Typography>
          <TextField
            required
            fullWidth
            variant="outlined"
            placeholder="Enter your mother’s phone number"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="body2">
            Mother&#39;s occupation
          </Typography>
          <TextField
            required
            fullWidth
            variant="outlined"
            placeholder="Enter your mother’s occupation"
          />
        </Grid>
        <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end" alignItems="center">
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

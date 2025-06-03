import { useState } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import { Stack, Button, Container, Typography, useMediaQuery, } from '@mui/material';

import Iconify from '../iconify';
import BasicInfo from './basic-info';
import ParentInfo from './parent-info';
import EduBackground from './edu-background';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ApplicationForm() {
  const [value, setValue] = useState(0);
  const mobile = useMediaQuery('(max-width: 600px)');


  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box bgcolor='#f4f6f8' padding='30px 0'>
      <Container>
        <Box
          textAlign="center"
          display="flex"
          flexDirection="column"
          alignItems="center"
          padding={3}
          sx={{ backgroundColor: '#f9f9f9', borderRadius: 2 }}
        >
          <Button
            variant="contained"
            sx={{ mb: 2 }}
          >
            <Iconify width={14} marginRight={1} icon="material-symbols:circle" />  Submit an application
          </Button>
          <Typography
            fontSize={!mobile ? 40 : 28}
            gutterBottom
          >
            Application to the university
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
          >
            Please fill in the fields below completely and correctly
            and be sure to check back
          </Typography>
        </Box>
      </Container>
      <Container maxWidth="lg" sx={{ padding: { xs: 2, sm: 3 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems='start'
          gap={2}
        >
          <Box
            sx={{
              bgcolor: '#fff',
              padding: 2,
              borderRadius: 2,
              boxShadow: 3,
              width: { xs: '100%', sm: '350px' },
            }}
          >
            <Tabs
              textColor="primary"
              indicatorColor="primary"
              style={{
                width: !mobile ? '100%' : '260px',
              }}
              // @ts-ignore
              orientation='vertical'
              sx={{ '& .MuiTabs-indicator': { display: 'none' } }}
              variant='fullWidth'
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
                icon={<Iconify icon="carbon:user-profile" />}
                iconPosition="start"
                label="Basic information"
                {...a11yProps(0)}
              />
              <Tab
                sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
                icon={<Iconify icon="carbon:book" />}
                iconPosition="start"
                label="Educational background"
                {...a11yProps(1)}
              />
              <Tab
                sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
                icon={<Iconify icon="carbon:document" />}
                iconPosition="start"
                label="Parent’s info"
                {...a11yProps(2)}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <BasicInfo />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <EduBackground />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <ParentInfo />
          </CustomTabPanel>
        </Stack>
      </Container>
    </Box>
  );
}

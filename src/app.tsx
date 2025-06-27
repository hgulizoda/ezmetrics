import { Toaster } from 'sonner';
import 'yet-another-react-lightbox/styles.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// ----------------------------------------------------------------------
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Router from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import 'src/global.css';
import ThemeProvider from 'src/theme';
import { AuthProvider } from 'src/auth/context/jwt';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';

import { ChatProvider } from './pages/dashboard/chat/chatProvider';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  return (
    <AuthProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SettingsProvider
          defaultSettings={{
            themeMode: 'light', // 'light' | 'dark'
            themeDirection: 'ltr', //  'rtl' | 'ltr'
            themeContrast: 'default', // 'default' | 'bold'
            themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
            themeColorPresets: 'blue', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
            themeStretch: false,
          }}
        >
          <ThemeProvider>
            <ChatProvider>
              <MotionLazy>
                <SettingsDrawer />
                <ProgressBar />
                <Router />
                <Toaster />
              </MotionLazy>
            </ChatProvider>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </SettingsProvider>
      </LocalizationProvider>
    </AuthProvider>
  );
}

import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { DevSupport } from '@react-buddy/ide-toolbox';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './app';
import { queryClient } from './query';
import { useInitial, ComponentPreviews } from './dev';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense>
        <SnackbarProvider>
          <QueryClientProvider client={queryClient}>
            <DevSupport ComponentPreviews={ComponentPreviews} useInitialHook={useInitial}>
              <App />
            </DevSupport>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </SnackbarProvider>
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);

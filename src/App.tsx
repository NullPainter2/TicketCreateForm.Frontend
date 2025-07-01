import 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Box } from '@mui/material';

import { TicketCreateForm } from './TicketCreateForm/TicketCreateForm';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Box sx={{ maxWidth: '800px' }}>
        <TicketCreateForm />
      </Box>
    </QueryClientProvider>
  )
}

export default App

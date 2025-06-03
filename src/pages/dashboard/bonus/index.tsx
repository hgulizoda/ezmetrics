import { Container } from '@mui/material';

import { BonusesView } from '../../../modules/bonuses/ui';

export default function Page() {
  return (
    <Container maxWidth={false} sx={{ height: '100%' }}>
      <BonusesView />
    </Container>
  );
}

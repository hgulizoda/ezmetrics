import { useCallback } from 'react';

// Mock socket - no real WebSocket connection
export const useChatSocket = () => {
  const emit = useCallback((_event: string, _payload: any) => {
    // No-op: socket events are mocked
    console.log('[MockSocket] emit:', _event, _payload);
  }, []);

  return { emit };
};

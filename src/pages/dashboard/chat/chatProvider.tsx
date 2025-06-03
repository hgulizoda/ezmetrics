import { useMemo, ReactNode } from 'react';

import { useChatSocket } from './useSocket';
import { ChatContext } from './chatContext';

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { emit } = useChatSocket();
  const value = useMemo(() => ({ emit }), [emit]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

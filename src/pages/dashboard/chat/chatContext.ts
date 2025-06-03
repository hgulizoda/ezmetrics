// ChatContext.tsx
import { useContext, createContext } from 'react';

type ChatContextType = {
  emit: (event: string, payload: any) => void;
};

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

import { useSearchParams } from 'react-router-dom';
import { useRef, useEffect, useCallback } from 'react';

import { useChatContext } from 'src/pages/dashboard/chat/chatContext';

export default function useMessagesScroll(messages: any[]) {
  const { emit } = useChatContext();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollToBottom = useRef(true);
  const previousScrollHeight = useRef(0);

  const handleScroll = useCallback(() => {
    const refCurrent = messagesEndRef.current;
    if (!refCurrent) return;

    if (refCurrent.scrollTop > 40) {
      shouldScrollToBottom.current = false;
    }
  }, []);

  useEffect(() => {
    const refCurrent = messagesEndRef.current;
    if (!refCurrent) return;

    refCurrent.addEventListener('scroll', handleScroll);
    emit('mark_as_read', {
      room_id: searchParams.get('id'),
    });
    // eslint-disable-next-line consistent-return
    return () => {
      refCurrent.removeEventListener('scroll', handleScroll);
    };
  }, [emit, handleScroll, searchParams]);

  useEffect(() => {
    const refCurrent = messagesEndRef.current;
    if (!refCurrent) return;

    const currentScrollHeight = refCurrent.scrollHeight;

    if (shouldScrollToBottom.current) {
      refCurrent.scrollTo(0, currentScrollHeight);
    } else {
      const scrollOffset = currentScrollHeight - previousScrollHeight.current;
      refCurrent.scrollTop += scrollOffset;
    }

    previousScrollHeight.current = currentScrollHeight;
  }, [messages]);

  return {
    messagesEndRef,
  };
}

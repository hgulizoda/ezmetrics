import { useRef, useEffect, useCallback } from 'react';

import { IMessage } from '../types/chat';

export default function useMessagesScroll(messages: IMessage[], onEndReach: () => void) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollToBottom = useRef(true);
  const previousScrollHeight = useRef(0);

  const handleScroll = useCallback(() => {
    const refCurrent = messagesEndRef.current;
    if (!refCurrent) return;

    if (refCurrent.scrollTop > 40) {
      shouldScrollToBottom.current = false;
    }

    if (refCurrent.scrollTop <= 40) {
      onEndReach();
    }
  }, [onEndReach]);

  useEffect(() => {
    const refCurrent = messagesEndRef.current;
    if (!refCurrent) return;

    refCurrent.addEventListener('scroll', handleScroll);

    // eslint-disable-next-line consistent-return
    return () => {
      refCurrent.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

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

// useEffect(() => {
//   const refCurrent = messagesEndRef.current;
//   if (!refCurrent) return;

//   refCurrent.addEventListener('scroll', handleScroll);
//   emit('mark_as_read', {
//     room_id: searchParams.get('id'),
//   });

//   // eslint-disable-next-line consistent-return
//   return () => {
//     refCurrent.removeEventListener('scroll', handleScroll);
//   };
// }, [emit, handleScroll, searchParams]);

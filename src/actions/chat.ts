import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { keyBy } from 'src/utils/helper';

import type { IChatMessage, IChatParticipant, IChatConversation } from 'src/types/chat';

// ----------------------------------------------------------------------

const CHART_ENDPOINT = '/chat';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// Mock fetcher that returns empty data
const mockFetcher = async () => ({ contacts: [], conversations: [], conversation: null as any });

// ----------------------------------------------------------------------

type ContactsData = {
  contacts: IChatParticipant[];
};

export function useGetContacts() {
  const url = [CHART_ENDPOINT, { params: { endpoint: 'contacts' } }];

  const { data, isLoading, error, isValidating } = useSWR<ContactsData>(url, mockFetcher, swrOptions);

  const memoizedValue = useMemo(
    () => ({
      contacts: data?.contacts || [],
      contactsLoading: isLoading,
      contactsError: error,
      contactsValidating: isValidating,
      contactsEmpty: !isLoading && !data?.contacts.length,
    }),
    [data?.contacts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

type ConversationsData = {
  conversations: IChatConversation[];
};

export function useGetConversations() {
  const url = [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }];

  const { data, isLoading, error, isValidating } = useSWR<ConversationsData>(
    url,
    mockFetcher,
    swrOptions
  );

  const memoizedValue = useMemo(() => {
    const byId = data?.conversations.length ? keyBy(data.conversations, 'id') : {};
    const allIds = Object.keys(byId);

    return {
      conversations: { byId, allIds },
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isValidating,
      conversationsEmpty: !isLoading && !allIds.length,
    };
  }, [data?.conversations, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

type ConversationData = {
  conversation: IChatConversation;
};

export function useGetConversation(conversationId: string) {
  const url = conversationId
    ? [CHART_ENDPOINT, { params: { conversationId, endpoint: 'conversation' } }]
    : '';

  const { data, isLoading, error, isValidating } = useSWR<ConversationData>(
    url,
    mockFetcher,
    swrOptions
  );

  const memoizedValue = useMemo(
    () => ({
      conversation: data?.conversation,
      conversationLoading: isLoading,
      conversationError: error,
      conversationValidating: isValidating,
    }),
    [data?.conversation, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function sendMessage(conversationId: string, messageData: IChatMessage) {
  const conversationsUrl = [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }];

  const conversationUrl = [
    CHART_ENDPOINT,
    { params: { conversationId, endpoint: 'conversation' } },
  ];

  mutate(
    conversationUrl,
    (currentData: any) => {
      const currentConversation: IChatConversation = currentData.conversation;

      const conversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, messageData],
      };

      return { ...currentData, conversation };
    },
    false
  );

  mutate(
    conversationsUrl,
    (currentData: any) => {
      const currentConversations: IChatConversation[] = currentData.conversations;

      const conversations: IChatConversation[] = currentConversations.map(
        (conversation: IChatConversation) =>
          conversation.id === conversationId
            ? { ...conversation, messages: [...conversation.messages, messageData] }
            : conversation
      );

      return { ...currentData, conversations };
    },
    false
  );
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData: IChatConversation) {
  const url = [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }];

  mutate(
    url,
    (currentData: any) => {
      const currentConversations: IChatConversation[] = currentData?.conversations || [];

      const conversations: IChatConversation[] = [...currentConversations, conversationData];

      return { ...currentData, conversations };
    },
    false
  );

  return conversationData;
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId: string) {
  mutate(
    [CHART_ENDPOINT, { params: { endpoint: 'conversations' } }],
    (currentData: any) => {
      const currentConversations: IChatConversation[] = currentData?.conversations || [];

      const conversations = currentConversations.map((conversation: IChatConversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      );

      return { ...currentData, conversations };
    },
    false
  );
}

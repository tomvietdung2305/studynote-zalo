import { useEffect, useState } from 'react';
import { Message, Conversation } from '@/types';
import { messageService } from '@/services/message.service';

interface UseConversationsReturn {
  conversations: Conversation[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useConversations(): UseConversationsReturn {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch conversations'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return { conversations, loading, error, refetch: fetchConversations };
}

interface UseConversationMessagesReturn {
  messages: Message[];
  loading: boolean;
  error: Error | null;
  sendMessage: (content: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useConversationMessages(conversationId: string): UseConversationMessagesReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await messageService.getConversationMessages(conversationId);
      setMessages(data);
      
      // Mark conversation as read
      await messageService.markConversationAsRead(conversationId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch messages'));
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    try {
      const newMessage = await messageService.sendMessage(conversationId, content, 'text');
      setMessages([...messages, newMessage]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to send message'));
    }
  };

  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  return { messages, loading, error, sendMessage, refetch: fetchMessages };
}

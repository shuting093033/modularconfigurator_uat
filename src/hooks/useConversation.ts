import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, ConversationContext } from '@/services/aiEstimateService';
import { conversationService, SavedConversation } from '@/services/conversationService';
import { aiActionIntegrationService, AIActionContext } from '@/services/aiActionIntegrationService';

export interface UseConversationProps {
  estimateId?: string;
  autoSave?: boolean;
  onActionResult?: (results: any[]) => void;
}

export const useConversation = ({
  estimateId,
  autoSave = true,
  onActionResult
}: UseConversationProps = {}) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant for building data center estimates. I can help you find components, create assemblies, and optimize your costs. What project are you working on today?',
      timestamp: new Date()
    }
  ]);
  const [context, setContext] = useState<ConversationContext | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Load conversation if ID is provided
  const loadConversation = useCallback(async (id: string) => {
    try {
      const conversation = await conversationService.loadConversation(id);
      if (conversation?.conversation_data) {
        setMessages(conversation.conversation_data.messages || []);
        setContext(conversation.conversation_data.context);
        setConversationId(id);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  }, []);

  // Save conversation
  const saveConversation = useCallback(async (title?: string) => {
    if (messages.length <= 1) return; // Don't save empty conversations
    
    try {
      const id = await conversationService.saveConversation(
        messages,
        context,
        conversationId || undefined,
        title
      );
      
      if (!conversationId) {
        setConversationId(id);
      }
      
      return id;
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
  }, [messages, context, conversationId]);

  // Auto-save when messages change
  useEffect(() => {
    if (autoSave && messages.length > 1) {
      const timeoutId = setTimeout(() => {
        saveConversation().catch(console.error);
      }, 2000); // Debounce save for 2 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [messages, autoSave, saveConversation]);

  // Update context when estimate changes
  useEffect(() => {
    if (estimateId) {
      aiActionIntegrationService.getCurrentEstimateContext(estimateId)
        .then(estimateContext => {
          if (estimateContext) {
            setContext(estimateContext);
          }
        })
        .catch(console.error);
    }
  }, [estimateId]);

  // Add message to conversation
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  // Clear conversation
  const clearConversation = useCallback(() => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant for building data center estimates. I can help you find components, create assemblies, and optimize your costs. What project are you working on today?',
      timestamp: new Date()
    }]);
    setConversationId(null);
    setContext(undefined);
  }, []);

  // Create new conversation
  const newConversation = useCallback(() => {
    clearConversation();
  }, [clearConversation]);

  // Delete conversation
  const deleteConversation = useCallback(async (id?: string) => {
    const targetId = id || conversationId;
    if (!targetId) return;

    try {
      await conversationService.deleteConversation(targetId);
      if (targetId === conversationId) {
        clearConversation();
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }, [conversationId, clearConversation]);

  return {
    conversationId,
    messages,
    context,
    isLoading,
    setIsLoading,
    addMessage,
    loadConversation,
    saveConversation,
    clearConversation,
    newConversation,
    deleteConversation,
    setContext
  };
};
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage, ConversationContext } from "./aiEstimateService";

export interface SavedConversation {
  id: string;
  user_id: string;
  estimate_id?: string;
  conversation_data: {
    messages: ChatMessage[];
    context?: ConversationContext;
    title?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ConversationMetadata {
  id: string;
  title: string;
  estimateId?: string;
  messageCount: number;
  lastActivity: Date;
  createdAt: Date;
}

class ConversationService {
  async saveConversation(
    messages: ChatMessage[], 
    context?: ConversationContext,
    conversationId?: string,
    title?: string
  ): Promise<string> {
    try {
      // Convert data to JSON-serializable format
      const conversationData = {
        messages: messages.map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString()
        })),
        context: context ? {
          estimateId: context.estimateId,
          projectType: context.projectType,
          currentItems: context.currentItems,
          totalCost: context.totalCost
        } : undefined,
        title: title || this.generateTitle(messages)
      };

      if (conversationId) {
        // Update existing conversation
        const { error } = await supabase
          .from('ai_conversations')
          .update({
            conversation_data: conversationData as any,
            updated_at: new Date().toISOString()
          })
          .eq('id', conversationId);

        if (error) throw error;
        return conversationId;
      } else {
        // Create new conversation
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
          .from('ai_conversations')
          .insert({
            conversation_data: conversationData as any,
            estimate_id: context?.estimateId,
            user_id: userData.user.id
          })
          .select()
          .single();

        if (error) throw error;
        return data.id;
      }
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw new Error('Failed to save conversation');
    }
  }

  async loadConversation(conversationId: string): Promise<SavedConversation | null> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      // Convert back from JSON format
      const conversationData = data.conversation_data as any;
      return {
        ...data,
        conversation_data: {
          messages: conversationData?.messages?.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })) || [],
          context: conversationData?.context,
          title: conversationData?.title
        }
      };
    } catch (error) {
      console.error('Error loading conversation:', error);
      return null;
    }
  }

  async getConversationList(): Promise<ConversationMetadata[]> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('id, conversation_data, estimate_id, created_at, updated_at')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(conv => {
        const conversationData = conv.conversation_data as any;
        return {
          id: conv.id,
          title: conversationData?.title || 'Untitled Conversation',
          estimateId: conv.estimate_id,
          messageCount: conversationData?.messages?.length || 0,
          lastActivity: new Date(conv.updated_at),
          createdAt: new Date(conv.created_at)
        };
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  async deleteConversation(conversationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw new Error('Failed to delete conversation');
    }
  }

  async getConversationsForEstimate(estimateId: string): Promise<ConversationMetadata[]> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('id, conversation_data, created_at, updated_at')
        .eq('estimate_id', estimateId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(conv => {
        const conversationData = conv.conversation_data as any;
        return {
          id: conv.id,
          title: conversationData?.title || 'Untitled Conversation',
          estimateId,
          messageCount: conversationData?.messages?.length || 0,
          lastActivity: new Date(conv.updated_at),
          createdAt: new Date(conv.created_at)
        };
      });
    } catch (error) {
      console.error('Error fetching estimate conversations:', error);
      return [];
    }
  }

  private generateTitle(messages: ChatMessage[]): string {
    // Find the first user message with substantial content
    const userMessage = messages.find(m => 
      m.role === 'user' && 
      m.content.length > 10 && 
      !m.content.toLowerCase().includes('hello')
    );

    if (userMessage) {
      // Extract key words and create a title
      const words = userMessage.content.split(' ').slice(0, 5);
      return words.join(' ') + (userMessage.content.split(' ').length > 5 ? '...' : '');
    }

    return `Conversation ${new Date().toLocaleDateString()}`;
  }

  generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const conversationService = new ConversationService();
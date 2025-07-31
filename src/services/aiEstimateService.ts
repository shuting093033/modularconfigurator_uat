import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIResponse {
  response: string;
  suggestions: ComponentSuggestion[];
  actions?: AIAction[];
  actionResults?: any[];
}

export interface AIAction {
  type: 'create_component' | 'create_assembly' | 'add_to_estimate' | 'search_components';
  data: any;
  reasoning: string;
}

export interface ComponentSuggestion {
  componentId: string;
  componentName: string;
  category: string;
  quantity?: number;
  reasoning: string;
}

export interface ConversationContext {
  estimateId?: string;
  projectType?: string;
  currentItems: any[];
  totalCost: number;
}

class AIEstimateService {
  async sendMessage(
    message: string, 
    conversationHistory: ChatMessage[],
    context?: ConversationContext
  ): Promise<AIResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message,
          conversationHistory: conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          estimateContext: context
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        
        // Provide specific error messages for common issues
        if (error.message?.includes('Authentication')) {
          throw new Error('Please ensure you are logged in and try again.');
        }
        
        if (error.message?.includes('timeout')) {
          throw new Error('AI assistant is taking longer than expected. Please try again.');
        }
        
        throw error;
      }

      // Validate the response structure
      if (!data || !data.response) {
        throw new Error('Invalid response from AI assistant');
      }

      return data;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Failed to communicate with AI assistant. Please check your connection and try again.');
    }
  }


  async searchComponents(query: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('components')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching components:', error);
      return [];
    }
  }

  async getAssembliesByCategory(category: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('assemblies')
        .select('*')
        .ilike('name', `%${category}%`)
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting assemblies:', error);
      return [];
    }
  }

  parseIntent(message: string): {
    intent: 'add_component' | 'create_assembly' | 'modify_quantity' | 'get_info' | 'general';
    entities: string[];
  } {
    const lowerMessage = message.toLowerCase();
    
    // Simple intent detection - will be enhanced with AI in later phases
    if (lowerMessage.includes('add') || lowerMessage.includes('need') || lowerMessage.includes('include')) {
      return { intent: 'add_component', entities: this.extractEntities(message) };
    }
    
    if (lowerMessage.includes('assembly') || lowerMessage.includes('group') || lowerMessage.includes('bundle')) {
      return { intent: 'create_assembly', entities: this.extractEntities(message) };
    }
    
    if (lowerMessage.includes('change') || lowerMessage.includes('update') || lowerMessage.includes('modify')) {
      return { intent: 'modify_quantity', entities: this.extractEntities(message) };
    }
    
    if (lowerMessage.includes('what') || lowerMessage.includes('how') || lowerMessage.includes('tell me')) {
      return { intent: 'get_info', entities: this.extractEntities(message) };
    }
    
    return { intent: 'general', entities: this.extractEntities(message) };
  }

  private extractEntities(message: string): string[] {
    // Simple entity extraction - will be enhanced with NLP
    const commonTerms = [
      'server', 'rack', 'cooling', 'power', 'ups', 'generator', 'pdu', 'switch',
      'router', 'cable', 'fiber', 'copper', 'hvac', 'chiller', 'fan', 'battery',
      'transformer', 'panel', 'breaker', 'redundant', 'backup', 'primary'
    ];
    
    const words = message.toLowerCase().split(/\s+/);
    return words.filter(word => commonTerms.includes(word));
  }

  generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const aiEstimateService = new AIEstimateService();
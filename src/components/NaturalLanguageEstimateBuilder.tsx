import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Bot, User, Loader2, Plus, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { aiEstimateService, ChatMessage, ConversationContext } from '@/services/aiEstimateService';
import { useConversation } from '@/hooks/useConversation';
import { aiActionIntegrationService, AIActionContext } from '@/services/aiActionIntegrationService';
import { ConversationManager } from './ConversationManager';

interface NaturalLanguageEstimateBuilderProps {
  onAddComponent?: (component: any) => void;
  onAddAssembly?: (assembly: any) => void;
  currentEstimate?: ConversationContext;
  estimateId?: string;
  onEstimateUpdated?: () => void;
}

export const NaturalLanguageEstimateBuilder: React.FC<NaturalLanguageEstimateBuilderProps> = ({
  onAddComponent,
  onAddAssembly,
  currentEstimate,
  estimateId,
  onEstimateUpdated
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [showConversationManager, setShowConversationManager] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    conversationId,
    messages,
    context,
    isLoading,
    setIsLoading,
    addMessage,
    loadConversation,
    saveConversation,
    newConversation,
    deleteConversation,
    setContext
  } = useConversation({
    estimateId,
    autoSave: true,
    onActionResult: (results) => {
      console.log('Action results:', results);
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update context when currentEstimate changes
  useEffect(() => {
    if (currentEstimate) {
      setContext(currentEstimate);
    }
  }, [currentEstimate, setContext]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    addMessage(userMessage);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiEstimateService.sendMessage(
        inputMessage,
        messages,
        context || currentEstimate
      );

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      };

      addMessage(aiMessage);
      setSuggestions(response.suggestions || []);
      setActions(response.actions || []);

      // Process AI actions with integration service
      if (response.actionResults && response.actionResults.length > 0) {
        const actionContext: AIActionContext = {
          estimateId,
          onComponentAdded: onAddComponent,
          onAssemblyAdded: onAddAssembly,
          onEstimateUpdated
        };

        const integrationResults = await aiActionIntegrationService.processAIActions(
          response.actionResults,
          actionContext
        );

        console.log('AI action integration results:', integrationResults);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or contact support if the issue persists.',
        timestamp: new Date()
      };
      
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleConversationSelect = async (conversationId: string) => {
    await loadConversation(conversationId);
    setShowConversationManager(false);
  };

  const handleNewConversation = () => {
    newConversation();
    setShowConversationManager(false);
  };

  const handleConversationDelete = (deletedId: string) => {
    if (deletedId === conversationId) {
      newConversation();
    }
  };

  return (
    <div className="flex h-[800px] max-w-7xl mx-auto gap-4">
      {showConversationManager && (
        <ConversationManager
          currentConversationId={conversationId}
          estimateId={estimateId}
          onConversationSelect={handleConversationSelect}
          onNewConversation={handleNewConversation}
          onConversationDelete={handleConversationDelete}
        />
      )}
      
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Estimate Builder
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConversationManager(!showConversationManager)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Conversations
              </Button>
            </div>
            {(context || currentEstimate) && (
              <div className="text-sm text-muted-foreground">
                Current estimate: {(context || currentEstimate)?.currentItems?.length || 0} items, 
                ${(context || currentEstimate)?.totalCost?.toLocaleString() || '0'}
              </div>
            )}
            {conversationId && (
              <div className="text-xs text-muted-foreground">
                Conversation saved automatically
              </div>
            )}
          </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  
                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {(suggestions.length > 0 || actions.length > 0) && (
            <>
              <Separator />
              <div className="p-4 bg-muted/50 space-y-4">
                {suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Suggested Components:</h4>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => onAddComponent?.(suggestion)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {suggestion.componentName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {actions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">AI Actions Performed:</h4>
                    <div className="space-y-2">
                      {actions.map((action, index) => (
                        <div key={index} className="text-xs p-2 bg-background rounded border">
                          <div className="font-medium capitalize">{action.type.replace('_', ' ')}</div>
                          <div className="text-muted-foreground">{action.reasoning}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <Separator />
          
          <div className="p-4 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe what you need for your data center estimate..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "I need a 5MW data center estimate",
                "Add redundant cooling systems",
                "What UPS capacity do I need?",
                "Show me fiber optic options"
              ].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(suggestion)}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};
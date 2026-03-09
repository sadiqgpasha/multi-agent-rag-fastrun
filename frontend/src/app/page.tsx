'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Search, Brain, FileText, AlertCircle } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

type AgentStatus = 'idle' | 'supervisor' | 'researcher' | 'synthesizer' | 'error';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Track agent status based on loading state
  useEffect(() => {
    if (isLoading) {
      const sequence: AgentStatus[] = ['supervisor', 'researcher', 'synthesizer'];
      let index = 0;
      setAgentStatus(sequence[0]);
      
      const interval = setInterval(() => {
        index = (index + 1) % sequence.length;
        setAgentStatus(sequence[index]);
      }, 2000);
      
      return () => clearInterval(interval);
    } else {
      setAgentStatus('idle');
    }
  }, [isLoading]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    const assistantMessageId = `assistant-${Date.now()}`;
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: ''
    }]);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: accumulatedContent }
            : msg
        ));
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'An error occurred');
        setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [input, isLoading, messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const getAgentIcon = (status: AgentStatus) => {
    switch (status) {
      case 'researcher': return <Search className="w-4 h-4" />;
      case 'synthesizer': return <FileText className="w-4 h-4" />;
      case 'supervisor': return <Brain className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getAgentLabel = (status: AgentStatus) => {
    switch (status) {
      case 'researcher': return 'Researcher is searching...';
      case 'synthesizer': return 'Synthesizer is writing...';
      case 'supervisor': return 'Supervisor is coordinating...';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-zinc-950 font-sans selection:bg-blue-200 dark:selection:bg-blue-900">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-zinc-950/70 border-b border-gray-200 dark:border-zinc-800 p-4 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-teal-400 rounded-xl shadow-inner">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-400">
                Agentic RAG Explorer
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
                Powered by AWS Bedrock
              </p>
            </div>
          </div>
          
          {/* Agent Activity Indicator */}
          <AnimatePresence>
            {agentStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full"
              >
                <div className="text-blue-600 dark:text-blue-400">
                  {getAgentIcon(agentStatus)}
                </div>
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  {getAgentLabel(agentStatus)}
                </span>
                <div className="flex space-x-0.5">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto w-full">
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 pb-24">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error || 'An error occurred. Please try again.'}</p>
            </motion.div>
          )}
          
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-[60vh] text-center px-4"
            >
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">How can I help you today?</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md">
                I am a multi-agent AI system designed to research and synthesize information from your knowledge base.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 w-full max-w-2xl">
                {[
                  "Explain the architecture of Multi-Agent RAG",
                  "How does LangGraph coordinate agents?",
                  "What's the difference between a Researcher and Synthesizer node?",
                  "Summarize the deployment strategy in Terraform"
                ].map((suggestion, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="p-4 text-left border border-gray-200 dark:border-zinc-800 rounded-2xl hover:bg-white dark:hover:bg-zinc-900 shadow-sm hover:shadow-md transition-all group group-active:scale-[0.98]"
                  >
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {suggestion}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((m, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                key={m.id} 
                className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role !== 'user' && (
                  <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex flex-col items-center justify-center shadow-sm mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div 
                  className={`max-w-[85%] md:max-w-[75%] p-4 rounded-3xl shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 shrink-0 rounded-full bg-slate-200 dark:bg-zinc-800 flex flex-col items-center justify-center shadow-sm mt-1">
                    <User className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  </div>
                )}
              </motion.div>
            ))
          )}
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
             <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             className="flex gap-4 justify-start"
           >
             <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex flex-col items-center justify-center shadow-sm mt-1">
               <Bot className="w-4 h-4 text-white" />
             </div>
             <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 p-4 rounded-3xl rounded-tl-sm shadow-sm flex space-x-2 items-center h-12">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
             </div>
           </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      <div className="fixed bottom-0 left-0 w-full bg-gradient-to-t from-slate-50 to-transparent dark:from-zinc-950 pt-10 pb-6 shrink-0">
        <div className="max-w-3xl mx-auto px-4">
          <form 
            onSubmit={handleSubmit} 
            className="flex gap-2 items-end bg-white dark:bg-zinc-900 p-2 rounded-3xl border border-gray-200 dark:border-zinc-800 shadow-xl shadow-slate-200/50 dark:shadow-none focus-within:ring-2 focus-within:ring-blue-500/50 transition-all"
          >
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Ask the agents anything..."
              className="flex-1 max-h-32 min-h-12 bg-transparent p-3 outline-none px-4 resize-none leading-relaxed text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              rows={1}
              onKeyDown={(e) => {
                if(e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if(input.trim()) handleSubmit(e);
                }
              }}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-zinc-800 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all group active:scale-95"
            >
              <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
            Agents can make mistakes. Consider verifying important information.
          </p>
        </div>
      </div>
    </div>
  );
}

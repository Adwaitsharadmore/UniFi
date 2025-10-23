"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  getTransactions, 
  getGoal, 
  getUser, 
  getGamification,
  getInsights 
} from "@/lib/finance-data";
import { generateAIResponse } from "./ai-response-generator";
import { Bot, X, Send, DollarSign, Target, TrendingUp } from "lucide-react";
import type { Transaction, Goal, User, GamificationData, Insight } from "@/types/finance";

interface AIMessage {
  id: string;
  content: string;
  timestamp: string;
  isFromAI: boolean;
  suggestions?: string[];
}

interface AIChatWidgetProps {
  className?: string;
}

export default function AIChatWidget({ className }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load financial data
  const [financialData, setFinancialData] = useState<{
    transactions: Transaction[];
    goal: Goal | null;
    user: User | null;
    gamification: GamificationData;
    insights: Insight[];
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const transactions = getTransactions();
      const goal = getGoal();
      const user = getUser();
      const gamification = getGamification();
      const insights = getInsights();

      setFinancialData({
        transactions,
        goal,
        user,
        gamification,
        insights,
      });

      // Add welcome message
      if (messages.length === 0) {
        const welcomeMessage: AIMessage = {
          id: "welcome",
          content: "Hi! I'm your AI financial advisor. I can help you analyze your spending, track your goals, and make better financial decisions. What would you like to know?",
          timestamp: new Date().toISOString(),
          isFromAI: true,
          suggestions: [
            "How am I doing with my financial goals?",
            "What are my biggest spending categories?",
            "How can I save more money?",
            "Show me my financial insights"
          ]
        };
        setMessages([welcomeMessage]);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !financialData) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
      isFromAI: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage, financialData);
      
      const aiMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        isFromAI: true,
        suggestions: aiResponse.suggestions,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      const errorMessage: AIMessage = {
        id: `error-${Date.now()}`,
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
        isFromAI: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const getQuickStats = () => {
    if (!financialData) return null;

    const { transactions, goal, gamification } = financialData;
    const totalIncome = transactions
      .filter(t => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter(t => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      goalProgress: goal ? (goal.currentAmount / goal.targetAmount) * 100 : 0,
      level: gamification.level,
    };
  };

  const quickStats = getQuickStats();

  return (
    <div className={cn("fixed bottom-4 right-4 z-50", className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-96 h-[500px] bg-background border border-border rounded-lg shadow-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Financial Advisor</h3>
                  <p className="text-xs text-muted-foreground">Your personal finance assistant</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Stats */}
            {quickStats && (
              <div className="p-3 border-b border-border bg-muted/30">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-green-500" />
                    <span>Savings: ${quickStats.netSavings.toFixed(0)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-blue-500" />
                    <span>Goal: {quickStats.goalProgress.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-purple-500" />
                    <span>Rate: {quickStats.savingsRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span>Level: {quickStats.level}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex",
                    message.isFromAI ? "justify-start" : "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                      message.isFromAI
                        ? "bg-muted text-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <p>{message.content}</p>
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs mr-1 mb-1"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about your finances..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Toggle Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            size="lg"
          >
            <Bot className="w-6 h-6" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}

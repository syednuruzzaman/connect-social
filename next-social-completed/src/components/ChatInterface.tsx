"use client";

import { useState, useRef, useEffect } from "react";
import { useActionState } from "react";
import { sendMessage } from "@/lib/actions";
import Image from "next/image";

interface Message {
  id: number;
  content: string;
  createdAt: Date;
  senderId: string;
  sender: {
    id: string;
    username: string;
    avatar: string | null;
    name: string | null;
    surname: string | null;
  };
}

interface ChatUser {
  id: string;
  username: string;
  avatar: string | null;
  name: string | null;
  surname: string | null;
}

interface Conversation {
  id: number;
  messages: Message[];
}

interface ChatInterfaceProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  chatUser: ChatUser;
}

const ChatInterface = ({ conversation, messages, currentUserId, chatUser }: ChatInterfaceProps) => {
  const [state, formAction] = useActionState(sendMessage, { success: false, error: false });
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (messageText.trim()) {
        formRef.current?.requestSubmit();
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (state.success) {
      setMessageText("");
      formRef.current?.reset();
      console.log("Message sent successfully!"); // Debug log
    }
    if (state.error) {
      console.error("Failed to send message"); // Debug log
    }
  }, [state.success, state.error]);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="mb-4">
              <Image
                src="/messages.png"
                alt="No messages"
                width={40}
                height={40}
                className="mx-auto opacity-50"
              />
            </div>
            <p className="text-gray-500 mb-4 text-lg">No messages yet</p>
            <p className="text-sm text-gray-400 mb-6">
              Start the conversation by sending a message below!
            </p>
            <button
              onClick={focusInput}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
              title="Click to start typing your first message"
            >
              💬 Start Chat
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === currentUserId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === currentUserId
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800 shadow-sm"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span
                    className={`text-xs ${
                      message.senderId === currentUserId
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 p-4 border-t bg-white shadow-lg flex-shrink-0 z-10">
        <form ref={formRef} action={formAction} className="flex gap-3 items-end max-w-4xl mx-auto">
          <input
            type="hidden"
            name="receiverId"
            value={chatUser.id}
          />
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              name="content"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${chatUser.name && chatUser.surname ? `${chatUser.name} ${chatUser.surname}` : chatUser.username}...`}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none"
              required
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1 px-1">
              <span className="text-xs text-gray-400">
                {messageText.length}/500
              </span>
              {messageText.trim() && (
                <span className="text-xs text-green-500">
                  ✓ Ready to send
                </span>
              )}
            </div>
          </div>
          <button
            type="submit"
            className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg flex-shrink-0 ${
              messageText.trim()
                ? "bg-blue-500 hover:bg-blue-600 text-white scale-100"
                : "bg-gray-200 text-gray-400 cursor-not-allowed scale-95"
            }`}
            disabled={!messageText.trim()}
            title={messageText.trim() ? "Send message (Enter)" : "Type a message to send"}
          >
            {messageText.trim() ? (
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-white"
              >
                <path 
                  d="M2 21L23 12L2 3V10L17 12L2 14V21Z" 
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="text-gray-400"
              >
                <path 
                  d="M2 21L23 12L2 3V10L17 12L2 14V21Z" 
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </form>
        {state.error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center">
              <span className="mr-2">⚠️</span>
              Failed to send message. Please check your connection and try again.
            </p>
          </div>
        )}
        {state.success && (
          <div className="mt-2">
            <p className="text-xs text-green-600 flex items-center">
              <span className="mr-1">✓</span>
              Message sent successfully
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;

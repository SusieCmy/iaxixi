/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-12-05
 * @Description: 对话状态管理 Store
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message } from '@/types/chat'

interface ChatState {
  messages: Message[]
  addMessage: (message: Message) => void
  updateMessage: (id: string, content: string) => void
  deleteMessage: (id: string) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      updateMessage: (id, content) =>
        set((state) => ({
          messages: state.messages.map((msg) => (msg.id === id ? { ...msg, content } : msg)),
        })),

      deleteMessage: (id) =>
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== id),
        })),

      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'chat-storage', // localStorage key
    }
  )
)

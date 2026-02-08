/*
 * @Date: 2025-02-08
 * @Description: 聊天状态管理
 */

import { create } from 'zustand'

type ChatStore = {
  isOpen: boolean
  botId: string
  botName: string
  botIcon: string
  botDescription: string
  openChat: (botId: string, botName: string, botIcon: string, botDescription: string) => void
  closeChat: () => void
}

const useChatStore = create<ChatStore>()((set) => ({
  isOpen: false,
  botId: '',
  botName: '',
  botIcon: '',
  botDescription: '',
  openChat: (botId, botName, botIcon, botDescription) =>
    set({ isOpen: true, botId, botName, botIcon, botDescription }),
  closeChat: () => set({ isOpen: false }),
}))

export default useChatStore

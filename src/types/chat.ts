export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
}

export interface ChatRequest {
  messages: Message[]
  model?: string
  temperature?: number
  max_tokens?: number
}

export interface ChatResponse {
  message: Message
  finish_reason?: string
}

// DeepSeek API 类型
export interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface DeepSeekChatRequest {
  model: string
  messages: DeepSeekMessage[]
  stream?: boolean
  temperature?: number
  max_tokens?: number
}

export interface DeepSeekChatResponse {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    message: DeepSeekMessage
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface DeepSeekStreamChunk {
  id: string
  object: string
  created: number
  model: string
  choices: Array<{
    index: number
    delta: {
      role?: string
      content?: string
    }
    finish_reason: string | null
  }>
}

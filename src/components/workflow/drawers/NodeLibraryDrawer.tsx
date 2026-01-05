/*
 * @Date: 2025-12-18
 * @Description: 节点选择抽屉组件
 */
'use client'

import {
  Bot,
  Code,
  Database,
  Filter,
  GitBranch,
  Mail,
  MessageSquare,
  Network,
  Settings,
  Webhook,
  X,
} from 'lucide-react'
import { useEffect } from 'react'

interface NodeType {
  id: string
  name: string
  description: string
  icon: React.ElementType
  category: 'ai' | 'logic' | 'integration' | 'data'
}

interface NodeLibraryDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSelectNode: (nodeType: NodeType) => void
}

// 节点库数据
const NODE_LIBRARY: NodeType[] = [
  // AI 处理节点
  {
    id: 'ai-chat',
    name: 'AI 对话',
    description: '使用大语言模型进行对话交互',
    icon: MessageSquare,
    category: 'ai',
  },
  {
    id: 'ai-text-generation',
    name: '文本生成',
    description: '生成文章、摘要、翻译等文本内容',
    icon: Bot,
    category: 'ai',
  },
  {
    id: 'ai-analysis',
    name: '智能分析',
    description: '分析数据、提取关键信息',
    icon: Network,
    category: 'ai',
  },

  // 逻辑控制节点
  {
    id: 'switch',
    name: '分支判断',
    description: '根据不同条件执行不同分支（1进3出）',
    icon: GitBranch,
    category: 'logic',
  },
  {
    id: 'filter',
    name: '数据过滤',
    description: '过滤和筛选数据',
    icon: Filter,
    category: 'logic',
  },
  {
    id: 'code',
    name: '代码执行',
    description: '执行自定义 JavaScript 代码',
    icon: Code,
    category: 'logic',
  },

  // 集成节点
  {
    id: 'webhook',
    name: 'Webhook',
    description: '接收或发送 Webhook 请求',
    icon: Webhook,
    category: 'integration',
  },
  {
    id: 'email',
    name: '邮件发送',
    description: '发送电子邮件通知',
    icon: Mail,
    category: 'integration',
  },

  // 数据处理节点
  {
    id: 'database',
    name: '数据库操作',
    description: '读取或写入数据库',
    icon: Database,
    category: 'data',
  },
  {
    id: 'transform',
    name: '数据转换',
    description: '转换和处理数据格式',
    icon: Settings,
    category: 'data',
  },
]

const CATEGORY_NAMES = {
  ai: 'AI 处理',
  logic: '逻辑控制',
  integration: '第三方集成',
  data: '数据处理',
}

const CATEGORY_COLORS = {
  ai: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40',
  logic: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40',
  integration: 'bg-green-500/10 border-green-500/20 hover:border-green-500/40',
  data: 'bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40',
}

export default function NodeLibraryDrawer({
  isOpen,
  onClose,
  onSelectNode,
}: NodeLibraryDrawerProps) {
  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  // 按分类分组节点
  const groupedNodes = NODE_LIBRARY.reduce(
    (acc, node) => {
      if (!acc[node.category]) {
        acc[node.category] = []
      }
      acc[node.category].push(node)
      return acc
    },
    {} as Record<string, NodeType[]>
  )

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={0}
        aria-label="关闭抽屉"
      />

      {/* 抽屉 */}
      <div className="fixed top-0 right-0 z-[101] h-full w-full max-w-md transform bg-base-100 shadow-2xl transition-transform sm:max-w-lg">
        {/* 头部 */}
        <div className="flex items-center justify-between border-base-300 border-b p-6">
          <div>
            <h2 className="font-bold text-xl">选择节点</h2>
            <p className="text-base-content/60 text-sm">从节点库中选择要添加的节点</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-base-200"
            aria-label="关闭"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 节点列表 */}
        <div className="scrollbar-thin h-[calc(100vh-88px)] overflow-y-auto p-6">
          <div className="space-y-8">
            {Object.entries(groupedNodes).map(([category, nodes]) => (
              <div key={category}>
                <h3 className="mb-3 font-semibold text-base-content text-sm uppercase tracking-wider">
                  {CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES]}
                </h3>
                <div className="space-y-2">
                  {nodes.map((node) => {
                    const Icon = node.icon
                    return (
                      <button
                        key={node.id}
                        onClick={() => {
                          onSelectNode(node)
                          onClose()
                        }}
                        className={`w-full rounded-lg border p-4 text-left transition-all hover:shadow-md ${CATEGORY_COLORS[node.category]
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-base-100">
                            <Icon className="h-5 w-5 text-base-content" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="mb-1 font-semibold text-base-content text-sm">
                              {node.name}
                            </h4>
                            <p className="text-base-content/60 text-xs leading-relaxed">
                              {node.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

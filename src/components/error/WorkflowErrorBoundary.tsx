/*
 * @Date: 2025-12-18
 * @Description: ReactFlow 工作流编辑器错误边界 - 优雅降级处理
 */

'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'
import type React from 'react'
import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallbackTitle?: string
  fallbackMessage?: string
  fallbackRetry?: string
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * ReactFlow 工作流编辑器的错误边界组件
 *
 * 功能：
 * 1. 捕获子组件树中的 JavaScript 错误
 * 2. 显示友好的错误 UI 替代崩溃的组件树
 * 3. 提供重试机制让用户可以恢复
 * 4. 在开发环境记录错误详情
 *
 * 使用方式：
 * <WorkflowErrorBoundary
 *   fallbackTitle="工作流加载失败"
 *   fallbackMessage="抱歉，工作流编辑器遇到了问题"
 *   fallbackRetry="重新加载"
 * >
 *   <ReactFlow ... />
 * </WorkflowErrorBoundary>
 */
class WorkflowErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    // 更新 state 使下一次渲染显示降级 UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误到控制台（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ [WorkflowErrorBoundary] 捕获到错误:', error)
      console.error('📍 [WorkflowErrorBoundary] 错误堆栈:', errorInfo.componentStack)
    }

    // 调用自定义错误处理回调
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    // 重置错误状态，重新渲染子组件
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      const {
        fallbackTitle = 'Workflow Editor Error',
        fallbackMessage = 'Sorry, the workflow editor encountered an error. Please try reloading.',
        fallbackRetry = 'Reload',
      } = this.props

      return (
        <div className="flex h-screen w-screen items-center justify-center bg-[var(--jp-cream)]">
          <div className="max-w-md rounded-xl border border-error/20 bg-[var(--jp-paper)]/50 p-8 text-center shadow-lg">
            {/* 错误图标 */}
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/10">
                <AlertTriangle className="h-8 w-8 text-error" />
              </div>
            </div>

            {/* 错误标题 */}
            <h2 className="mb-2 font-bold text-2xl text-[var(--jp-ink)]">{fallbackTitle}</h2>

            {/* 错误描述 */}
            <p className="mb-6 text-[var(--jp-ink)]/70">{fallbackMessage}</p>

            {/* 开发环境：显示错误详情 */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 max-h-40 overflow-auto rounded-lg bg-[var(--jp-mist)] p-4 text-left">
                <p className="mb-2 font-mono text-error text-sm">
                  <strong>Error:</strong> {this.state.error.message}
                </p>
                <pre className="overflow-x-auto font-mono text-[var(--jp-ink)]/60 text-xs">
                  {this.state.error.stack}
                </pre>
              </div>
            )}

            {/* 重试按钮 */}
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--jp-vermilion)] px-6 py-3 font-medium text-[var(--jp-vermilion)]-content transition-all hover:scale-105 hover:bg-[var(--jp-vermilion)]/90"
            >
              <RefreshCw className="h-4 w-4" />
              <span>{fallbackRetry}</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default WorkflowErrorBoundary

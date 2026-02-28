/*
 * @Date: 2026-02-28
 * @Description: 公共 Markdown 渲染组件，支持代码高亮和流式光标
 */
'use client'

import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export const CURSOR_PLACEHOLDER = '\u200B__CURSOR__'

const markdownComponents: Components = {
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '')
    return match ? (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        className="my-2! rounded-md! text-xs!"
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className="rounded bg-(--jp-cream) px-1 py-0.5 text-xs" {...props}>
        {children}
      </code>
    )
  },
  p: ({ children }) => {
    const nodes = Array.isArray(children) ? children : [children]
    const processed = nodes.map((child, i) => {
      if (
        i === nodes.length - 1 &&
        typeof child === 'string' &&
        child.endsWith(CURSOR_PLACEHOLDER)
      ) {
        return (
          <span key="cursor-wrap">
            {child.replace(CURSOR_PLACEHOLDER, '')}
            <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-current align-middle" />
          </span>
        )
      }
      return child
    })
    return <p className="mb-1.5 last:mb-0">{processed}</p>
  },
  h3: ({ children }) => <h3 className="mt-2 mb-1 font-medium text-sm">{children}</h3>,
  ul: ({ children }) => <ul className="mb-1.5 list-disc pl-4">{children}</ul>,
  ol: ({ children }) => <ol className="mb-1.5 list-decimal pl-4">{children}</ol>,
  li: ({ children }) => <li className="mb-0.5">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-1.5 border-(--jp-vermilion) border-l-2 pl-2 text-(--jp-stone)">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-(--jp-indigo) underline" target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
}

interface Props {
  children: string
  /** 是否显示流式光标 */
  streaming?: boolean
  className?: string
}

export function MarkdownContent({ children, streaming, className }: Props) {
  const content = streaming ? children + CURSOR_PLACEHOLDER : children
  return (
    <div className={`wrap-break-word [&>*:first-child]:mt-0 ${className ?? ''}`}>
      <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
    </div>
  )
}

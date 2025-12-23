/*
 * @Date: 2025-12-11
 * @Description: AIGC 工作流编辑器布局 - 隐藏 Header 和 Footer
 */

export default function WorkflowEditorLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>{children}</div>
}

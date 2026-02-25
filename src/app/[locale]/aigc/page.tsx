/*
 * @Date: 2025-12-11
 * @Description: AIGC 工作流管理页面
 */
'use client'

import { Clock, FileText, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useToast } from '@/components/toast/ToastContainer'
import CreateWorkflowModal from '@/components/workflow/modals/CreateWorkflowModal'
import { workflowStorage } from '@/lib/workflowStorage'
import type { UserWorkflow } from '@/types/workflow'

export default function AIGCPage() {
  const [workflows, setWorkflows] = useState<UserWorkflow[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const router = useRouter()
  const toast = useToast()
  const t = useTranslations('aigc')
  const tToast = useTranslations('toast')

  // 加载工作流列表
  useEffect(() => {
    setWorkflows(workflowStorage.getAll())
  }, [])

  // 创建工作流
  const handleCreate = (data: { name: string; description: string; group: string }) => {
    const id = `workflow-${Date.now()}`
    const now = Date.now()

    const newWorkflow: UserWorkflow = {
      id,
      name: data.name,
      description: data.description,
      group: data.group,
      nodes: [
        {
          id: 'trigger-1',
          position: { x: 100, y: 150 },
          data: { label: t('defaultTriggerLabel') },
          type: 'trigger', // ✅ 触发节点类型
        },
      ],
      edges: [],
      createdAt: now,
      updatedAt: now,
    }

    try {
      workflowStorage.save(newWorkflow)
      toast.success(tToast('workflowCreateSuccess'))
      setShowCreateModal(false)
      // 跳转到工作流编辑页面
      router.push(`/aigc/${id}`)
    } catch (error) {
      toast.error(tToast('createFailed'))
      console.error('创建工作流失败:', error)
    }
  }

  // 删除工作流
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    try {
      workflowStorage.delete(id)
      setWorkflows(workflowStorage.getAll())
      toast.success(tToast('workflowDeleted'))
    } catch (error) {
      toast.error(tToast('deleteFailed'))
      console.error('删除工作流失败:', error)
    }
  }

  // 格式化时间
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-(--jp-cream)">
      <div className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* 页面头部 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 font-bold text-3xl text-(--jp-ink) sm:text-4xl">{t('title')}</h1>
            <p className="text-(--jp-ink)/60 text-base">{t('subtitle')}</p>
          </div>

          {/* 创建按钮 */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-(--jp-vermilion) px-4 py-2 text-(--jp-vermilion)-content transition-colors hover:bg-(--jp-vermilion)/90"
            aria-label={t('createWorkflow')}
          >
            <Plus className="h-5 w-5" />
            <span>{t('createWorkflow')}</span>
          </button>
        </div>

        {/* 工作流列表 */}
        {workflows.length === 0 ? (
          // 空状态
          <div className="py-16 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-(--jp-paper)">
              <FileText className="h-8 w-8 text-(--jp-ink)/40" />
            </div>
            <h3 className="mb-2 font-semibold text-(--jp-ink) text-lg">{t('emptyTitle')}</h3>
            <p className="mb-6 text-(--jp-ink)/60">{t('emptyDescription')}</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-(--jp-vermilion) px-6 py-3 text-(--jp-vermilion)-content transition-colors hover:bg-(--jp-vermilion)/90"
              aria-label={t('createWorkflow')}
            >
              <Plus className="h-5 w-5" />
              <span>{t('createWorkflow')}</span>
            </button>
          </div>
        ) : (
          // 工作流卡片网格
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map((workflow) => (
              <Link key={workflow.id} href={`/aigc/${workflow.id}`} className="group block">
                <div className="h-full rounded-xl p-6 shadow-sm transition-all duration-200 hover:shadow-lg">
                  {/* 卡片头部 */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 truncate font-semibold text-(--jp-ink) text-lg transition-colors group-hover:text-(--jp-vermilion)">
                        {workflow.name}
                      </h3>
                      <p className="line-clamp-2 text-(--jp-ink)/60 text-sm">
                        {workflow.description || t('noDescription')}
                      </p>
                    </div>

                    {/* 删除按钮 */}
                    <button
                      onClick={(e) => handleDelete(workflow.id, e)}
                      className="ml-2 rounded-lg p-2 transition-colors hover:bg-error/10 hover:text-error"
                      title={t('deleteWorkflow')}
                      aria-label={t('deleteWorkflow')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* 统计信息 */}
                  <div className="flex items-center gap-4 text-(--jp-ink)/50 text-xs">
                    <div className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      <span>{t('nodeCount', { count: workflow.nodes?.length || 0 })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{formatDate(workflow.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 创建工作流弹窗 */}
      <CreateWorkflowModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={handleCreate}
      />
    </div>
  )
}

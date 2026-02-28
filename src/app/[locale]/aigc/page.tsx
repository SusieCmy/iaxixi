/*
 * @Date: 2025-12-11
 * @Description: AIGC 工作流管理页面
 */
'use client'

import { Clock, FileText, Plus, Sparkles, Trash2 } from 'lucide-react'
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

  useEffect(() => {
    setWorkflows(workflowStorage.getAll())
  }, [])

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
          type: 'trigger',
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
      router.push(`/aigc/${id}`)
    } catch (error) {
      toast.error(tToast('createFailed'))
      console.error('创建工作流失败:', error)
    }
  }

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
    <div className="mx-auto max-w-screen-2xl px-6 py-8">
      {/* 页面头部 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-(family-name:--font-jp) mb-2 flex items-center gap-2 font-medium text-(--jp-ink) text-2xl">
            <Sparkles className="h-6 w-6 text-(--jp-vermilion)" />
            {t('title')}
          </h1>
          <p className="font-(family-name:--font-jp-sans) text-(--jp-ash) text-sm">
            {t('subtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="font-(family-name:--font-jp-sans) flex items-center gap-1.5 rounded-lg border border-(--jp-mist) bg-(--jp-cream) px-4 py-2 text-(--jp-ink) text-sm transition-colors hover:border-(--jp-vermilion) hover:text-(--jp-vermilion)"
          aria-label={t('createWorkflow')}
        >
          <Plus className="h-4 w-4" />
          {t('createWorkflow')}
        </button>
      </div>

      {/* 空状态 */}
      {workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg border border-(--jp-mist) bg-(--jp-paper)">
            <FileText className="h-6 w-6 text-(--jp-ash)" />
          </div>
          <h3 className="font-(family-name:--font-jp) mb-2 font-medium text-(--jp-ink) text-base">
            {t('emptyTitle')}
          </h3>
          <p className="font-(family-name:--font-jp-sans) mb-6 text-(--jp-ash) text-sm">
            {t('emptyDescription')}
          </p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="font-(family-name:--font-jp-sans) flex items-center gap-1.5 rounded-lg border border-(--jp-vermilion) px-5 py-2 text-(--jp-vermilion) text-sm transition-colors hover:bg-(--jp-vermilion) hover:text-white"
            aria-label={t('createWorkflow')}
          >
            <Plus className="h-4 w-4" />
            {t('createWorkflow')}
          </button>
        </div>
      ) : (
        /* 工作流列表 */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <Link key={workflow.id} href={`/aigc/${workflow.id}`} className="group block">
              <div className="relative h-full rounded-lg border border-(--jp-mist) bg-(--jp-cream) p-5 transition-colors hover:border-(--jp-stone)">
                {/* 删除按钮 */}
                <button
                  type="button"
                  onClick={(e) => handleDelete(workflow.id, e)}
                  className="absolute top-4 right-4 p-1.5 text-(--jp-ash) opacity-0 transition-all hover:text-(--jp-vermilion) group-hover:opacity-100"
                  title={t('deleteWorkflow')}
                  aria-label={t('deleteWorkflow')}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

                {/* 名称 */}
                <h3 className="font-(family-name:--font-jp) mb-2 truncate pr-6 font-medium text-(--jp-ink) text-base transition-colors group-hover:text-(--jp-vermilion)">
                  {workflow.name}
                </h3>

                {/* 描述 */}
                <p className="font-(family-name:--font-jp-sans) mb-4 line-clamp-2 text-(--jp-stone) text-xs leading-relaxed">
                  {workflow.description || t('noDescription')}
                </p>

                {/* 底部信息 */}
                <div className="font-(family-name:--font-jp-sans) flex items-center gap-4 border-(--jp-mist) border-t pt-3 text-(--jp-ash) text-xs">
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    <span>{t('nodeCount', { count: workflow.nodes?.length || 0 })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(workflow.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateWorkflowModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={handleCreate}
      />
    </div>
  )
}

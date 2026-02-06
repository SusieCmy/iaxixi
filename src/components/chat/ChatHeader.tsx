/*
 * @Author: Susie 1732728869@qq.com
 * @Date: 2025-12-05
 * @Description: 对话页面头部组件
 */
'use client'

import { ArrowLeft, Sparkles, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ROUTES } from '@/constants/routes'

interface ChatHeaderProps {
  hasMessages: boolean
  onClear: () => void
}

export function ChatHeader({ hasMessages, onClear }: ChatHeaderProps) {
  const t = useTranslations('chat')
  const tCommon = useTranslations('common')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleClearClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmClear = () => {
    setShowConfirmDialog(false)
    onClear()
  }

  const handleCancelClear = () => {
    setShowConfirmDialog(false)
  }

  return (
    <>
      <div className="flex-none border-[var(--jp-mist)] border-b bg-[var(--jp-cream)]">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-3 py-3 sm:px-4 sm:py-4 md:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 返回首页按钮 */}
            <Link
              href={ROUTES.INDEX}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--jp-ash)] transition-colors hover:bg-[var(--jp-paper)] hover:text-[var(--jp-ink)]"
              aria-label={tCommon('backToHome')}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>

            <div className="rounded-lg bg-[var(--jp-vermilion)] p-2 shadow-sm">
              <Sparkles className="h-4 w-4 text-white sm:h-5 sm:w-5" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-bold text-[var(--jp-ink)] text-base sm:text-lg md:text-xl">
                {t('title')}
              </h1>
              <p className="text-[10px] text-[var(--jp-ash)] sm:text-xs">{t('subtitle')}</p>
            </div>
          </div>
          {hasMessages && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearClick}
              className="gap-1 text-[var(--jp-ash)] hover:text-[var(--jp-ink)] sm:gap-2"
              aria-label={t('clearChat')}
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t('clearChat')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* 清空确认对话框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{tCommon('confirm')}</DialogTitle>
            <DialogDescription>{t('clearChatConfirm')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelClear}>
              {tCommon('cancel')}
            </Button>
            <Button onClick={handleConfirmClear}>{tCommon('delete')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

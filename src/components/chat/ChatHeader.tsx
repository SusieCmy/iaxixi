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
      <div className="flex-none border-base-300 border-b bg-base-100">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-3 py-3 sm:px-4 sm:py-4 md:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 返回首页按钮 */}
            <Link
              href={ROUTES.INDEX}
              className="cmy-btn cmy-btn-ghost cmy-btn-sm cmy-btn-circle"
              aria-label={tCommon('backToHome')}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>

            <div className="rounded-lg bg-primary p-2 shadow-sm">
              <Sparkles className="h-4 w-4 text-primary-content sm:h-5 sm:w-5" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-bold text-base text-base-content sm:text-lg md:text-xl">
                {t('title')}
              </h1>
              <p className="text-[10px] text-base-content/60 sm:text-xs">{t('subtitle')}</p>
            </div>
          </div>
          {hasMessages && (
            <button
              type="button"
              onClick={handleClearClick}
              className="cmy-btn cmy-btn-ghost cmy-btn-sm gap-1 text-xs transition-all hover:scale-105 sm:gap-2 sm:text-sm"
              aria-label={t('clearChat')}
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{t('clearChat')}</span>
            </button>
          )}
        </div>
      </div>

      {/* 清空确认对话框 */}
      {showConfirmDialog && (
        <div className="cmy-modal cmy-modal-open">
          <div className="cmy-modal-box max-w-sm">
            <h3 className="font-bold text-lg">{tCommon('confirm')}</h3>
            <p className="py-4 text-base-content/80">{t('clearChatConfirm')}</p>
            <div className="cmy-modal-action">
              <button type="button" onClick={handleCancelClear} className="cmy-btn cmy-btn-ghost">
                {tCommon('cancel')}
              </button>
              <button type="button" onClick={handleConfirmClear} className="cmy-btn cmy-btn-error">
                {tCommon('delete')}
              </button>
            </div>
          </div>
          <div
            className="cmy-modal-backdrop"
            onClick={handleCancelClear}
            onKeyDown={(e) => e.key === 'Escape' && handleCancelClear()}
            role="button"
            tabIndex={0}
            aria-label={tCommon('cancel')}
          />
        </div>
      )}
    </>
  )
}

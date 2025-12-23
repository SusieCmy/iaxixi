/*
 * @Date: 2025-12-18
 * @Description: 自定义边组件 - 带删除按钮和流动动画
 */

import type { EdgeProps } from '@xyflow/react'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react'
import { X } from 'lucide-react'
import { memo } from 'react'

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  // 使用贝塞尔曲线代替直线，更符合工作流的视觉习惯
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const onEdgeDelete = () => {
    if (data && typeof data === 'object' && 'onDelete' in data) {
      const onDeleteFn = data.onDelete as ((edgeId: string) => void) | undefined
      onDeleteFn?.(id)
    }
  }

  return (
    <>
      {/* 底层路径 - 用于增加点击区域 */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="cursor-pointer"
      />

      {/* 主路径 - 浅灰色底色 */}
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: '#cbd5e1', // slate-300
        }}
      />

      {/* 流动动画 - 多个箭头 */}
      <style>
        {`
          @keyframes flowAnimation {
            from {
              stroke-dashoffset: 20;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>

      {/* 动画路径 - 虚线流动效果 */}
      <BaseEdge
        path={edgePath}
        style={{
          ...style,
          strokeWidth: 2,
          stroke: '#8b5cf6', // violet-500
          strokeDasharray: '5 5',
          animation: data?.isExecuting ? 'flowAnimation 1s linear infinite' : 'none',
          opacity: data?.isExecuting ? 1 : 0, // 只有执行时才显示紫色虚线
          transition: 'opacity 0.3s ease',
          fill: 'none',
        }}
      />

      {/* 删除按钮 */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan group"
        >
          <button
            onClick={onEdgeDelete}
            className="flex h-5 w-5 items-center justify-center rounded-full border border-base-300 bg-base-100 text-base-content/40 shadow-sm transition-all hover:scale-110 hover:border-error hover:bg-error hover:text-sky-50"
            title="删除连接"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

export default memo(CustomEdge)

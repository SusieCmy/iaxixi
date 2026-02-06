/*
 * @Date: 2025-12-11
 * @LastEditors: Claude Code
 * @Description: AI 工作流编辑器 - ReactFlow
 */
'use client'

import type { Connection, Edge, EdgeChange, Node, NodeChange } from '@xyflow/react'
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
} from '@xyflow/react'
import { ArrowLeft, FileText, Loader2, Play, Save } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { WorkflowErrorBoundary } from '@/components/error'
import { useToast } from '@/components/toast/ToastContainer'
import NodeConfigDrawer from '@/components/workflow/drawers/NodeConfigDrawer'
import NodeLibraryDrawer from '@/components/workflow/drawers/NodeLibraryDrawer'
import TriggerTypeDrawer from '@/components/workflow/drawers/TriggerTypeDrawer'
import WorkflowDrawer from '@/components/workflow/drawers/WorkflowDrawer'
import CustomEdge from '@/components/workflow/edges/CustomEdge'
import DefaultNode from '@/components/workflow/nodes/DefaultNode'
import SwitchNode from '@/components/workflow/nodes/SwitchNode'
import TriggerNode from '@/components/workflow/nodes/TriggerNode'
import ExecutionLogPanel from '@/components/workflow/panels/ExecutionLogPanel'
import { useWorkflowExecution } from '@/hooks/useWorkflowExecution'
import { Link, useRouter } from '@/i18n/routing'
import { workflowStorage } from '@/lib/workflowStorage'
import type { UserWorkflow } from '@/types/workflow'

export default function WorkflowEditor() {
  const params = useParams()
  const router = useRouter()
  const toast = useToast()
  const t = useTranslations('aigc')
  const tToast = useTranslations('toast')
  const workflowId = params.workflowId as string
  const isNew = workflowId === 'new'

  const [workflow, setWorkflow] = useState<UserWorkflow | null>(null)
  const [name, setName] = useState(t('untitledWorkflow'))
  const [description, setDescription] = useState('')
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: 'trigger-1',
      position: { x: 100, y: 150 },
      data: { label: t('defaultTriggerLabel') },
      type: 'trigger',
    },
  ])
  const [edges, setEdges] = useState<Edge[]>([])
  const [showNameDialog, setShowNameDialog] = useState(false)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [showNodeLibrary, setShowNodeLibrary] = useState(false)
  const [sourceNodeId, setSourceNodeId] = useState<string | null>(null)
  const [sourceHandleId, setSourceHandleId] = useState<string | null>(null)
  const [showTriggerTypeDrawer, setShowTriggerTypeDrawer] = useState(false)
  const { isRunning, runWorkflow, executionLogs, showLogPanel, setShowLogPanel } =
    useWorkflowExecution(nodes, edges, setNodes, setEdges)

  // 加载工作流
  useEffect(() => {
    if (!isNew) {
      const loaded = workflowStorage.getById(workflowId)
      if (loaded) {
        setWorkflow(loaded)
        setName(loaded.name)
        setDescription(loaded.description)
        setNodes(
          loaded.nodes || [
            {
              id: 'trigger-1',
              position: { x: 100, y: 150 },
              data: { label: t('defaultTriggerLabel') },
              type: 'trigger',
            },
          ]
        )
        setEdges(loaded.edges || [])
      } else {
        router.push('/aigc')
      }
    }
    // 新建模式：不自动打开抽屉，等待用户点击按钮
  }, [workflowId, isNew, router, t])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  )

  const onConnect = useCallback(
    (params: Connection) => {
      // 检查目标节点是否已经有输入连接
      const hasInput = edges.some((edge) => edge.target === params.target)
      if (hasInput) {
        toast.error(tToast('singleInputLimit'))
        return
      }

      // 检查源节点（普通节点）是否已经有输出连接
      const sourceNode = nodes.find((n) => n.id === params.source)
      if (sourceNode?.type === 'default') {
        // 如果开启了异常处理，检查特定 Handle 是否已有连接
        if (sourceNode.data.enableErrorHandling) {
          const hasHandleOutput = edges.some(
            (edge) => edge.source === params.source && edge.sourceHandle === params.sourceHandle
          )
          if (hasHandleOutput) {
            toast.error(tToast('singleOutputLimit'))
            return
          }
        } else {
          // 未开启异常处理，检查 source-default Handle 是否已有连接
          const hasOutput = edges.some(
            (edge) =>
              edge.source === params.source &&
              (edge.sourceHandle === 'source-default' || !edge.sourceHandle)
          )
          if (hasOutput) {
            toast.error(tToast('singleOutputLimit'))
            return
          }
        }
      }

      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot))
    },
    [edges, nodes, toast, tToast]
  )

  // 节点点击事件
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    // 如果是触发器节点,打开触发类型选择抽屉
    if (node.type === 'trigger') {
      setSelectedNode(node)
      setShowTriggerTypeDrawer(true)
    } else {
      setSelectedNode(node)
      setShowNameDialog(true)
    }
  }, [])

  // 保存节点配置
  const handleNodeSave = (nodeData: {
    label: string
    description: string
    enableErrorHandling?: boolean
  }) => {
    if (!selectedNode) return

    const wasErrorHandlingEnabled = selectedNode.data?.enableErrorHandling
    const isErrorHandlingEnabled = nodeData.enableErrorHandling

    // 更新节点数据
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id ? { ...node, data: { ...node.data, ...nodeData } } : node
      )
    )

    // 如果异常处理状态发生变化，更新相关边的 sourceHandle
    if (wasErrorHandlingEnabled !== isErrorHandlingEnabled) {
      setEdges((eds) =>
        eds
          .map((edge) => {
            if (edge.source !== selectedNode.id) return edge

            if (isErrorHandlingEnabled) {
              // 开启异常处理：将默认 Handle 的边迁移到 source-success
              if (!edge.sourceHandle || edge.sourceHandle === 'source-default') {
                return { ...edge, sourceHandle: 'source-success' }
              }
            } else {
              // 关闭异常处理：将 source-success 的边迁移回默认 Handle
              if (edge.sourceHandle === 'source-success') {
                return { ...edge, sourceHandle: 'source-default' }
              }
              // 删除 source-failure 的边（因为关闭异常处理后不再有失败分支）
              if (edge.sourceHandle === 'source-failure') {
                return null
              }
            }
            return edge
          })
          .filter((edge): edge is Edge => edge !== null)
      )
    }

    setSelectedNode(null)
  }

  // 保存触发类型
  const handleTriggerTypeSave = useCallback(
    (triggerType: { id: string; name: string; icon: any }) => {
      if (!selectedNode) return
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? {
                ...node,
                data: {
                  ...node.data,
                  label: triggerType.name,
                  triggerType: triggerType.id,
                },
              }
            : node
        )
      )
      setSelectedNode(null)
      toast.success(tToast('triggerTypeSet', { name: triggerType.name }))
    },
    [selectedNode, toast, tToast]
  )

  // 删除边
  const handleEdgeDelete = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId))
      toast.success(tToast('connectionDeleted'))
    },
    [toast, tToast]
  )

  // 打开节点库（记录来源节点）
  const handleNodeLibraryOpen = useCallback(
    (nodeId: string, handleId?: string) => {
      // 检查源节点是否已经有输出连接
      const sourceNode = nodes.find((n) => n.id === nodeId)

      // 如果指定了 handleId (适用于 SwitchNode 和开启异常处理的 DefaultNode)
      if (handleId) {
        const hasHandleOutput = edges.some(
          (edge) => edge.source === nodeId && edge.sourceHandle === handleId
        )
        if (hasHandleOutput) {
          toast.error(tToast('singleOutputLimit'))
          return
        }
      }
      // 如果没有指定 handleId，且是普通节点（未开启异常处理的情况）
      else if (sourceNode?.type === 'default' && !sourceNode.data.enableErrorHandling) {
        // 检查 source-default Handle 是否已有连接
        const hasOutput = edges.some(
          (edge) =>
            edge.source === nodeId && (edge.sourceHandle === 'source-default' || !edge.sourceHandle)
        )
        if (hasOutput) {
          toast.error(tToast('singleOutputLimit'))
          return
        }
      }

      setSourceNodeId(nodeId)
      setSourceHandleId(handleId || null)
      setShowNodeLibrary(true)
    },
    [nodes, edges, toast, tToast]
  )

  // 添加新节点
  const handleAddNode = useCallback(
    (nodeType: any) => {
      const newNodeId = `node-${Date.now()}`
      const newNode: Node = {
        id: newNodeId,
        position: { x: 400, y: 150 },
        data: {
          label: nodeType.name,
          description: nodeType.description,
          nodeType: nodeType.id,
        },
        type: nodeType.id === 'switch' ? 'switch' : 'default',
      }
      setNodes((nds) => [...nds, newNode])

      // 如果有源节点，自动创建连接
      if (sourceNodeId) {
        // 确定 sourceHandle：
        // - 如果已指定 handleId，使用它
        // - 如果源节点是 default 类型且未开启异常处理，使用 source-default
        // - 否则保持为 null（trigger 节点等）
        const sourceNode = nodes.find((n) => n.id === sourceNodeId)
        let finalSourceHandle = sourceHandleId
        if (
          !sourceHandleId &&
          sourceNode?.type === 'default' &&
          !sourceNode.data.enableErrorHandling
        ) {
          finalSourceHandle = 'source-default'
        }

        const newEdge: Edge = {
          id: `edge-${sourceNodeId}-${newNodeId}`,
          source: sourceNodeId,
          target: newNodeId,
          sourceHandle: finalSourceHandle,
        }
        setEdges((eds) => [...eds, newEdge])
      }

      toast.success(tToast('nodeAdded', { name: nodeType.name }))
      setSourceNodeId(null) // 重置源节点
      setSourceHandleId(null)
    },
    [toast, sourceNodeId, sourceHandleId, nodes, tToast]
  )

  // 删除节点
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId))
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
      toast.success(tToast('nodeDeleted'))
    },
    [toast, tToast]
  )

  // 自定义节点类型
  const nodeTypes = useMemo(
    () => ({
      trigger: (props: any) => {
        // 检查该触发器节点是否已连接子节点
        const hasConnectedNode = edges.some((edge) => edge.source === props.id)
        return (
          <TriggerNode
            {...props}
            data={{
              ...props.data,
              hasConnectedNode,
              onAddNode: () => handleNodeLibraryOpen(props.id),
              defaultLabel: t('defaultTriggerLabel'),
              addNodeTooltip: t('addNextNode'),
            }}
          />
        )
      },
      default: (props: any) => (
        <DefaultNode
          {...props}
          data={{
            ...props.data,
            onAddNode: (handleId?: string) => handleNodeLibraryOpen(props.id, handleId),
            onDelete: () => handleDeleteNode(props.id),
            addNodeTooltip: t('addNextNode'),
            deleteNodeTooltip: t('deleteNode'),
          }}
        />
      ),
      switch: (props: any) => (
        <SwitchNode
          {...props}
          data={{
            ...props.data,
            onDelete: () => handleDeleteNode(props.id),
            onAddNode: (handleId?: string) => handleNodeLibraryOpen(props.id, handleId),
            deleteNodeTooltip: t('deleteNode'),
            addNodeTooltip: t('addNextNode'),
          }}
        />
      ),
    }),
    [handleNodeLibraryOpen, handleDeleteNode, edges, t]
  )

  // 自定义边类型
  const edgeTypes = useMemo(
    () => ({
      default: (props: any) => <CustomEdge {...props} data={{ onDelete: handleEdgeDelete }} />,
    }),
    [handleEdgeDelete]
  )

  // 保存工作流
  const handleSave = () => {
    const id = isNew ? `workflow-${Date.now()}` : workflowId
    const now = Date.now()

    const workflowData: UserWorkflow = {
      id,
      name,
      description,
      nodes,
      edges,
      createdAt: workflow?.createdAt || now,
      updatedAt: now,
    }

    try {
      workflowStorage.save(workflowData)

      if (isNew) {
        toast.success(tToast('workflowCreateSuccess'))
        router.push(`/aigc/${id}`)
      } else {
        toast.success(tToast('workflowSaveSuccess'))
      }
    } catch (error) {
      toast.error(tToast('saveFailed'))
      console.error('保存工作流失败:', error)
    }
  }

  return (
    <>
      <WorkflowErrorBoundary
        fallbackTitle={t('workflowEditorError')}
        fallbackMessage={t('workflowEditorErrorMessage')}
        fallbackRetry={t('reloadEditor')}
        onError={(error, errorInfo) => {
          console.error('❌ [WorkflowEditor] ReactFlow 错误:', error)
          console.error('📍 [WorkflowEditor] 错误信息:', errorInfo)
        }}
      >
        <ReactFlow
          colorMode="light"
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} />
          <Controls />
          <MiniMap />

          {/* 顶部工具栏 */}
          <Panel position="top-left">
            <div className="flex items-center gap-2 rounded-xl border border-[var(--jp-mist)]/50 bg-[var(--jp-cream)]/95 p-2 shadow-lg backdrop-blur-sm">
              <Link
                href="/aigc"
                className="flex h-9 w-9 items-center justify-center rounded-lg transition-all hover:bg-[var(--jp-paper)]"
                title={t('backToList')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              {!isNew && (
                <>
                  <div className="h-6 w-px bg-[var(--jp-mist)]/50" />
                  <div className="flex flex-col justify-center py-1 pr-3 pl-1">
                    <h1 className="line-clamp-1 font-semibold text-[var(--jp-ink)] text-sm leading-tight">
                      {name}
                    </h1>
                    <p className="line-clamp-1 text-[var(--jp-ink)]/60 text-xs leading-tight">
                      {description || t('noDescription')}
                    </p>
                  </div>
                </>
              )}
            </div>
          </Panel>

          <Panel position="top-right">
            <div className="flex items-center gap-2 rounded-xl border border-[var(--jp-mist)]/50 bg-[var(--jp-cream)]/95 p-2 shadow-lg backdrop-blur-sm">
              {!isNew && (
                <>
                  <button
                    onClick={() => setShowNameDialog(true)}
                    className="flex h-9 items-center gap-2 rounded-lg px-3 transition-all hover:bg-[var(--jp-paper)]"
                    title={t('editWorkflowInfo')}
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{t('edit')}</span>
                  </button>
                  <div className="h-6 w-px bg-[var(--jp-mist)]/50" />
                </>
              )}
              <button
                onClick={handleSave}
                className="flex h-9 items-center gap-2 rounded-lg bg-[var(--jp-vermilion)] px-3 text-[var(--jp-vermilion)]-content transition-all hover:bg-[var(--jp-vermilion)]/90"
                title={t('saveWorkflow')}
              >
                <Save className="h-4 w-4" />
                <span className="text-sm">{t('save')}</span>
              </button>
            </div>
          </Panel>

          {/* 底部运行按钮 */}
          <Panel position="bottom-center">
            <button
              disabled={isRunning}
              onClick={runWorkflow}
              className={`flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium text-[var(--jp-vermilion)]-content transition-colors ${
                isRunning
                  ? 'cursor-not-allowed bg-[var(--jp-vermilion)]/70'
                  : 'bg-[var(--jp-vermilion)] hover:bg-[var(--jp-vermilion)]/90'
              }`}
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>{t('running')}</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current" />
                  <span>{t('runWorkflow')}</span>
                </>
              )}
            </button>
          </Panel>
        </ReactFlow>
      </WorkflowErrorBoundary>

      {/* 节点配置抽屉 */}
      <NodeConfigDrawer
        isOpen={showNameDialog && selectedNode !== null}
        node={selectedNode}
        onClose={() => {
          setShowNameDialog(false)
          setSelectedNode(null)
        }}
        onSave={handleNodeSave}
      />

      {/* 工作流信息编辑抽屉（仅编辑模式，点击编辑按钮时） */}
      {!isNew && (
        <WorkflowDrawer
          isOpen={showNameDialog && selectedNode === null}
          isNew={false}
          name={name}
          description={description}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          onConfirm={() => setShowNameDialog(false)}
          onCancel={() => setShowNameDialog(false)}
        />
      )}

      {/* 节点库抽屉 */}
      <NodeLibraryDrawer
        isOpen={showNodeLibrary}
        onClose={() => setShowNodeLibrary(false)}
        onSelectNode={handleAddNode}
      />

      {/* 触发类型选择抽屉 */}
      <TriggerTypeDrawer
        isOpen={showTriggerTypeDrawer}
        onClose={() => {
          setShowTriggerTypeDrawer(false)
          setSelectedNode(null)
        }}
        onSelectType={handleTriggerTypeSave}
      />

      {/* 执行日志面板 */}
      <ExecutionLogPanel
        isOpen={showLogPanel}
        onClose={() => setShowLogPanel(false)}
        logs={executionLogs}
        isRunning={isRunning}
      />
    </>
  )
}

import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import KanbanColumn from '../components/KanbanColumn'
import TaskModal from '../components/TaskModal'
import { projectsService } from '../services/projects'
import { tasksService } from '../services/tasks'

const STATUSES = ['Todo', 'InProgress', 'Done']
const STATUS_MAP = { Todo: 0, InProgress: 1, Done: 2 }

export default function ProjectView() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, mode: 'create', task: null })

  // ── Fetch project + tasks ─────────────────────────────────────────
  const fetchData = useCallback(async () => {
    try {
      const [proj, taskList] = await Promise.all([
        projectsService.getById(id),
        tasksService.getByProject(id),
      ])
      setProject(proj)
      setTasks(taskList)
    } catch {
      toast.error('Failed to load project')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => { fetchData() }, [fetchData])

  // ── Group tasks by status ─────────────────────────────────────────
  const getTasksByStatus = (status) =>
    tasks.filter((t) => t.status === status)

  // ── Drag and Drop ─────────────────────────────────────────────────
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const taskId = parseInt(draggableId)
    const newStatus = destination.droppableId

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t)
    )

    try {
      await tasksService.updateStatus(taskId, STATUS_MAP[newStatus])
    } catch {
      toast.error('Failed to update task status')
      fetchData() // revert on error
    }
  }

  // ── Create Task ───────────────────────────────────────────────────
  const handleCreateTask = async (form) => {
    try {
      const task = await tasksService.create({
        title: form.title,
        description: form.description,
        projectId: parseInt(id),
      })
      setTasks((prev) => [...prev, task])
      toast.success('Task created!')
    } catch {
      toast.error('Failed to create task')
    }
  }

  // ── Edit Task ─────────────────────────────────────────────────────
  const handleEditTask = async (form) => {
    try {
      await tasksService.update(modal.task.id, form)
      setTasks((prev) =>
        prev.map((t) => t.id === modal.task.id ? { ...t, ...form } : t)
      )
      toast.success('Task updated!')
    } catch {
      toast.error('Failed to update task')
    }
  }

  // ── Delete Task ───────────────────────────────────────────────────
  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return
    try {
      await tasksService.delete(taskId)
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      toast.success('Task deleted')
    } catch {
      toast.error('Failed to delete task')
    }
  }

  // ── Stats ─────────────────────────────────────────────────────────
  const stats = {
    total: tasks.length,
    todo: getTasksByStatus('Todo').length,
    inProgress: getTasksByStatus('InProgress').length,
    done: getTasksByStatus('Done').length,
    progress: tasks.length > 0 ? Math.round((getTasksByStatus('Done').length / tasks.length) * 100) : 0,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-0 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-0">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-xs font-mono text-slate-600 hover:text-slate-400 transition-colors mb-2 flex items-center gap-1"
            >
              ← back to dashboard
            </button>
            <h1 className="font-display font-bold text-2xl text-slate-100">{project?.name}</h1>
            {project?.description && (
              <p className="text-sm text-slate-500 mt-1 font-body">{project.description}</p>
            )}
          </div>

          <button
            onClick={() => setModal({ open: true, mode: 'create', task: null })}
            className="btn-primary"
          >
            + New Task
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'text-slate-300' },
            { label: 'To Do', value: stats.todo, color: 'text-slate-400' },
            { label: 'In Progress', value: stats.inProgress, color: 'text-accent-blue' },
            { label: 'Done', value: stats.done, color: 'text-accent-green' },
          ].map((s) => (
            <div key={s.label} className="card p-4">
              <p className="text-xs font-mono text-slate-600 mb-1">{s.label}</p>
              <p className={`font-display font-bold text-2xl ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        {tasks.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-slate-600">Overall Progress</span>
              <span className="text-xs font-mono text-accent-green">{stats.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-green rounded-full transition-all duration-500"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Kanban Board */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={getTasksByStatus(status)}
                onDelete={handleDeleteTask}
                onEdit={(task) => setModal({ open: true, mode: 'edit', task })}
                onAddTask={() => setModal({ open: true, mode: 'create', task: null })}
              />
            ))}
          </div>
        </DragDropContext>

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl mt-4">
            <p className="text-3xl mb-3">📋</p>
            <p className="font-display font-semibold text-slate-400">No tasks yet</p>
            <p className="text-sm text-slate-600 mt-1 font-body">Add your first task to get started</p>
            <button
              onClick={() => setModal({ open: true, mode: 'create', task: null })}
              className="btn-primary mt-5"
            >
              + Add First Task
            </button>
          </div>
        )}
      </main>

      {/* Task Modal */}
      {modal.open && (
        <TaskModal
          mode={modal.mode}
          task={modal.task}
          projectId={parseInt(id)}
          onSubmit={modal.mode === 'create' ? handleCreateTask : handleEditTask}
          onClose={() => setModal({ open: false, mode: 'create', task: null })}
        />
      )}
    </div>
  )
}

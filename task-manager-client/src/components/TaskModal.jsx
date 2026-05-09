import { useState, useEffect } from 'react'

export default function TaskModal({ mode, task, projectId, onSubmit, onClose }) {
  const [form, setForm] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && task) {
      setForm({ title: task.title, description: task.description || '' })
    }
  }, [mode, task])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setLoading(true)
    try {
      await onSubmit(form)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-full max-w-md p-6 shadow-2xl animate-fade-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-base text-slate-100">
            {mode === 'create' ? 'New Task' : 'Edit Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-600 hover:text-slate-300 font-mono text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1.5 uppercase tracking-wider">
              Title *
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Build login page"
              className="input-field"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-500 mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Optional details..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.title.trim()}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && (
                <span className="w-3.5 h-3.5 border-2 border-surface-0/30 border-t-surface-0 rounded-full animate-spin" />
              )}
              {mode === 'create' ? 'Create Task' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

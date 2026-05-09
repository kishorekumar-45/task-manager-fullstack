import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import { projectsService } from '../services/projects'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', deadline: '' })
  const [creating, setCreating] = useState(false)
  const { user } = useSelector((s) => s.auth)
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const data = await projectsService.getAll()
      setProjects(data)
    } catch {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Project name is required')
    setCreating(true)
    try {
      const project = await projectsService.create({
        name: form.name,
        description: form.description,
        deadline: form.deadline || null,
      })
      setProjects((p) => [...p, project])
      setShowModal(false)
      setForm({ name: '', description: '', deadline: '' })
      toast.success('Project created!')
    } catch {
      toast.error('Failed to create project')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Delete this project and all its tasks?')) return
    try {
      await projectsService.delete(id)
      setProjects((p) => p.filter((x) => x.id !== id))
      toast.success('Project deleted')
    } catch {
      toast.error('Failed to delete project')
    }
  }

  const statusColors = ['bg-accent-blue/10 text-accent-blue', 'bg-accent-green/10 text-accent-green', 'bg-accent-amber/10 text-accent-amber']

  return (
    <div className="min-h-screen bg-surface-0">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-mono text-slate-500 mb-1">
              // {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 className="font-display font-bold text-2xl text-slate-100">
              Hey, {user?.username} 👋
            </h1>
            <p className="text-sm text-slate-500 mt-0.5 font-body">
              {projects.length} project{projects.length !== 1 ? 's' : ''} in your workspace
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + New Project
          </button>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-accent-blue/20 border-t-accent-blue rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border rounded-2xl">
            <p className="text-3xl mb-3">📋</p>
            <p className="font-display font-semibold text-slate-400">No projects yet</p>
            <p className="text-sm text-slate-600 mt-1 font-body">Create your first project to get started</p>
            <button onClick={() => setShowModal(true)} className="btn-primary mt-5">
              + Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, i) => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="card p-5 cursor-pointer hover:border-slate-600 hover:bg-surface-2 transition-all duration-200 group animate-fade-up"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`text-xs font-mono px-2 py-0.5 rounded-md ${statusColors[i % 3]}`}>
                    active
                  </div>
                  <button
                    onClick={(e) => handleDelete(project.id, e)}
                    className="text-slate-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 text-xs font-mono"
                  >
                    delete
                  </button>
                </div>

                <h2 className="font-display font-bold text-base text-slate-200 mb-1 leading-snug">
                  {project.name}
                </h2>
                <p className="text-xs text-slate-500 font-body line-clamp-2 mb-4">
                  {project.description || 'No description'}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-xs font-mono text-slate-600">
                    {project.taskCount} task{project.taskCount !== 1 ? 's' : ''}
                  </span>
                  {project.deadline && (
                    <span className="text-xs font-mono text-slate-600">
                      Due {new Date(project.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="card w-full max-w-md p-6 shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-base text-slate-100">New Project</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-600 hover:text-slate-300 font-mono text-lg leading-none">×</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1.5 uppercase tracking-wider">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Task Manager App"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="What's this project about?"
                  rows={3}
                  className="input-field resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-500 mb-1.5 uppercase tracking-wider">Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
                <button type="submit" disabled={creating} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {creating ? <span className="w-3.5 h-3.5 border-2 border-surface-0/30 border-t-surface-0 rounded-full animate-spin" /> : null}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

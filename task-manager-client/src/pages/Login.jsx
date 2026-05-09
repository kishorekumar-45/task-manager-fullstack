import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { authService } from '../services/auth'
import { loginSuccess } from '../store/authSlice'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('All fields are required')
      return
    }
    setLoading(true)
    try {
      const data = await authService.login(form.email, form.password)
      authService.saveSession(data)
      dispatch(loginSuccess({ id: data.userId, username: data.username, email: data.email }))
      toast.success(`Welcome back, ${data.username}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#00d4ff 1px, transparent 1px), linear-gradient(90deg, #00d4ff 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-sm animate-fade-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-blue/10 border border-accent-blue/20 mb-4">
            <span className="text-accent-blue font-mono font-bold text-lg">TF</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-100 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 font-body">Sign in to your workspace</p>
        </div>

        {/* Card */}
        <div className="card p-6 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-surface-0/30 border-t-surface-0 rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-600 mt-5 font-body">
          No account?{' '}
          <Link to="/register" className="text-accent-blue hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

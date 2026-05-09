import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { authService } from '../services/auth'
import { loginSuccess } from '../store/authSlice'

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.email || !form.password) {
      toast.error('All fields are required')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const data = await authService.register(form.username, form.email, form.password)
      authService.saveSession(data)
      dispatch(loginSuccess({ id: data.userId, username: data.username, email: data.email }))
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center px-4">
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#7c3aed 1px, transparent 1px), linear-gradient(90deg, #7c3aed 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="w-full max-w-sm animate-fade-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-purple/10 border border-accent-purple/20 mb-4">
            <span className="text-accent-purple font-mono font-bold text-lg">TF</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-100 mb-1">Create account</h1>
          <p className="text-sm text-slate-500 font-body">Start managing your projects</p>
        </div>

        <div className="card p-6 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-500 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="kishore"
                className="input-field"
              />
            </div>

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
                placeholder="Min. 6 characters"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-accent-purple text-white font-display font-semibold px-5 py-2.5 rounded-lg hover:brightness-110 active:scale-95 transition-all duration-150 text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-600 mt-5 font-body">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

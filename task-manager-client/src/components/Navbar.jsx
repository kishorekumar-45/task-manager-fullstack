import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { logout } from '../store/authSlice'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="border-b border-border bg-surface-1/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent-blue/10 border border-accent-blue/30 flex items-center justify-center">
            <span className="text-accent-blue text-xs font-mono font-bold">TF</span>
          </div>
          <span className="font-display font-bold text-sm tracking-wide text-slate-200">
            TaskFlow
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-slate-500 hidden sm:block">
            {user?.email}
          </span>
          <div className="w-7 h-7 rounded-full bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center">
            <span className="text-accent-purple text-xs font-bold font-display">
              {user?.username?.[0]?.toUpperCase()}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors"
          >
            logout
          </button>
        </div>
      </div>
    </nav>
  )
}

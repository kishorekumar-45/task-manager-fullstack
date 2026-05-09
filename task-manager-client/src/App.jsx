import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProjectView from './pages/ProjectView'

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f0f1a',
              color: '#e8e8f0',
              border: '1px solid #1e1e35',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#0f0f1a' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#0f0f1a' } },
          }}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />
          <Route
            path="/project/:id"
            element={<PrivateRoute><ProjectView /></PrivateRoute>}
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}
import api from './api'

export const authService = {
  async register(username, email, password) {
    const res = await api.post('/auth/register', { username, email, password })
    return res.data
  },

  async login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    return res.data
  },

  saveSession(data) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({
      id: data.userId,
      username: data.username,
      email: data.email,
    }))
  },

  clearSession() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  isAuthenticated() {
    return !!localStorage.getItem('token')
  },
}

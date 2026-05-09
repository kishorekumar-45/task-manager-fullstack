import { createSlice } from '@reduxjs/toolkit'
import { authService } from '../services/auth'

const user = authService.getUser()

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    isAuthenticated: authService.isAuthenticated(),
  },
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      authService.clearSession()
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer

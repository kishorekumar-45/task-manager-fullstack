import api from './api'

export const tasksService = {
  async getByProject(projectId) {
    const res = await api.get(`/tasks/${projectId}`)
    return res.data
  },

  async create(data) {
    const res = await api.post('/tasks', data)
    return res.data
  },

  async update(id, data) {
    await api.put(`/tasks/${id}`, data)
  },

  async updateStatus(id, status) {
    // status: 0=Todo, 1=InProgress, 2=Done
    const res = await api.patch(`/tasks/${id}/status`, { status })
    return res.data
  },

  async delete(id) {
    await api.delete(`/tasks/${id}`)
  },
}

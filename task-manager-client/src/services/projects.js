import api from './api'

export const projectsService = {
  async getAll() {
    const res = await api.get('/projects')
    return res.data
  },

  async getById(id) {
    const res = await api.get(`/projects/${id}`)
    return res.data
  },

  async create(data) {
    const res = await api.post('/projects', data)
    return res.data
  },

  async update(id, data) {
    await api.put(`/projects/${id}`, data)
  },

  async delete(id) {
    await api.delete(`/projects/${id}`)
  },
}

import { apiClient } from './apiClient'

export const getMenuItems = async (params = {}) => {
  return apiClient.get('/menu-items', { params })
}



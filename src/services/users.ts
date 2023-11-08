import { toast } from "react-toastify"
import api from "./api"


const getUsers = async () => {
  try {
    const response = await api.get('/users')
    return response.data
  } catch (error) {
    toast.error('Erro ao buscar usuários')
  }
}

const getUser = async (id: string) => {
  try {
    const response = await api.get(`/users/${id}`)
    return response.data
  } catch (error) {
    toast.error('Erro ao buscar usuário')
  }
}

const createUser = async (data: object) => {
  try {
    const response = await api.post('/users', data)
    return response.data
  } catch (error) {
    toast.error('Erro ao criar usuário')
  }
}

const updateUser = async (id: string, data: object) => {
  try {
    const response = await api.put(`/users/${id}`, data)
    return response.data
  } catch (error) {
    toast.error('Erro ao atualizar usuário')
  }
}

const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(`/users/${id}`)
    return response.data
  } catch (error) {
    toast.error('Erro ao deletar usuário')
  }
}

export { createUser, deleteUser, getUser, getUsers, updateUser }


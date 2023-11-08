import { toast } from "react-toastify"
import api from "./api"


const getCarts = async () => {
  try {
    const response = await api.get('/carts')
    return response.data
  } catch (error) {
    toast.error('Erro ao buscar carrinhos')
  }
}

const getCart = async (id: string) => {
  try {
    const response = await api.get(`/carts/${id}`)
    return response.data
  } catch (error) {
    toast.error('Erro ao buscar carrinho')
  }
}

const createCart = async (data: object) => {
  try {
    const response = await api.post('/carts', data)
    return response.data
  } catch (error) {
    toast.error('Erro ao criar carrinho')
  }
}

const updateCart = async (id: string, data: object) => {
  try {
    const response = await api.put(`/carts/${id}`, data)
    return response.data
  } catch (error) {
    toast.error('Erro ao atualizar carrinho')
  }
}


export { createCart, getCart, getCarts, updateCart }


import { toast } from "react-toastify"
import api from "./api"


const getProducts = async () => {
  try {
    const response = await api.get('/products')
    return response.data
  } catch (error) {
    toast.error('Erro ao buscar produtos')
  }
}

const getProduct = async (id: string) => {
  try {
    const response = await api.get(`/products/${id}`)
    return response.data
  } catch (error) {
    toast.error('Erro ao buscar produto')
  }
}

const createProduct = async (data: object) => {
  try {
    const response = await api.post('/products', data)
    return response.data
  } catch (error) {
    toast.error('Erro ao criar produto')
  }
}

const updateProduct = async (id: string, data: object) => {
  try {
    const response = await api.put(`/products/${id}`, data)
    return response.data
  } catch (error) {
    toast.error('Erro ao atualizar produto')
  }
}

const deleteProduct = async (id: string | number) => {
  try {
    const response = await api.delete(`/products/${id}`)
    return response.data
  } catch (error) {
    toast.error('Erro ao deletar produto')
  }
}

export { createProduct, deleteProduct, getProduct, getProducts, updateProduct }


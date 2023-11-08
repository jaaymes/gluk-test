import { useContext } from 'react'

import { CartContext, CartContextData } from '@/context/cartContext'

export const useCart = (): CartContextData => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('The hook useCart must be used within an cartProvider')
  }

  return context
}
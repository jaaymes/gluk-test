import { useContext } from 'react'

import { ProductContext, ProductContextData } from '@/context/productContext'

export const useProduct = (): ProductContextData => {
  const context = useContext(ProductContext)

  if (!context) {
    throw new Error('The hook useProduct must be used within an productProvider')
  }

  return context
}
import { IProduct } from '@/interfaces/product'
import { getProduct, getProducts } from '@/services/products'
import { createContext, useCallback, useMemo, useState } from 'react'

export interface ProductContextData {
  products: IProduct[]
  handleLoadProducts: () => Promise<void>
  handleLoadProduct: (id: string) => Promise<IProduct>
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

export const ProductContext = createContext<ProductContextData>({} as ProductContextData)

export const ProductProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [products, setProducts] = useState<IProduct[]>([])
  const [search, setSearch] = useState('')

  const handleLoadProducts = useCallback(async () => {
    const products = await getProducts()
    setProducts(products)
  }, [])

  const handleLoadProduct = useCallback(async (id: string) => {
    const product = await getProduct(id)
    return product
  }, [])

  const context = useMemo(() => {
    return {
      products,
      handleLoadProducts,
      search,
      setSearch,
      handleLoadProduct
    }
  }, [handleLoadProduct, handleLoadProducts, products, search])

  return <ProductContext.Provider value={context}>{children}</ProductContext.Provider>
}
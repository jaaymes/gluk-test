import { ICart } from '@/interfaces/cart'
import { getCart, getCarts } from '@/services/carts'
import { createContext, useCallback, useMemo, useState } from 'react'

export interface CartContextData {
  carts: ICart[]
  handleLoadCarts: () => Promise<void>
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  handleLoadCart: (id: string) => Promise<ICart>
}

export const CartContext = createContext<CartContextData>({} as CartContextData)

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [carts, setCarts] = useState<ICart[]>([])
  const [search, setSearch] = useState('')

  const handleLoadCarts = useCallback(async () => {
    const carts = await getCarts()
    console.log(carts)
    setCarts(carts)
  }, [])

  const handleLoadCart = useCallback(async (id: string) => {
    const cart = await getCart(id)
    return cart
  }, [])

  const context = useMemo(() => {
    return {
      carts,
      handleLoadCarts,
      search,
      setSearch,
      handleLoadCart
    }
  }, [carts, handleLoadCarts, search, handleLoadCart])

  return <CartContext.Provider value={context}>{children}</CartContext.Provider>
}
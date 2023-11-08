
interface IProdutsCart {
  discountPercentage: number
  discountedPrice: number
  id: number
  price: number
  quantity: number
  thumbnail: string
  title: string
  total: number
}

interface ICart {
  id: number
  products: IProdutsCart[]
  total: number
  discountedTotal: number
  userId: number
  totalProducts: number
  status: "pending" | "completed" | "cancelled"
}

export type { ICart }

interface IUser {
  id: number
  name: string
  age: number
  gender: string
  email: string
  phone: string
  birthDate: string
  image: string
  address: {
    streetName: string
    number: number
    city: string
    zipcode: string
    district: string
    state: string,
    complement: string
  }
}

export type { IUser }


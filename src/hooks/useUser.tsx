import { useContext } from 'react'

import { UserContext, UserContextData } from '@/context/userContext'

export const useUser = (): UserContextData => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('The hook useUser must be used within an UserProvider')
  }

  return context
}
import { IUser } from '@/interfaces/user'
import { getUser, getUsers } from '@/services/users'
import { createContext, useCallback, useMemo, useState } from 'react'

export interface UserContextData {
  users: IUser[]
  handleLoadUsers: () => Promise<void>
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  handleLoadUser: (id: string) => Promise<IUser>
}

export const UserContext = createContext<UserContextData>({} as UserContextData)

export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [users, setUsers] = useState<IUser[]>([])
  const [search, setSearch] = useState('')

  const handleLoadUsers = useCallback(async () => {
    const users = await getUsers()
    setUsers(users)
  }, [])

  const handleLoadUser = useCallback(async (id: string) => {
    const user = await getUser(id)
    return user
  }, [])


  const context = useMemo(() => {
    return {
      users,
      handleLoadUsers,
      search,
      setSearch,
      handleLoadUser
    }
  }, [handleLoadUser, handleLoadUsers, search, users])

  return <UserContext.Provider value={context}>{children}</UserContext.Provider>
}
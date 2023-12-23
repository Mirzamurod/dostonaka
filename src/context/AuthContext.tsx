// React Imports
import { FC, ReactNode, createContext, useEffect, useState } from 'react'

// Next Import
import { useRouter } from 'next/router'
import { UserDataType } from '@/types/user'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { AppDistach, RootState } from '@/store'
import { getUserData } from '@/store/user/login'

interface IAuthValuesType {
  loading: boolean
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType) => void
}

const defaultProvider: IAuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider: FC<Props> = ({ children }) => {
  // Dispatch
  const dispatch = useDispatch<AppDistach>()

  // Selector
  const { token } = useSelector((state: RootState) => state.login)

  // States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      let tokenLocal = window.localStorage.getItem('dostonaka')!
      if (token || tokenLocal) {
        setLoading(true)
        await axios({
          url: '/api/profile',
          headers: { Authorization: 'Bearer ' + tokenLocal },
        })
          .then(res => {
            setLoading(false)
            dispatch(getUserData(res.data))
            if (router.pathname === '/login') router.replace('/')
          })
          .catch(() => {
            localStorage.removeItem('dostonaka')
            setLoading(false)
            if (!router.pathname.includes('login')) router.replace('/login')
          })
      } else {
        setLoading(false)
      }
    }

    initAuth()
  }, [token])

  const values = { user, loading, setUser, setLoading }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }

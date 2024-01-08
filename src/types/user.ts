export type UserDataType = {
  username: string
  email: string
  price: number
  phone: string
  isAdmin?: boolean
  createdAt: string
  updatedAt: string
  _id: string
}

export interface IUserStore {
  isLoading: boolean
  success: boolean
  user: UserDataType | null
  isError: boolean
  err_msg: string
  dark_mode: boolean
  token: boolean
}

export interface IRegister {
  isLoading: boolean
  isError: boolean
  code: string | number
  err_msg: string
}

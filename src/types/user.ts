export type UserDataType = {
  username: string
  name: string
  email: string
  isAdmin?: boolean
  createdAt: string
  updatedAt: string
  _id: string
}

export interface IUserStore {
  isLoading: boolean
  user: UserDataType | null
  isError: boolean
  code: string | boolean
  err_msg: string
  dark_mode: boolean
  deleteCode: string | boolean
  token: boolean
}

export interface IRegister {
  isLoading: boolean
  isError: boolean
  code: string | number
  err_msg: string
}
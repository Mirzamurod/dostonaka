export type ClientDataType = {
  name: string
  price: number | string
  show: boolean
  createdAt: string
  updatedAt: string
  _id: string
}

export interface IClientStore {
  isLoading: boolean
  client: ClientDataType | null
  clients: TClients[] | null
  count: number
  success: boolean
  isError: boolean
  err_msg: null | { msg: string; param: string }[]
}

export type TClients = {
  createdAt: string
  name: string
  price: string
  show: boolean
  updatedAt: string
  _id: string
}

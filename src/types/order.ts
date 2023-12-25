export type OrderDataType = {
  name: string
  price: number | string
  createdAt: string
  updatedAt: string
  _id: string
}

export interface IOrderStore {
  isLoading: boolean
  order: OrderDataType | null
  orders: TOrder[] | null
  years: { orders: TYearOrder[]; results: TResult[] } | null
  success: boolean
  isError: boolean
  err_msg: null | { msg: string; param: string }[]
}

export type TOrder = {
  createdAt: string
  name: string
  price: string
  total_price: number
  total_count: number
  show: boolean
  orders: {
    client: string
    createdAt: Date
    date: string
    count: number
    item_price: number
    updatedAt: Date
    user: string
    price: string
    _id: string
  }[]
  order?: TViewOrderData
  updatedAt: string
  _id: string
}

export type TYearOrder = {
  createdAt: string
  name: string
  price: string
  total_price: number
  total_count: number
  show: boolean
  orders: TResult[]
  order?: TViewOrderData
  updatedAt: string
  _id: string
}

export type TOrderParams = {
  startDate?: Date | number | string
  endDate?: Date
  dates?: number
  month?: string
  year?: string
}

export type TViewOrderData = {
  client: string
  createdAt: Date
  date: string
  count: number | string
  item_price: number
  updatedAt: Date
  user: string
  price: string | number
  name?: string
  _id: string
}

export type TResult = { month: string; total_price: number; total_count: number }

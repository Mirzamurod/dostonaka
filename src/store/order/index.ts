import { createSlice } from '@reduxjs/toolkit'
import { addorder, orders, deleteorder, editorder, project } from '@/store/apis'
import { IOrderStore, TOrderParams, TViewOrderData } from '@/types/order'

const initialState: IOrderStore = {
  isLoading: false,
  order: null,
  orders: null,
  years: null,
  count: 1,
  success: false,
  isError: false,
  err_msg: null,
}

const order = createSlice({
  name: 'user',
  initialState,
  reducers: {
    onStart: state => {
      state.isLoading = true
      state.success = false
      state.err_msg = null
    },

    // getOrders
    onSuccessGetOrders: (state, { payload }) => {
      state.isLoading = false
      state.orders = payload
      state.count = payload.pageLists
      state.order = null
      state.success = false
    },

    // getOrders
    onSuccessGetYearOrders: (state, { payload }) => {
      state.isLoading = false
      state.years = payload
      state.count = payload.pageLists
      state.order = null
      state.success = false
    },

    // getOrder
    onSuccessGetOrder: (state, { payload }) => {
      state.isLoading = false
      state.order = payload
    },

    // addEditOrder
    onSuccessAddEditOrder: (state, { payload }) => {
      state.isLoading = false
      state.success = payload.success
    },
    onFailAddEditOrder: (state, { payload }) => {
      state.isLoading = false
      state.success = payload.success
      state.err_msg = payload.message
    },

    onFail: state => {
      state.isLoading = false
      state.success = false
    },
  },
})

export const getOrders = (params?: TOrderParams) =>
  project({
    url: orders,
    method: 'get',
    params,
    onStart: order.actions.onStart.type,
    onSuccess: order.actions.onSuccessGetOrders.type,
    onFail: order.actions.onFail.type,
  })

export const getYearOrders = (params: { year: string; search?: string; page?: number }) =>
  project({
    url: orders,
    method: 'get',
    params,
    onStart: order.actions.onStart.type,
    onSuccess: order.actions.onSuccessGetYearOrders.type,
    onFail: order.actions.onFail.type,
  })

export const getClient = (id: string) =>
  project({
    url: orders,
    method: 'get',
    params: { id },
    onStart: order.actions.onStart.type,
    onSuccess: order.actions.onSuccessGetOrder.type,
    onFail: order.actions.onFail.type,
  })

export const addOrder = (data: {
  price?: string
  count?: string
  date?: string
  client?: string
}) =>
  project({
    url: addorder,
    method: 'post',
    data,
    onStart: order.actions.onStart.type,
    onSuccess: order.actions.onSuccessAddEditOrder.type,
    onFail: order.actions.onFailAddEditOrder.type,
  })

export const editOrder = (data: TViewOrderData) =>
  project({
    url: editorder,
    method: 'put',
    data,
    onStart: order.actions.onStart.type,
    onSuccess: order.actions.onSuccessAddEditOrder.type,
    onFail: order.actions.onFailAddEditOrder.type,
  })

export const deleteOrder = (id: string) =>
  project({
    url: deleteorder,
    method: 'delete',
    params: { id },
    onStart: order.actions.onStart.type,
    onSuccess: order.actions.onSuccessAddEditOrder.type,
    onFail: order.actions.onFailAddEditOrder.type,
  })

export default order.reducer

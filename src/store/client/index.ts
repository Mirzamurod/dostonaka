import { createSlice } from '@reduxjs/toolkit'
import { addclient, clients, deleteclient, editclient, project } from '@/store/apis'
import { ClientDataType, IClientStore } from '@/types/client'

const initialState: IClientStore = {
  isLoading: false,
  client: null,
  clients: null,
  count: 1,
  success: false,
  isError: false,
  err_msg: null,
}

const login = createSlice({
  name: 'user',
  initialState,
  reducers: {
    onStart: state => {
      state.isLoading = true
      state.success = false
      state.err_msg = null
    },

    // getClients
    onSuccessGetClients: (state, { payload }) => {
      state.isLoading = false
      state.clients = payload.data
      state.count = payload.pageLists
      state.client = null
      state.success = false
    },

    // getClient
    onSuccessGetClient: (state, { payload }) => {
      state.isLoading = false
      state.client = payload
    },

    // addEditClient
    onSuccessAddEditClient: (state, { payload }) => {
      state.isLoading = false
      state.success = payload.success
    },
    onFailAddEditClient: (state, { payload }) => {
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

export const getClients = (params?: { search?: string; page?: number }) =>
  project({
    url: clients,
    method: 'get',
    params,
    onStart: login.actions.onStart.type,
    onSuccess: login.actions.onSuccessGetClients.type,
    onFail: login.actions.onFail.type,
  })

export const getClient = (id: string) =>
  project({
    url: clients,
    method: 'get',
    params: { id },
    onStart: login.actions.onStart.type,
    onSuccess: login.actions.onSuccessGetClient.type,
    onFail: login.actions.onFail.type,
  })

export const addClient = (data: { name: string; price: string | number }) =>
  project({
    url: addclient,
    method: 'post',
    data,
    onStart: login.actions.onStart.type,
    onSuccess: login.actions.onSuccessAddEditClient.type,
    onFail: login.actions.onFailAddEditClient.type,
  })

export const editClient = (
  data: { name: string; price: number | string; show?: boolean },
  id: string
) =>
  project({
    url: editclient,
    method: 'put',
    data,
    params: { id },
    onStart: login.actions.onStart.type,
    onSuccess: login.actions.onSuccessAddEditClient.type,
    onFail: login.actions.onFailAddEditClient.type,
  })

export const deleteClient = (id: string) =>
  project({
    url: deleteclient,
    method: 'delete',
    params: { id },
    onStart: login.actions.onStart.type,
    onSuccess: login.actions.onSuccessAddEditClient.type,
    onFail: login.actions.onFailAddEditClient.type,
  })

export default login.reducer

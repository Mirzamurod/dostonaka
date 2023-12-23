import { createSlice } from '@reduxjs/toolkit'
import { project, loginUser, userprofile } from '@/store/apis'
import { IUserStore } from '@/types/user'
import { encode } from 'js-base64'

const initialState: IUserStore = {
  isLoading: false,
  user: null,
  isError: false,
  code: '',
  token: false,
  err_msg: '',
  dark_mode: false,
  deleteCode: '',
}

const login = createSlice({
  name: 'user',
  initialState,
  reducers: {
    onStart: state => {
      state.isLoading = true
      state.isError = false
    },
    onSuccess: (state, { payload }) => {
      localStorage.setItem('dostonaka', encode(payload?.token))
      state.token = true
      state.isLoading = false
      state.isError = false
    },
    userProfile: (state, { payload }) => {
      state.isLoading = false
      state.isError = false
      state.user = payload.data
      state.dark_mode = payload.data.dark_mode
      state.err_msg = payload.message
      state.code = ''
    },
    userUpdate: (state, { payload }) => {
      state.isLoading = false
      state.isError = false
      state.code = payload.message.code
    },
    userDelete: (state, { payload }) => {
      state.isLoading = false
      state.isError = false
      state.deleteCode = payload.code
    },
    onFail: (state, { payload }) => {
      state.isLoading = false
      state.isError = true
      state.err_msg = { ...payload?.response?.data?.message }
    },
    changeMode: state => {
      state.dark_mode = !state.dark_mode
    },
    getUserData: (state, { payload }) => {
      state.user = payload
    },
    deleteUser: state => {
      state.user = null
      state.token = false
    },
  },
})

export const userLogin = (data: any) =>
  project({
    url: loginUser,
    method: 'post',
    data,
    onStart: login.actions.onStart.type,
    onSuccess: login.actions.onSuccess.type,
    onFail: login.actions.onFail.type,
  })

export const userProfile = () =>
  project({
    url: userprofile,
    method: 'get',
    onStart: login.actions.onStart.type,
    onSuccess: login.actions.userProfile.type,
    onFail: login.actions.onFail.type,
  })

// export const userUpdate = (data: any) =>
//   project({
//     url: userupdate,
//     method: 'put',
//     data,
//     onStart: login.actions.onStart.type,
//     onSuccess: login.actions.userUpdate.type,
//     onFail: login.actions.onFail.type,
//   })

// export const userDelete = (data: any) =>
//   project({
//     url: userdelete,
//     method: 'post',
//     data,
//     onStart: login.actions.onStart.type,
//     onSuccess: login.actions.userUpdate.type,
//     onFail: login.actions.onFail.type,
//   })

export const { changeMode, getUserData, deleteUser } = login.actions

export default login.reducer

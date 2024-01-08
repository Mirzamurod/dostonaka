import { createSlice } from '@reduxjs/toolkit'
import { project, loginUser, userprofile, edituser } from '@/store/apis'
import { IUserStore } from '@/types/user'
import { encode } from 'js-base64'

const initialState: IUserStore = {
  isLoading: false,
  success: false,
  user: null,
  isError: false,
  token: false,
  err_msg: '',
  dark_mode: false,
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
    },
    userUpdate: (state, { payload }) => {
      state.isLoading = false
      state.success = payload.success
      state.isError = false
    },
    userDelete: (state, { payload }) => {
      state.isLoading = false
      state.isError = false
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
      state.isLoading = false
      state.user = payload
    },
    deleteUser: state => {
      state.isError = false
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

export const userUpdate = (data: any) =>
  project({
    url: edituser,
    method: 'put',
    data,
    onStart: login.actions.onStart.type,
    onSuccess: login.actions.userUpdate.type,
    onFail: login.actions.onFail.type,
  })

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

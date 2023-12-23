import { createAction } from '@reduxjs/toolkit'
import { IProject } from '@/types/middleware'

export const project = createAction<IProject>('project')

// user
export const registerUser = 'users/add'
export const loginUser = 'login'
export const userprofile = 'profile'
export const getUsersApi = 'users'

// client
export const clients = 'clients'
export const addclient = 'addclient'
export const editclient = 'editclient'
export const deleteclient = 'deleteclient'

// order
export const orders = 'orders'
export const addorder = 'addorder'
export const editorder = 'editorder'
export const deleteorder = 'deleteorder'

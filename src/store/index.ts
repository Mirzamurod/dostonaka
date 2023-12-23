// Toolkit Imports
import { configureStore } from '@reduxjs/toolkit'

// Middleware
import middleware from '@/store/middleware'

// Reducers
import login from '@/store/user/login'
import register from '@/store/user/register'
import client from '@/store/client'
import order from '@/store/order'

export const store = configureStore({
  reducer: { login, register, client, order },
  middleware: [middleware],
})

export type AppDistach = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

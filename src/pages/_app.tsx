// React Imports
import { Fragment, ReactNode } from 'react'

// Next Imports
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// Loader Import
import NextNProgress from 'nextjs-progressbar'

// Third Party Import
import { ToastContainer } from 'react-toastify'

// Config Imports
import BlankLayout from '@/components/BlankLayout'
import { store } from '@/store'
import { Provider } from 'react-redux'
import Head from 'next/head'
import GuestGuard from '@/components/auth/GuestGuard'
import AuthGuard from '@/components/auth/AuthGuard'
import WindowWrapper from '@/components/window-wrapper'
import { AuthProvider } from '@/context/AuthContext'

// Css
import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-datepicker/dist/react-datepicker.css'

type ExtendedAppProps = AppProps & {
  Component: NextPage
}

type GuardProps = {
  authGuard: boolean
  guestGuard: boolean
  children: ReactNode
}

const Guard = ({ children, authGuard, guestGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard fallback={<h3>Loading1</h3>}>{children}</GuestGuard>
  } else if (!guestGuard && !authGuard) {
    return <Fragment>{children}</Fragment>
  } else {
    return <AuthGuard fallback={<h3>Loading2</h3>}>{children}</AuthGuard>
  }
}

const App = (props: ExtendedAppProps) => {
  const { Component, pageProps } = props

  // Variables
  // const contentHeightFixed = Component.contentHeightFixed ?? false
  const getLayout = Component.getLayout ?? (page => <BlankLayout>{page}</BlankLayout>)

  // const setConfig = Component.setConfig ?? undefined

  const authGuard = Component.authGuard ?? true

  const guestGuard = Component.guestGuard ?? false

  return (
    <Provider store={store}>
      <Head>
        <title>Teeth</title>
        <link rel='icon' href='./images/teeth.png' />
        <meta name='description' />
        <meta name='keywords' content='Project, project, ...' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>

      <AuthProvider>
        <WindowWrapper>
          <Guard authGuard={authGuard} guestGuard={guestGuard}>
            <NextNProgress color='#CF052D' />
            <Fragment>{getLayout(<Component {...pageProps} />)}</Fragment>
          </Guard>
          <ToastContainer
            position='top-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='dark'
          />
        </WindowWrapper>
      </AuthProvider>
    </Provider>
  )
}

export default App

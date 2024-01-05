import { FC, Fragment, ReactNode, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { deleteUser } from '@/store/user/login'
import { useRouter } from 'next/router'

interface IProps {
  children: ReactNode
}

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Yillik', href: '/reports' },
  { name: 'Klientlar', href: '/clients' },
  { name: 'Settings', href: '/settings' },
]

const Dropdown = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const logout = () => {
    dispatch(deleteUser())
    window.localStorage.removeItem('dostonaka')
    router.reload()
  }

  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <Menu.Button className='inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset'>
          {children}
          <ChevronDownIcon className='-mr-1 h-5 w-5 text-gray-400' aria-hidden='true' />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <Menu.Items className='absolute sm:right-0 left-0 z-10 mt-2 w-56 origin-top-right rounded-md border border-white pl-3 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='py-1'>
            <Menu.Item>{({ active }) => <button onClick={logout}>Log out</button>}</Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

const Navbar: FC<IProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { user } = useSelector((state: RootState) => state.login)

  return (
    <Fragment>
      <header className=''>
        <nav
          className='mx-auto flex container items-center justify-between p-6 lg:px-8'
          aria-label='Global'
        >
          <div className='flex lg:flex-1'>
            <Link href='/' className='-m-1.5 p-1.5'>
              <span className='sr-only'>Your Company</span>
              <img className='h-8 w-auto' src='/images/teeth.png' alt='teeth' />
            </Link>
          </div>
          <div className='flex lg:hidden'>
            <button
              type='button'
              className='-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400'
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className='sr-only'>Open main menu</span>
              <Bars3Icon className='h-6 w-6' aria-hidden='true' />
            </button>
          </div>
          <div className='hidden lg:flex lg:gap-x-12'>
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className='text-sm font-semibold leading-6 text-white'
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className='hidden lg:flex lg:flex-1 lg:justify-end'>
            {user ? (
              <Dropdown>{user.username}</Dropdown>
            ) : (
              <Link href='/login' className='text-sm font-semibold leading-6 text-white'>
                Log in
              </Link>
            )}
          </div>
        </nav>
        <Dialog as='div' className='lg:hidden' open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className='fixed inset-0 z-10' />
          <Dialog.Panel className='fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10'>
            <div className='flex items-center justify-between'>
              <Link href='/' onClick={() => setMobileMenuOpen(false)} className='-m-1.5 p-1.5'>
                <span className='sr-only'>Your Company</span>
                <img className='h-8 w-auto' src='/images/teeth.png' alt='' />
              </Link>
              <button
                type='button'
                className='-m-2.5 rounded-md p-2.5 text-gray-400'
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className='sr-only'>Close menu</span>
                <XMarkIcon className='h-6 w-6' aria-hidden='true' />
              </button>
            </div>
            <div className='mt-6 flow-root'>
              <div className='-my-6 divide-y divide-gray-500/25'>
                <div className='space-y-2 py-6'>
                  {navigation.map(item => (
                    <Link
                      onClick={() => setMobileMenuOpen(false)}
                      key={item.name}
                      href={item.href}
                      className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800'
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className='py-6'>
                  {user ? (
                    <Dropdown>{user.username}</Dropdown>
                  ) : (
                    <Link
                      href='/login'
                      className='-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800'
                    >
                      Log in
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>
      {children}
    </Fragment>
  )
}

export default Navbar

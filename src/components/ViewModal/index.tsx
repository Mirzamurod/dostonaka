import { FC, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { TViewOrderData } from '@/types/order'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Button from '../Button'
import { getSum } from '../funcs'

interface IProps {
  open: boolean
  setOpen: (value: boolean) => void
  openPop: boolean
  setOpenPop: (value: boolean) => void
  setEdit: (value: boolean) => void
  setOpenAll: (value: boolean) => void
  data: TViewOrderData | null
}

const ViewModal: FC<IProps> = ({ open, setOpen, data, setOpenAll, setEdit, setOpenPop }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative w-full mx-3 transform overflow-hidden rounded-lg bg-gray-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
                <div className='absolute right-0 top-0 hidden pr-4 pt-4 sm:block'>
                  <button
                    type='button'
                    className='rounded-md text-white hover:text-gray-200'
                    onClick={() => setOpen(false)}
                  >
                    <span className='sr-only'>Close</span>
                    <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                  </button>
                </div>
                <div className='mt-3 sm:mt-5'>
                  <Dialog.Title as='h3' className='text-xl font-semibold leading-6 text-center'>
                    Zakaz
                  </Dialog.Title>
                  <div className='mt-6'>
                    <div className='space-y-6'>
                      <div>Klient ismi: {data?.name}</div>
                      <div>Sana: {data?.date}</div>
                      <div>Zakazlar soni: {data?.count}</div>
                      <div>1ta mahsulot narxi: {getSum(data?.price as string)}</div>
                      <div>Umumiy narxi: {getSum(data?.item_price as number)}</div>
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
                  <button
                    onClick={() => setOpenPop(true)}
                    className='w-full col-span-2 rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 text-center'
                  >
                    O'chirish
                  </button>
                  <Button
                    className='mt-3 inline-flex w-full justify-center sm:col-start-2 sm:mt-0'
                    onClick={() => {
                      setOpen(false)
                      setOpenAll(true)
                      setEdit(true)
                    }}
                  >
                    O'zgartirish
                  </Button>
                  <button
                    type='button'
                    className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default ViewModal

import { FC, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { TOrder } from '@/types/order'
import { addOrder, editOrder } from '@/store/order'
import { RootState } from '@/store'
import Button from '../Button'

interface IProps {
  open: boolean
  setOpen: (value: boolean) => void
  data: (TOrder & { date: string }) | null
  edit: boolean
}

const Modal: FC<IProps> = ({ open, setOpen, data, edit }) => {
  const formSchema = yup.object().shape({
    count: yup.string().required('Sonini yozish shart'),
    price: yup.string(),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    reset,
  } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(formSchema),
    defaultValues: { price: '', count: '' },
  })
  const dispatch = useDispatch()
  const { isLoading, success } = useSelector((state: RootState) => state.order)

  const onSubmit = (values: { price?: string; count: string }) => {
    if (edit) {
      dispatch(
        editOrder({
          ...data?.order,
          // @ts-ignore
          count: values.count,
          // @ts-ignore
          price: values.price ?? data?.order?.price,
        })
      )
    } else {
      if (!values.price && data)
        dispatch(addOrder({ ...values, price: data?.price, date: data?.date, client: data?._id }))
      else dispatch(addOrder({ ...values, date: data?.date, client: data?._id }))
    }
  }

  const cancel = () => {
    reset()
    setOpen(false)
  }

  useEffect(() => {
    if (edit) {
      setValue('count', data?.order?.count as any)
      setValue('price', data?.order?.price as string)
    }
  }, [edit, data])

  useEffect(() => {
    if (success) reset()
  }, [success])

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={cancel}>
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
          <div className='flex min-h-full items-center w-full justify-center text-center sm:items-center sm:p-0'>
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
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='mt-3 sm:mt-5'>
                    <Dialog.Title as='h3' className='text-xl font-semibold leading-6 text-center'>
                      {edit ? "Zakazni o'zgartirish" : "Zakaz qo'shish"}
                    </Dialog.Title>
                    <div className='mt-6'>
                      <div className='space-y-6'>
                        <div>Klient ismi: {data?.name}</div>
                        <div>Sana: {data?.date}</div>
                        {/* Count */}
                        <div>
                          <div className='flex items-center justify-between'>
                            <label
                              htmlFor='count'
                              className={`block text-sm font-medium leading-6 ${
                                errors.count?.message ? 'text-red-700' : 'text-white'
                              }`}
                            >
                              Mahsulotlar soni
                            </label>
                          </div>
                          <div className='mt-2'>
                            <input
                              id='count'
                              {...register('count')}
                              type='text'
                              placeholder='Mahsulotlar soni'
                              className={`text-sm rounded block w-full p-2.5 border ${
                                errors.count?.message
                                  ? 'bg-white/5 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500'
                                  : 'bg-white/5 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                              }`}
                            />
                            {errors.count?.message ? (
                              <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                {errors.count.message}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        {/* Price */}
                        <div>
                          <div className='flex items-center justify-between'>
                            <label
                              htmlFor='price'
                              className={`block text-sm font-medium leading-6 ${
                                errors.price?.message ? 'text-red-700' : 'text-white'
                              }`}
                            >
                              Mahsulotlar narxi (optional)
                            </label>
                          </div>
                          <div className='mt-2'>
                            <input
                              id='price'
                              {...register('price')}
                              type='text'
                              placeholder={Number(data?.price)
                                .toLocaleString()
                                .replaceAll(',', ' ')}
                              className={`text-sm rounded block w-full p-2.5 border ${
                                errors.price?.message
                                  ? 'bg-white/5 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500'
                                  : 'bg-white/5 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                              }`}
                            />
                            {errors.price?.message ? (
                              <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                                {errors.price.message}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
                    <Button
                      type='submit'
                      className='inline-flex w-full justify-center sm:col-start-2'
                      isLoading={isLoading}
                    >
                      Saqlash
                    </Button>
                    <button
                      type='button'
                      className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
                      onClick={cancel}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal

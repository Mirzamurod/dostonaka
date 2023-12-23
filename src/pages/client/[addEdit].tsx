import Button from '@/components/Button'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { RootState } from '@/store'
import { useDispatch, useSelector } from 'react-redux'
import { addClient, editClient, getClient } from '@/store/client'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const AddClient = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const formSchema = yup.object().shape({
    name: yup.string().required('Klient ismini yozish shart'),
    price: yup.string().required('1ta mahsulot narxini yozish shart'),
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(formSchema),
  })

  const { isLoading, success, err_msg, client } = useSelector((state: RootState) => state.client)

  useEffect(() => {
    if (router.query.addEdit !== 'add') {
      dispatch(getClient(router.query.addEdit as string))
    }
  }, [router.query.addEdit])

  useEffect(() => {
    if (client) {
      setValue('name', client.name)
      setValue('price', client.price as string)
    }
  }, [client])

  useEffect(() => {
    if (success) router.replace('/clients')
    else if (typeof err_msg !== 'string' && err_msg?.length)
      err_msg?.forEach(err =>
        setError(err.param as 'name' | 'price', { type: 'manual', message: err.msg })
      )
  }, [success, err_msg])

  const onSubmit = (values: { name: string; price: string }) => {
    if (router.query.addEdit === 'add') dispatch(addClient(values))
    else dispatch(editClient(values, router.query.addEdit as string))
  }

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 pb-12 lg:px-8'>
      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-lg'>
        <h2 className='text-3xl font-bold tracking-tight text-white sm:text-4xl mb-7'>
          Klientni {router.query.addEdit === 'add' ? "qo'shish" : "o'zgartirish"}
        </h2>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor='name'
              className={`block text-sm font-medium leading-6 ${
                errors.name?.message ? 'text-red-700' : 'text-white'
              }`}
            >
              Klient ismi
            </label>
            <div className='mt-2'>
              <input
                id='name'
                type='text'
                {...register('name')}
                placeholder='Klient ismi'
                className={`text-sm rounded block w-full p-2.5 border ${
                  errors.name?.message
                    ? 'bg-white/5 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500'
                    : 'bg-white/5 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {errors.name?.message ? (
                <p className='mt-2 text-sm text-red-600 dark:text-red-500'>{errors.name.message}</p>
              ) : null}
            </div>
          </div>
          <div>
            <label
              htmlFor='price'
              className={`block text-sm font-medium leading-6 ${
                errors.name?.message ? 'text-red-700' : 'text-white'
              }`}
            >
              1ta mahsulot narxi
            </label>
            <div className='mt-2'>
              <input
                id='price'
                type='text'
                {...register('price')}
                placeholder='1ta mahsulot narxi'
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
          <div className='flex gap-6'>
            <Link
              href='/clients'
              className='w-full bg-white text-gray-900 ring-gray-300 hover:bg-gray-50 flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm'
            >
              Orqaga
            </Link>
            <Button className='w-full' isLoading={isLoading}>
              Qo'shish
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddClient

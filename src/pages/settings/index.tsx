import Button from '@/components/Button'
import { getSum } from '@/components/funcs'
import { RootState } from '@/store'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import InputMask from 'react-input-mask'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { userUpdate } from '@/store/user/login'
import { useRouter } from 'next/router'

const Settings = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const formSchema = yup.object().shape({
    username: yup.string().required("Ism bo'lishi shart"),
    phone: yup.string().required("Nomer bo'lishi shart"),
    price: yup.number(),
  })
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm({
    mode: 'onTouched',
    resolver: yupResolver(formSchema),
    defaultValues: {},
  })

  const [edit, setEdit] = useState<boolean>(false)

  const { isLoading, user, success } = useSelector((state: RootState) => state.login)

  useEffect(() => {
    if (success) router.reload()
  }, [success])

  useEffect(() => {
    if (user) {
      setValue('username', user.username)
      setValue('phone', user.phone)
      setValue('price', user.price ?? 0)
    }
  }, [user])

  const onSubmit = (values: any) => {
    dispatch(userUpdate(values))
  }

  return (
    <div className='container mx-auto p-6 lg:px-8'>
      <div className='absolute inset-y-0 left-0 -z-10 w-full overflow-hidden ring-1 ring-white/5'>
        <svg
          className='absolute inset-0 h-full w-full stroke-gray-700 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]'
          aria-hidden='true'
        >
          <defs>
            <pattern
              id='54f88622-e7f8-4f1d-aaf9-c2f5e46dd1f2'
              width={200}
              height={200}
              x='100%'
              y={-1}
              patternUnits='userSpaceOnUse'
            >
              <path d='M130 200V.5M.5 .5H200' fill='none' />
            </pattern>
          </defs>
          <svg x='100%' y={-1} className='overflow-visible fill-gray-800/20'>
            <path d='M-470.5 0h201v201h-201Z' strokeWidth={0} />
          </svg>
          <rect
            width='100%'
            height='100%'
            strokeWidth={0}
            fill='url(#54f88622-e7f8-4f1d-aaf9-c2f5e46dd1f2)'
          />
        </svg>
        <div
          className='absolute -left-56 top-[calc(100%-13rem)] transform-gpu blur-3xl lg:left-[max(-14rem,calc(100%-59rem))] lg:top-[calc(50%-7rem)]'
          aria-hidden='true'
        >
          <div
            className='aspect-[1155/678] w-[72.1875rem] bg-gradient-to-br from-[#80caff] to-[#4f46e5] opacity-20'
            style={{
              clipPath:
                'polygon(74.1% 56.1%, 100% 38.6%, 97.5% 73.3%, 85.5% 100%, 80.7% 98.2%, 72.5% 67.7%, 60.2% 37.8%, 52.4% 32.2%, 47.5% 41.9%, 45.2% 65.8%, 27.5% 23.5%, 0.1% 35.4%, 17.9% 0.1%, 27.6% 23.5%, 76.1% 2.6%, 74.1% 56.1%)',
            }}
          />
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='p-3 px-6 pb-20 pt-8 sm:pt-14 lg:px-8 lg:py-20'
      >
        {/* {isLoading ? (
          <div role='status' className='max-w-sm animate-pulse'>
            <div className='h-8 bg-gray-200 rounded-full dark:bg-gray-700 mb-4' />
            <div className='mt-10'>
              <div className='h-5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-4' />
              <div className='h-5 bg-gray-200 rounded-full dark:bg-gray-700 mb-4' />
              <div className='h-5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-4' />
            </div>
            <span className='sr-only'>Loading...</span>
          </div>
        ) : ( */}
        <div>
          <h2 className='md:text-3xl sm:text-xl text-lg font-bold tracking-tight text-white'>
            Foydalanuvchi haqida malumotlar
          </h2>
          <div className='grid md:grid-cols-3 gap-y-4 mt-10 text-xl'>
            <b className='md:col-span-1'>Foydalanuvchi ismi:</b>
            <div className='md:col-span-2'>
              {edit ? (
                <div>
                  <input
                    id='name'
                    type='text'
                    placeholder='Ism'
                    {...register('username')}
                    // value={fields?.username}
                    // onChange={({ target }) =>
                    //   setFields({ ...fields, username: target.value } as typeof fields)
                    // }
                    className={`text-sm rounded block w-full p-2.5 border ${
                      errors.username?.message
                        ? 'bg-white/5 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500'
                        : 'bg-white/5 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  {errors.username?.message ? (
                    <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                      {errors.username.message}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p>{user?.username}</p>
              )}
            </div>
            <b className='md:col-span-1'>Foydalanuvchi telefoni:</b>
            <div className='md:col-span-2'>
              {edit ? (
                <div>
                  <Controller
                    control={control}
                    name='phone'
                    render={({ field: { onChange, value } }) => (
                      <InputMask
                        mask='(99) 999-99-99'
                        value={value}
                        // @ts-ignore
                        onChange={onChange}
                        {...register('phone')}
                      >
                        {/* @ts-ignore */}
                        {inputProps => (
                          <input
                            id='phone'
                            type='tel'
                            placeholder='(12) 345-67-89'
                            {...inputProps}
                            className={`text-sm rounded block w-full p-2.5 border ${
                              errors.phone?.message
                                ? 'bg-white/5 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500'
                                : 'bg-white/5 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                          />
                        )}
                      </InputMask>
                    )}
                  />

                  {errors.phone?.message ? (
                    <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                      {errors.phone.message}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p>{user?.phone || 'Hali kiritilmagan'}</p>
              )}
            </div>
            <b className='md:col-span-1'>1ta mahsulot narxi:</b>
            <div className='md:col-span-2'>
              {edit ? (
                <div>
                  <input
                    id='price'
                    type='number'
                    {...register('price')}
                    placeholder='1ta mahsulot narxi'
                    className='text-sm rounded block w-full p-2.5 border bg-white/5 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
              ) : (
                <p>{getSum((user?.price as number) || 0)}</p>
              )}
            </div>
            <div className='md:col-start-2 flex md:flex-row flex-col'>
              {edit ? (
                <Fragment>
                  <Button type='submit' isLoading={isLoading}>
                    O'zgartirish
                  </Button>
                  <button
                    type='button'
                    className='inline-flex sm:ml-5 sm:mt-0 mt-3 justify-center rounded bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 w-full sm:w-auto'
                    onClick={() => setEdit(false)}
                  >
                    Restart
                  </button>
                </Fragment>
              ) : null}
            </div>
          </div>
        </div>
        {/* )} */}
      </form>
      {edit ? null : (
        <div className='grid md:grid-cols-3 -mt-16 ml-4'>
          <Button type='button' className='md:col-start-2' onClick={() => setEdit(true)}>
            O'zgartirish
          </Button>
        </div>
      )}
    </div>
  )
}

export default Settings

import { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { userLogin } from '@/store/user/login'
import { RootState } from '@/store'
import Button from '@/components/Button'

const Login = () => {
  const dispatch = useDispatch()
  const formSchema = yup.object().shape({
    email: yup.string().required('Emailni yozish shart').email('Bu email emas'),
    password: yup
      .string()
      .required('Password yozish shart')
      .min(8, "Kamida 8ta harf bo'lishi shart")
      .max(16, "Ko'pida 16ta harf bo'lishi shart")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/, 'Password juda oddiy'),
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
    defaultValues: { email: 'test@gmail.com', password: 'microlab1M*' },
  })

  const { isLoading } = useSelector((state: RootState) => state.login)

  const onSubmit = (values: { email: string; password: string }) => dispatch(userLogin(values))

  return (
    <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <img className='mx-auto h-10 w-auto' src='/images/teeth.png' alt='Your Company' />
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white'>
          Sign in to your account
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor='email'
              className={`block text-sm font-medium leading-6 ${
                errors.email?.message ? 'text-red-700' : 'text-white'
              }`}
            >
              Email address
            </label>
            <div className='mt-2'>
              <input
                id='email'
                {...register('email')}
                type='email'
                placeholder='Email'
                className={`text-sm rounded block w-full p-2.5 border ${
                  errors.email?.message
                    ? 'bg-white/5 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500'
                    : 'bg-white/5 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {errors.email?.message ? (
                <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                  {errors.email.message}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <div className='flex items-center justify-between'>
              <label
                htmlFor='password'
                className={`block text-sm font-medium leading-6 ${
                  errors.password?.message ? 'text-red-700' : 'text-white'
                }`}
              >
                Password
              </label>
              {/* <div className='text-sm'>
                <a href='#' className='font-semibold text-indigo-400 hover:text-indigo-300'>
                  Forgot password?
                </a>
              </div> */}
            </div>
            <div className='mt-2'>
              <input
                id='password'
                {...register('password')}
                type='password'
                placeholder='Parol'
                className={`text-sm rounded block w-full p-2.5 border ${
                  errors.password?.message
                    ? 'bg-white/5 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500'
                    : 'bg-white/5 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {errors.password?.message ? (
                <p className='mt-2 text-sm text-red-600 dark:text-red-500'>
                  {errors.password.message}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <Button type='submit' className='w-full' isLoading={isLoading}>
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

Login.getLayout = (page: ReactNode) => <div>{page}</div>

Login.guestGuard = true

export default Login

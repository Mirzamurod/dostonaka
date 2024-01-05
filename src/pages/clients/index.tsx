import { useEffect, useState } from 'react'
import Button from '@/components/Button'
import { getSum } from '@/components/funcs'
import { RootState } from '@/store'
import { editClient, getClients } from '@/store/client'
import { ClientDataType } from '@/types/client'
import { Switch } from '@headlessui/react'
import { encode } from 'js-base64'
import Link from 'next/link'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const Clients = () => {
  const dispatch = useDispatch()
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(0)

  const { isLoading, clients, success, count } = useSelector((state: RootState) => state.client)

  useEffect(() => {
    dispatch(getClients({ page }))
  }, [])

  useEffect(() => {
    if (success) dispatch(getClients({ page }))
  }, [success])

  const searchBtn = () => {
    dispatch(getClients({ search, page: 0 }))
    setPage(0)
  }

  const changePage = ({ selected }: { selected: number }) => {
    setPage(selected)
    dispatch(getClients({ page: selected }))
  }

  const reset = () => {
    dispatch(getClients({ search: '', page: 0 }))
    setSearch('')
    setPage(0)
  }

  const checked = (client: ClientDataType) =>
    dispatch(editClient({ ...client, show: !client.show }, encode(client._id)))

  return (
    <div className='mx-auto container p-6 lg:px-8'>
      <div className='pb-10'>
        <div className='flex justify-end sm:flex-row flex-col'>
          <input
            type='text'
            value={search}
            onChange={({ target }) => setSearch(target.value)}
            placeholder="Ism bo'yicha qidirish"
            className='w-full sm:w-auto sm:mt-0 mt-3 sm:ml-5 text-sm rounded block p-2 border bg-white/5 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-white'
          />
          <Button onClick={searchBtn} className='w-full sm:w-auto sm:mt-0 mt-3 sm:ml-5 rounded'>
            Qidirish
          </Button>
          <button
            type='button'
            className='inline-flex sm:ml-5 sm:mt-0 mt-3 justify-center rounded bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 w-full sm:w-auto'
            onClick={reset}
          >
            Restart
          </button>
          <Link
            href='/client/add'
            className='sm:w-auto sm:mt-0 mt-3 sm:ml-5 block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
          >
            Klient qo'shish
          </Link>
        </div>
        {isLoading ? (
          'Loading...'
        ) : !isLoading && clients?.length ? (
          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                <div className='block w-full overflow-x-auto'>
                  <table className='divide-y divide-gray-700 text-white w-full min-w-full'>
                    <thead>
                      <tr className='divide-x divide-[#3e3e3e]'>
                        <th
                          scope='col'
                          className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white min-w-[300px]'
                        >
                          Klient Ismi
                        </th>
                        <th
                          scope='col'
                          className='px-3 py-3.5 text-left text-sm font-semibold text-white min-w-[200px]'
                        >
                          Narx
                        </th>
                        <th
                          scope='col'
                          className='px-3 py-3.5 text-left text-sm font-semibold text-white  min-w-[150px]'
                        >
                          Status
                        </th>
                        <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-0 min-w-[112px]'>
                          <span className='sr-only'>Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-800'>
                      {clients?.map((client, index) => (
                        <tr key={client._id} className='divide-x divide-[#3e3e3e]'>
                          <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white min-w-[300px]'>
                            {client.name}
                          </td>
                          <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-300 min-w-[200px]'>
                            {getSum(client.price)}
                          </td>
                          <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-300  min-w-[150px]'>
                            {client.show}
                            <Switch
                              checked={client.show}
                              onChange={() => checked(client)}
                              className={classNames(
                                client.show ? 'bg-indigo-600' : 'bg-gray-200',
                                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
                              )}
                            >
                              <span className='sr-only'>Use setting</span>
                              <span
                                aria-hidden='true'
                                className={classNames(
                                  client.show ? 'translate-x-5' : 'translate-x-0',
                                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                                )}
                              />
                            </Switch>
                          </td>
                          <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 min-w-[112px]'>
                            <div className='flex gap-4 mr-3'>
                              <Link
                                href={`/client/${encode(client._id)}`}
                                className='text-indigo-400 hover:text-indigo-300'
                              >
                                Edit<span className='sr-only'>, {client.name}</span>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div id='react-paginate' className='w-full text-end mt-5'>
              <ReactPaginate
                breakLabel='...'
                nextLabel='>'
                onPageChange={changePage}
                pageRangeDisplayed={5}
                pageCount={count}
                initialPage={page}
                previousLabel='<'
                renderOnZeroPageCount={null}
                disableInitialCallback
                breakClassName='page-item'
                breakLinkClassName='page-link'
                containerClassName='pagination'
                pageClassName='page-item'
                pageLinkClassName='page-link'
                previousClassName='page-item'
                previousLinkClassName='page-link'
                nextClassName='page-item'
                nextLinkClassName='page-link'
                activeClassName='active'
              />
            </div>
          </div>
        ) : (
          'No data'
        )}
      </div>
    </div>
  )
}

export default Clients

import { RootState } from '@/store'
import { getClients } from '@/store/client'
import { Switch } from '@headlessui/react'
import { encode } from 'js-base64'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import { useDispatch, useSelector } from 'react-redux'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const Clients = () => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [id, setId] = useState('')

  const { isLoading, clients } = useSelector((state: RootState) => state.client)

  useEffect(() => {
    dispatch(getClients())
  }, [])

  const deleteClient = (id: string) => {
    setId(id)
    setOpen(true)
  }

  return (
    <div className='mx-auto container p-6 lg:px-8'>
      <div className='pb-10'>
        <div className='flex justify-end'>
          <Link
            href='/client/add'
            className='block rounded-md bg-indigo-500 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500'
          >
            Add user
          </Link>
        </div>
        {isLoading ? (
          'Loading...'
        ) : (
          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
              <div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
                <table className='min-w-full divide-y divide-gray-700'>
                  <thead>
                    <tr>
                      <th
                        scope='col'
                        className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0'
                      >
                        Klient Ismi
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-white'
                      >
                        Narx
                      </th>
                      <th
                        scope='col'
                        className='px-3 py-3.5 text-left text-sm font-semibold text-white'
                      >
                        Status
                      </th>
                      <th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-0 w-28'>
                        <span className='sr-only'>Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-800'>
                    {clients?.map(client => (
                      <tr key={client._id}>
                        <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0'>
                          {client.name}
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-300'>
                          {Number(client.price).toLocaleString().replaceAll(',', ' ')} so'm
                        </td>
                        <td className='whitespace-nowrap px-3 py-4 text-sm text-gray-300'>
                          {client.show}
                          <Switch
                            checked={client.show}
                            // onChange={setEnabled}
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
                        <td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
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
                <div id='react-paginate' className='w-full text-end mt-5'>
                  <ReactPaginate
                    breakLabel='...'
                    nextLabel='>'
                    // onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={5}
                    previousLabel='<'
                    renderOnZeroPageCount={null}
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Clients

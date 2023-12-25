import { RootState } from '@/store'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import dayjs from 'dayjs'
import { getSum } from '@/components/funcs'
import { getYearOrders } from '@/store/order'
import { toast } from 'react-toastify'

const Reports = () => {
  const dispatch = useDispatch()
  const [year, setYear] = useState(new Date())
  const [total, setTotal] = useState<{ total_price: number; total_count: number } | null>()

  const { isLoading, years } = useSelector((state: RootState) => state.order)

  const monthsS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const monthsN = [
    'Yanvar',
    'Fevral',
    'Mart',
    'Aprel',
    'May',
    'Iyun',
    'Iyul',
    'Avgust',
    'Sentabr',
    'Oktabr',
    'Noyabr',
    'Dekabr',
  ]

  const onChange = (year: Date) => setYear(year)

  useEffect(() => {
    dispatch(getYearOrders({ year: dayjs(year).format('YYYY') }))
  }, [year])

  useEffect(() => {
    let total_price = 0
    let total_count = 0
    if (years?.orders) {
      years?.orders.forEach(order => {
        total_count += Number(order.total_count)
        total_price += Number(order.total_price)
      })
    }
    setTotal({ total_count, total_price })
  }, [years?.orders])

  function copyText(entryText: any) {
    navigator.clipboard.writeText(entryText)
    toast.success("Ko'piya qilindi.")
  }

  return (
    <div className='mx-auto container p-6 lg:px-8'>
      <div className='pb-10'>
        <div className='mt-8 flow-root'>
          <div className='-mx-4 -my-2 sm:-mx-6 lg:-mx-8'>
            <div className='inline-block w-full py-2 align-middle sm:px-6 lg:px-8'>
              <div className='flex justify-end items-center text-black mb-5 sm:flex-row flex-col'>
                <DatePicker
                  selected={year}
                  onChange={onChange}
                  showYearPicker
                  dateFormat='yyyy'
                  className='indent-1 text-sm rounded block w-full p-[7px] border bg-white/5 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-white'
                />
                <button
                  type='button'
                  className='inline-flex sm:ml-5 sm:mt-0 mt-3 justify-center rounded bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 w-full sm:w-auto'
                  onClick={() => setYear(new Date())}
                >
                  Restart
                </button>
              </div>
              {isLoading ? (
                'Loading...'
              ) : !isLoading && years?.orders?.length ? (
                <div className='block w-full overflow-x-auto'>
                  <table className='divide-y divide-gray-700 text-white w-full min-w-full'>
                    <thead>
                      <tr className='divide-x divide-[#3e3e3e]'>
                        <th
                          scope='col'
                          className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold flex items-center min-w-[220px]'
                        >
                          Name
                        </th>
                        {monthsS.map((month, index) => (
                          <th
                            key={month}
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold min-w-[250px]'
                          >
                            {`${monthsN[index]} (${dayjs(year).format('YYYY')})`}
                          </th>
                        ))}
                        <th
                          scope='col'
                          className='px-3 py-3.5 text-left text-sm font-semibold min-w-[250px]'
                        >
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-800'>
                      {years.orders?.map(order => (
                        <tr key={order._id} className='divide-x divide-[#3e3e3e]'>
                          <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium'>
                            {order.name}
                          </td>
                          {monthsS.map((month, index) => (
                            <td
                              key={month}
                              scope='col'
                              className='px-3 py-3.5 text-left text-sm text-gray-300'
                            >
                              <p>Soni: {order.orders[index].total_count}</p>
                              <p>Narxi: {getSum(order.orders[index].total_price)}</p>
                            </td>
                          ))}
                          <td className='whitespace-nowrap px-3 py-3.5 pr-3 text-sm text-gray-300'>
                            <div
                              className='cursor-pointer'
                              onClick={() =>
                                copyText(
                                  `Ism: ${order.name},
Soni: ${order.total_count} ta,
Narxi: ${getSum(order.total_price)},
`
                                )
                              }
                            >
                              <p>Umuniy soni: {order.total_count}</p>
                              <p>Umumiy narxi: {getSum(order.total_price)}</p>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr className='divide-x divide-[#3e3e3e]'>
                        <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium' />
                        {years.results.map(result => (
                          <td scope='col' className='px-3 py-3.5 text-left text-sm text-gray-300'>
                            <p>Umumiy soni: {result.total_count}</p>
                            <p>Umumiy narxi: {getSum(result.total_price)}</p>
                          </td>
                        ))}
                        <td className='whitespace-nowrap px-3 py-3.5 pr-3 text-sm font-semibold text-gray-300'>
                          <p>Umuniy soni: {total?.total_count}</p>
                          <p>Umumiy narxi: {getSum(total?.total_price as number)}</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                'No data'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
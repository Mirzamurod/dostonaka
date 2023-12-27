import Button from '@/components/Button'
import Modal from '@/components/Modal'
import { RootState } from '@/store'
import { getOrders } from '@/store/order'
import { PlusIcon } from '@heroicons/react/20/solid'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import DatePicker from 'react-datepicker'
import dayjs from 'dayjs'
import { TOrder, TViewOrderData } from '@/types/order'
import ViewModal from '@/components/ViewModal'
import { getSum } from '@/components/funcs'
import PopConfirm from '@/components/PopConfirm'
import { toast } from 'react-toastify'

export default function Home() {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [openView, setOpenView] = useState(false)
  const [openPop, setOpenPop] = useState(false)
  const [edit, setEdit] = useState(false)
  const [id, setId] = useState<string>('')
  const [select, setSelect] = useState<'day' | 'month'>('month')
  const [data, setData] = useState<(TOrder & { date: string }) | null>(null)
  const [dataView, setDataView] = useState<TViewOrderData | null>(null)
  const [startDate, setStartDate] = useState<string | Date | number>(
    new Date().setDate(new Date().getDate() - 7)
  )
  const [endDate, setEndDate] = useState(new Date())
  const [month, setMonth] = useState(new Date())
  const [total, setTotal] = useState<{ total_price: number; total_count: number } | null>()
  const [dates, setDates] = useState<any>(
    // @ts-ignore
    Math.floor(Number(endDate - startDate) / 1000 / 60 / 60 / 24 + 4)
  )

  const { isLoading, orders, success } = useSelector((state: RootState) => state.order)

  const addDay = (num: number) => dayjs(startDate).add(num, 'day').format('DD.MM.YYYY')

  const onChangeDay = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
    if (start && end) setDates(Math.floor(Number(end - start) / 1000 / 60 / 60 / 24 + 1))
  }

  const onChangeMonth = (date: any) => {
    setMonth(date)
    const day = `${dayjs(date).format('MM')}.01.${dayjs(date).format('YYYY')}`
    let nextMonth = dayjs(
      `${dayjs(date).add(1, 'month').format('MM')}.01.${dayjs(date).format('YYYY')}`
    )
      .add(-1, 'day')
      .format('DD.MM.YYYY')
    setStartDate(day)
    setDates(Number(nextMonth.split('.')[0]))
  }

  const search = () => {
    if (select === 'day') {
      if (!endDate) {
        // @ts-ignore
        setDates(Math.floor(Number(new Date() - startDate) / 1000 / 60 / 60 / 24 + 4))
        setEndDate(new Date())
        dispatch(
          getOrders({
            startDate: dayjs(startDate).format('MM.DD.YYYY'),
            endDate: new Date(),
            dates: Math.floor(
              // @ts-ignore
              Number(new Date() - startDate) / 1000 / 60 / 60 / 24 + 4
            ),
            select,
          })
        )
      } else {
        // @ts-ignore
        setDates(Math.floor(Number(endDate - startDate) / 1000 / 60 / 60 / 24 + 1))
        dispatch(
          getOrders({
            startDate: dayjs(startDate).format('MM.DD.YYYY'),
            endDate,
            dates,
            select,
          })
        )
      }
    } else {
      dispatch(
        getOrders({
          startDate: dayjs(startDate).format('MM.DD.YYYY'),
          endDate,
          dates,
          select,
        })
      )
    }
  }

  const addOrder = (data: TOrder, date: string) => {
    setEdit(false)
    setData({ ...data, date })
    setOpen(true)
  }

  const view = (data: any) => {
    setDataView(data)
    setOpenView(true)
  }

  const reset = () => {
    if (select === 'day') {
      setStartDate(new Date().setDate(new Date().getDate() - 7))
      setEndDate(new Date())
      dispatch(
        getOrders({
          startDate: dayjs(new Date().setDate(new Date().getDate() - 7)).format('MM.DD.YYYY'),
          endDate: new Date(),
          dates: Math.floor(
            // @ts-ignore
            Number(new Date() - new Date().setDate(new Date().getDate() - 7)) /
              1000 /
              60 /
              60 /
              24 +
              4
          ),
          select,
        })
      )

      setDates(
        Math.floor(
          // @ts-ignore
          Number(new Date() - new Date().setDate(new Date().getDate() - 7)) / 1000 / 60 / 60 / 24 +
            4
        )
      )
    } else {
      setMonth(new Date())
      const day = `${dayjs(new Date()).format('MM')}.01.${dayjs(new Date()).format('YYYY')}`
      let nextMonth = dayjs(
        `${dayjs(new Date()).add(1, 'month').format('MM')}.01.${dayjs(new Date()).format('YYYY')}`
      )
        .add(-1, 'day')
        .format('DD.MM.YYYY')

      setStartDate(day)
      setDates(Number(nextMonth.split('.')[0]))

      dispatch(
        getOrders({
          startDate: dayjs(day).format('MM.DD.YYYY'),
          endDate,
          dates,
          select,
        })
      )
    }
  }

  function copyText(entryText: any) {
    navigator.clipboard.writeText(entryText)
    toast.success("Ko'piya qilindi.")
  }

  useEffect(() => {
    if (select === 'month') {
      const day = `${dayjs(month).format('MM')}.01.${dayjs(month).format('YYYY')}`
      let nextMonth = dayjs(
        `${dayjs(month).add(1, 'month').format('MM')}.01.${dayjs(month).format('YYYY')}`
      )
        .add(-1, 'day')
        .format('DD.MM.YYYY')

      setStartDate(day)
      setDates(Number(nextMonth.split('.')[0]))
    }
  }, [month, select])

  useEffect(() => {
    if (select === 'day') {
      setStartDate(new Date().setDate(new Date().getDate() - 7))
      setEndDate(new Date())

      setDates(
        Math.floor(
          // @ts-ignore
          Number(new Date() - new Date().setDate(new Date().getDate() - 7)) / 1000 / 60 / 60 / 24 +
            4
        )
      )
    } else {
      setMonth(new Date())
      const day = `${dayjs(new Date()).format('MM')}.01.${dayjs(new Date()).format('YYYY')}`
      let nextMonth = dayjs(
        `${dayjs(new Date()).add(1, 'month').format('MM')}.01.${dayjs(new Date()).format('YYYY')}`
      )
        .add(-1, 'day')
        .format('DD.MM.YYYY')

      setStartDate(day)
      setDates(Number(nextMonth.split('.')[0]))
    }
  }, [select])

  console.log(startDate)

  useEffect(() => {
    dispatch(
      getOrders({
        startDate: `${dayjs(new Date()).format('MM')}.01.${dayjs(new Date()).format('YYYY')}`,
        endDate,
        dates,
        select,
      })
    )
  }, [])

  useEffect(() => {
    if (success) {
      dispatch(
        getOrders({
          startDate: dayjs(startDate).format('MM.DD.YYYY'),
          endDate,
          dates,
          select,
        })
      )
      setOpen(false)
    }
  }, [success])

  useEffect(() => {
    let total_price = 0
    let total_count = 0
    if (orders) {
      orders.orders.forEach(order => {
        total_count += Number(order.total_count)
        total_price += Number(order.total_price)
      })
    }
    setTotal({ total_count, total_price })
  }, [orders])
  console.log('dates', dates - 1)

  return (
    <Fragment>
      <div className='mx-auto container p-6 lg:px-8'>
        <div className='pb-10'>
          <div className='mt-8 flow-root'>
            <div className='-mx-4 -my-2 sm:-mx-6 lg:-mx-8'>
              <div className='inline-block w-full py-2 align-middle sm:px-6 lg:px-8'>
                <div className='flex justify-end items-center text-black mb-5 sm:flex-row flex-col'>
                  <div className='sm:mt-0 mt-3 sm:mr-5'>
                    <select
                      id='location'
                      name='location'
                      className='block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      value={select}
                      onChange={e => setSelect(e.target.value as typeof select)}
                    >
                      <option value='month'>Oy</option>
                      <option value='day'>Kun</option>
                    </select>
                  </div>
                  {select === 'day' ? (
                    // @ts-ignore
                    <DatePicker
                      dateFormat='dd/MM/yyyy'
                      selected={new Date(startDate)}
                      onChange={onChangeDay}
                      startDate={new Date(startDate)}
                      endDate={endDate}
                      selectsRange
                      className='indent-1 text-sm rounded block w-full p-[7px] border bg-white/5 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-white'
                    />
                  ) : (
                    <DatePicker
                      selected={month}
                      onChange={onChangeMonth}
                      showMonthYearPicker
                      dateFormat='MM/yyyy'
                      placeholderText='Click to select a month'
                      className='indent-1 text-sm rounded block w-full p-[7px] border bg-white/5 border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-white'
                    />
                  )}
                  <Button
                    onClick={search}
                    className='w-full sm:w-auto sm:mt-0 mt-3 sm:ml-5 rounded'
                  >
                    Qidirish
                  </Button>
                  <button
                    type='button'
                    className='inline-flex sm:ml-5 sm:mt-0 mt-3 justify-center rounded bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 w-full sm:w-auto'
                    onClick={reset}
                  >
                    Restart
                  </button>
                </div>
                {isLoading ? (
                  'Loading...'
                ) : !isLoading && orders?.orders?.length ? (
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
                          {[...new Array(dates)].map((_, index) => (
                            <th
                              key={index}
                              scope='col'
                              className='px-3 py-3.5 text-left text-sm font-semibold min-w-[220px]'
                            >
                              {addDay(index)}
                            </th>
                          ))}
                          <th
                            scope='col'
                            className='px-3 py-3.5 text-left text-sm font-semibold min-w-[220px]'
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-800'>
                        {orders.orders?.map(order => (
                          <tr key={order._id} className='divide-x divide-[#3e3e3e]'>
                            <td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium'>
                              {order.name}
                            </td>
                            {[...new Array(dates)].map((_, index) => (
                              <td
                                key={index}
                                scope='col'
                                className='px-3 py-3.5 text-left text-sm text-gray-300'
                              >
                                {Object.keys(
                                  order?.orders?.find(item => item.date === addDay(index)) || {}
                                ).length ? (
                                  <div
                                    onClick={() => {
                                      view({
                                        ...order?.orders?.find(item => item.date === addDay(index)),
                                        name: order.name,
                                      })
                                      setData({
                                        ...order,
                                        date: addDay(index),
                                        order: order?.orders?.find(
                                          item => item.date === addDay(index)
                                        ),
                                      })
                                      setId(
                                        order?.orders?.find(item => item.date === addDay(index))
                                          ?._id as string
                                      )
                                    }}
                                  >
                                    <p>
                                      Soni:{' '}
                                      {
                                        order?.orders?.find(item => item.date === addDay(index))
                                          ?.count
                                      }
                                    </p>
                                    <p>
                                      1tasi narxi:{' '}
                                      {getSum(
                                        order?.orders?.find(item => item.date === addDay(index))
                                          ?.price as string
                                      )}
                                    </p>
                                    <p>
                                      Narxi:{' '}
                                      {getSum(
                                        order?.orders?.find(item => item.date === addDay(index))
                                          ?.item_price as number
                                      )}
                                    </p>
                                  </div>
                                ) : (
                                  <Button onClick={() => addOrder(order, addDay(index))}>
                                    <PlusIcon className='h-5 w-5' aria-hidden='true' />
                                  </Button>
                                )}
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
Boshlanish sanasi: ${dayjs(startDate).format('DD.MM.YYYY')},
Tugash sanasi: ${addDay(Number(dates) - 1)}
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
                          <td
                            className='whitespace-nowrap px-3 py-3.5 pr-3 text-sm text-gray-300'
                            colSpan={dates + 1}
                          />
                          <td className='whitespace-nowrap px-3 py-3.5 pr-3 text-sm text-gray-300'>
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
      <Modal open={open} setOpen={setOpen} data={data} edit={edit} />
      <ViewModal
        open={openView}
        setOpen={setOpenView}
        data={dataView}
        setOpenAll={setOpen}
        setEdit={setEdit}
        openPop={openPop}
        setOpenPop={setOpenPop}
      />
      <PopConfirm open={openPop} setOpen={setOpenPop} setOpenView={setOpenView} id={id} />
    </Fragment>
  )
}

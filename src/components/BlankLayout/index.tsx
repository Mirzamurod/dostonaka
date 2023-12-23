import { FC } from 'react'
import { IBlankLayout } from '@/types/blankLayout'
import Navbar from '@/components/navbar'

const BlankLayout: FC<IBlankLayout> = ({ children }) => {
  return <Navbar>{children}</Navbar>
}

export default BlankLayout

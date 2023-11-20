import React, { ReactNode } from 'react'
import Navbar from './_components/navbar'

function MarketingLayout({children}: {
  children: ReactNode
}) {
  return (
    <div className='h-full dark:bg-[#1f1f1f]'>
      <Navbar />
      <main className='h-full pt-40'>
        {children}
      </main>
    </div>
  )
}

export default MarketingLayout
import React from 'react'
import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils'
import Image from 'next/image';


const font = Poppins({
  subsets: ['latin'],
  weight: ['400', "600"]
});

function Logo() {
  return (
    <div className='hidden md:flex items-center gap-x-2'>
      <Image 
        src='/motion-logo.svg'
        height={40}
        width={40}
        className='rounded-sm'
        alt='Logo'
      />
      <p className={cn("font-semibold", font.className)}>
        Motion
      </p>
    </div>
  )
}

export default Logo
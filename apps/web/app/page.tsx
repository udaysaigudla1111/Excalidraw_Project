import React from 'react'
import  Component  from '@repo/ui/Component'
import Component2 from '@repo/ui/Component2'
const page = () => {
  return (
    <div className='bg-red-100 h-screen'>
      <h1>page</h1>
      <Component/>
      <Component2/>
    </div>
  )
}

export default page
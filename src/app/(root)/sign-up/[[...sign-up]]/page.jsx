import { SignUp } from '@clerk/nextjs'
import React from 'react'

const SignUpPage = () => {
  return (
    <div className='flex flex-col max-w-3xl mx-auto w-full'>
        <section className='space-y-6 pt-[16vh] 2xl:pt-48'>
<SignUp/>
        </section>
    </div>
  )
}

export default SignUpPage


import AuthForm from '@/components/AuthForm'
import { signInWithCredentials } from '@/lib/actions/auth'
import { signInSchema } from '@/lib/validations'
import React from 'react'

const page = () => {
  return (
    <div className='p-16 border border-gray-200 rounded-lg bg-white'>
      <AuthForm
        type="SIGN_IN"
        schema={signInSchema}
        defaultValues={{
          email: "",
          password: "",
        }}
        onSubmit={signInWithCredentials}
      />
    </div>
  )
}

export default page
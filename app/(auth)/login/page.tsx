

import AuthForm from '@/components/AuthForm'
import { signInWithCredentials } from '@/lib/actions/auth'
import { signInSchema } from '@/lib/validations'
import React from 'react'

const page = () => {
  return (
    <div className='p-12 rounded-lg'>
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
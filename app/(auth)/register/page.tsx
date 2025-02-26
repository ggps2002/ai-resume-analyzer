
import AuthForm from '@/components/AuthForm'
import { signUp } from '@/lib/actions/auth'
import { signUpSchema } from '@/lib/validations'
import React from 'react'

const page = () => {
  return (
    <div className='p-8 lg:py-8 lg:px-24 rounded-lg'>
      <AuthForm
        type="SIGN_UP"
        schema={signUpSchema}
        defaultValues={{
          fullName: "",
          email: "",
          password: "",
        }}
        onSubmit={signUp}
      />
    </div>
  )
}

export default page

import AuthForm from '@/components/AuthForm'
import { signUp } from '@/lib/actions/auth'
import { signUpSchema } from '@/lib/validations'
import React from 'react'

const page = () => {
  return (
    <div className='py-8 px-24 border border-gray-200 rounded-lg bg-white shadow-md'>
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
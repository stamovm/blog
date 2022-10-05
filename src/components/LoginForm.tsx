import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { CreateUserInput } from '../schema/user'
import { trpc } from '../utils/trpc'

function VerifyToken({ hash }: { hash: string }) {
  const router = useRouter()
  const { data, isLoading } = trpc.useQuery([
    'users.verify-otp',
    {
      hash,
    },
  ])

  if (isLoading) {
    return <p>Verifying...</p>
  }

  router.push(data?.redirect.includes('login') ? '/' : data?.redirect || '/')

  return <p>Redirecting...</p>
}

function LoginForm() {
  const { handleSubmit, register } = useForm<CreateUserInput>()
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const { mutate, error } = trpc.useMutation(['users.request-otp'], {
    onSuccess: () => {
      setSuccess(true)
    },
  })

  function onSubmit(values: CreateUserInput) {
    mutate({ ...values, redirect: router.asPath })
  }

  const hash = router.asPath.split('#token=')[1]

  if (hash) {
    return <VerifyToken hash={hash} />
  }

  return (
    <div className="border p-4 my-4 w-min mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}

        {success && <p>Check your email</p>}
        <h1 className="text-center font-bold text-2xl text-indigo-600">
          Login
        </h1>

        <input
          className="my-4 p-4 pr-12 text-sm border border-indigo-200 rounded shadow-sm"
          type="email"
          placeholder="john.doe@mail.com"
          {...register('email')}
        />
        <button className="btn mb-4">Login</button>
      </form>

      <Link href="/register">
        <button className=" btn">Register</button>
      </Link>
    </div>
  )
}

export default LoginForm

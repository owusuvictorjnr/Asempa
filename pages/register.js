import Layout from '@/components/Layout'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { signIn, useSession } from 'next-auth/react'
import { getError } from '@/utils/error'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import axios from 'axios'
// import { redirect } from 'next/dist/server/api-utils'

export default function RegisterPage() {
  const { data: session } = useSession()

  const router = useRouter()
  const { redirect } = router.query

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/')
    }
  }, [router, redirect, session])

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm()

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.post('/api/auth/signup', {
        name,
        email,
        password,
      })
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })
      if (result.error) {
        toast.error(result.error)
      }
    } catch (err) {
      toast.error(getError(err))
    }
  }

  return (
    <Layout title="Create Account">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl capitalize font-bold">create account</h1>

        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            {...register('name', {
              required: 'Please enter your name',
            })}
            type="text"
            className="w-full"
            id="name"
            autoFocus
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            {...register('email', {
              required: 'Please enter an email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter a valid email',
              },
            })}
            type="email"
            className="w-full"
            id="email"
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            {...register('password', {
              required: 'Please enter your password',
              minLength: {
                value: 5,
                message: 'Password must be at least 5 characters',
              },
            })}
            type="password"
            className="w-full"
            id="password"
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            {...register('confirmPassword', {
              required: 'Please enter confirm password',
              validate: (value) => value === getValues('password'),
              minLength: {
                value: 5,
                message: 'Confirm password must be at least 5 characters',
              },
            })}
            type="password"
            className="w-full"
            id="confirmPassword"
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}

          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500">Password do not match</div>
            )}
        </div>

        <div className="mb-4">
          <button className="primary-btn capitalize">register</button>
        </div>

        <div className="mb-4">
          Do you have an account? &nbsp;
          <Link
            href={`/login?redirect=${redirect || '/login'}`}
            className="text-blue-600 capitalize"
          >
            login
          </Link>
        </div>
      </form>
    </Layout>
  );
}

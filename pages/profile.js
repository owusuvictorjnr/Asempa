import Layout from '@/components/Layout'
import { getError } from '@/utils/error'
import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

export default function ProfilePage() {
  const { data: session } = useSession()

  const router = useRouter()

  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    setValue('name', session.user.name)
    setValue('email', session.user.email)
  }, [session.user, setValue])

  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put('/api/auth/update', {
        name,
        email,
        password,
      })

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      toast.success('Profile updated successfully')

      router.push(`/`)

      if (result.error) {
        toast.error(result.error)
      }
    } catch (err) {
      toast.error(getError(err))
    }
  }

  return (
    <Layout title="Profile">
      <form
        onSubmit={handleSubmit(submitHandler)}
        className="mx-auto max-w-screen-md"
      >
        <h1 className="mb-4 text-xl font-bold capitalize">update profile</h1>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="w-full"
            id="name"
            autoFocus
            {...register('name', {
              required: 'Please enter a name',
            })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
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
          <button className="primary-btn capitalize">update profile</button>
        </div>
      </form>
    </Layout>
  )
}

ProfilePage.auth = true

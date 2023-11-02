import { Store } from '@/utils/Store'
import { signOut, useSession } from 'next-auth/react'
import Head from 'next/head'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { Menu } from '@headlessui/react'
import 'react-toastify/dist/ReactToastify.css'
import DropdownLink from './DropdownLink'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import SearchIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon'

export default function Layout({ children, title }) {
  const { status, data: session } = useSession()

  const { state, dispatch } = useContext(Store)
  const { cart } = state
  const [cartItemsCount, setCartItemsCount] = useState(0)
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0))
  }, [cart.cartItems])

  const logoutCircleHandler = () => {
    Cookies.remove('cart')
    dispatch({ type: 'CART_RESET' })
    signOut({ callbackUrl: '/login' })
  }

  const [query, setQuery] = useState('')

  const router = useRouter()

  const submitHandler = (e) => {
    e.preventDefault()
    router.push(`search?query=${query}`)
  }
  return (
    <>
      <Head>
        <title>{title ? title + ' Asempa Brand' : 'Asempa Brand'}</title>
        <meta name="description" content="Where Quality Meets Affordability" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between">
        <headers className=''>
          <nav className="flex fixed top-0 bottom-0 bg-yellow-500 z-10 w-full h-12 justify-between  items-center shadow-md px-5">
            <div className="flex items-center z-10">
              <Link
                href="/"
                className="text-sm md:text-lg font-bold capitalize text-blue-500 flex"
              >
                asempa brand
              </Link>
            </div>

            {/* Search button */}
            <form
              className="mx-auto justify-center md:flex"
              onSubmit={submitHandler}
            >
              <input
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search products"
                className="p-1 text-sm rounded-tr-none rounded-br-none focus:ring-0"
              />

              <button
                type="submit"
                id="button-addon2"
                className="rounded rounded-tl-none rounded-bl-none hidden md:flex  bg-amber-300 p-1 text-sm dark:text-black"
              >
                <SearchIcon className="h-5 w-5 " />
              </button>
            </form>

            <div className="flex items-center z-10">
              <Link
                href="/cart"
                className="p-2 text-blue-600 text-sm md:text-lg"
              >
                Cart
                {cartItemsCount > 0 && (
                  <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {status === 'loading' ? (
                'Loading'
              ) : session?.user ? (
                <Menu as="div" className="relative inline-block">
                  <Menu.Button className="text-blue-600 text-sm md:text-lg">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg z-10">
                    {/* Profile */}
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        profile
                      </DropdownLink>
                    </Menu.Item>

                    {/* Order History */}
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="/order-history"
                      >
                        order history
                      </DropdownLink>

                      {/* Admin dashboard */}
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className="dropdown-link"
                          href="/admin/dashboard"
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}

                    {/* Log Out */}
                    <Menu.Item>
                      <DropdownLink
                        className="dropdown-link"
                        href="#"
                        onClick={logoutCircleHandler}
                      >
                        logout
                      </DropdownLink>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login" className="p-2 text-blue-600">
                  Login
                </Link>
              )}
            </div>
          </nav>
        </headers>

        <main className="container m-auto mt-4 px-4">{children}</main>

        {/* Footer */}

        <footer className="flex h-[10rem] justify-center items-center shadow-inner">
          <p>Copyright &copy; 2023 Asempa Brand</p>
        </footer>
      </div>
    </>
  )
}

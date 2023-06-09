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

  return (
    <>
      <Head>
        <title>{title ? title + ' Asempa Brand' : 'Asempa Brand'}</title>
        <meta name="description" content="Where Quality Meets Affordability" />
      </Head>

      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 justify-between items-center shadow-md px-4">
            <Link
              href="/"
              className="text-lg font-bold capitalize text-yellow-500"
            >
              asempa brand
            </Link>
            <div>
              <Link href="/cart" className="p-2 text-blue-600">
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
                  <Menu.Button className="text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg">
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
        </header>

        <main className="container m-auto mt-4 px-4">{children}</main>

        <footer className="flex h-[10rem] justify-center items-center shadow-inner">
          <p>Copyright &copy; 2023 Asempa Brand</p>
        </footer>
      </div>
    </>
  )
}

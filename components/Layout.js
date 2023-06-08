import { Store } from '@/utils/Store'
import Head from 'next/head'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'

export default function Layout({ children, title }) {
  const { state } = useContext(Store)
  const { cart } = state
  const [cartItemsCount, setCartItemsCount] = useState(0)
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0))
  }, [cart.cartItems])

  return (
    <>
      <Head>
        <title>{title ? title + ' Asempa Brand' : 'Asempa Brand'}</title>
        <meta name="description" content="Where Quality Meets Affordability" />
      </Head>

      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 justify-between items-center shadow-md px-4">
            <Link href="/" className="text-lg font-bold capitalize">
              asempa brand
            </Link>
            <div>
              <Link href="/cart" className="p-2">
                Cart
                {cartItemsCount > 0 && (
                  <span className="ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              <Link href="/login" className="p-2">
                Login
              </Link>
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

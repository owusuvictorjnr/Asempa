import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

export default function Layout({ children, title }) {
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

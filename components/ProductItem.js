/* eslint-disable @next/next/no-img-element */
import React from 'react'
import Link from 'next/link'

export default function ProductItem({ product, addToCartHandler }) {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded shadow"
        />
      </Link>

      <div className="flex flex-col items-center justify-center">
        <Link href={`/product/${product.slug}`}>
          <h1 className="text-lg">{product.name}</h1>
        </Link>

        <p className="mb-2">{product.brand}</p>
        <p>${product.price}</p>
        <button
          className="primary-btn"
          type="button"
          onClick={() => addToCartHandler(product)}
        >
          Add to cart
        </button>
      </div>
    </div>
  )
}

'use client';

import { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <div key={product.id} className="p-4 bg-white rounded shadow">
          <Link href={`/product/${product.id}`}>
            <img src={product.image} alt={product.title} className="h-40 w-full object-contain" />
          </Link>
          <h2 className="font-bold mt-2">{product.title}</h2>
          <p>${product.price}</p>
          <button
            onClick={() => addToCart(product)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

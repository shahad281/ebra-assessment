'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '../../CartContext';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');
        const data: Product = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="p-4 bg-white rounded shadow max-w-md mx-auto">
      <img src={product.image} alt={product.title} className="h-64 w-full object-contain" />
      <h1 className="text-2xl font-bold mt-2">{product.title}</h1>
      <p className="mt-1">{product.description}</p>
      <p className="mt-1 font-semibold">Category: {product.category}</p>
      <p className="mt-1 font-bold text-lg">${product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}

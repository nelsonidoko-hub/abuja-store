import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { searchProducts } from '../services/productService'

function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      const data = await searchProducts(query)
      setProducts(data)
      setLoading(false)
    }
    fetch()
  }, [query])

  return (
    <div className="px-6 md:px-10 py-8">
      <h2 className="text-xl mb-6">
        Search results for <span className="font-bold">"{query}"</span>
      </h2>

      {loading ? (
        <p>Searching...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchResults
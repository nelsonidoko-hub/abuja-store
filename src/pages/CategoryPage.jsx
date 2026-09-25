import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { getProductsByCategory } from '../services/productService'

function CategoryPage() {
  const { categoryName } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByCategory(categoryName)
        setProducts(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [categoryName])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 capitalize">{categoryName}</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 min-[321px]:grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4 gap-6 font-epilogue">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryPage
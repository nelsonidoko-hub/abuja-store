import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getProductById, createProduct, updateProduct } from '../../services/productService'
import { uploadImage } from '../../services/uploadService'

function ProductForm() {
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [sizeStock, setSizeStock] = useState([{ size: '', stock: '' }])
  const [form, setForm] = useState({
    name: '',
    price: '',
    oldPrice: '',
    onSale: false,
    bestSeller: false,
    category: '',
    image: '',
    hoverImage: '',
    images: [],
    sizes: '',
    description: '',
  })
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [galleryUploading, setGalleryUploading] = useState(false)

  useEffect(() => {
    if (isEditMode) {
      getProductById(id).then((data) => {
        setForm({
          ...data,
          oldPrice: data.oldPrice ?? '',
          onSale: Boolean(data.onSale),
          bestSeller: Boolean(data.bestSeller),
          images: data.images || [],
        })
        setSizeStock(data.sizes || [{ size: '', stock: '' }])
      })
    }
  }, [id])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSizeChange(index, field, value) {
    const updated = [...sizeStock]
    updated[index][field] = value
    setSizeStock(updated)
  }

  function addSizeRow() {
    setSizeStock([...sizeStock, { size: '', stock: '' }])
  }

  function removeSizeRow(index) {
    setSizeStock(sizeStock.filter((_, i) => i !== index))
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file, user.token)
      setForm((prev) => ({ ...prev, image: url }))
    } catch (err) {
      setError('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleHoverImageUpload(e) {
    const file = e.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file, user.token)
      setForm((prev) => ({ ...prev, hoverImage: url }))
    } catch (err) {
      setError('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  // Gallery supports multiple files at once (back view, another color, etc.)
  async function handleGalleryUpload(e) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setGalleryUploading(true)
    try {
      const urls = await Promise.all(files.map((file) => uploadImage(file, user.token)))
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }))
    } catch (err) {
      setError('Gallery image upload failed')
    } finally {
      setGalleryUploading(false)
      e.target.value = '' // allow re-selecting the same file(s) later
    }
  }

  function removeGalleryImage(index) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const payload = {
      ...form,
      price: Number(form.price),
      oldPrice: form.onSale && form.oldPrice ? Number(form.oldPrice) : null,
      onSale: Boolean(form.onSale),
      bestSeller: Boolean(form.bestSeller),
      sizes: sizeStock
        .filter((s) => s.size.trim())
        .map((s) => ({ size: s.size.trim(), stock: Number(s.stock) || 0 })),
    }

    try {
      if (isEditMode) {
        await updateProduct(id, payload, user.token)
      } else {
        await createProduct(payload, user.token)
      }
      navigate('/admin/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed')
    }
  }

  return (
    <div className="max-w-md pt-30">
      <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit' : 'Add'} Product</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border rounded-md p-2"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="border rounded-md p-2"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="border rounded-md p-2"
        >
          <option value="">Select category</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
          <option value="clothes">Clothes</option>
          <option value="adire">Adire</option>
          <option value="shoes">Shoes</option>
          <option value="bags">Bags</option>
          <option value="accessories">Accessories</option>
        </select>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Main Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
          {form.image && (
            <img src={form.image} alt="Preview" className="w-24 h-24 object-cover mt-2 rounded" />
          )}
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Back/Hover Image (optional)</label>
          <input type="file" accept="image/*" onChange={handleHoverImageUpload} />
          {form.hoverImage && (
            <img src={form.hoverImage} alt="Hover preview" className="w-24 h-24 object-cover mt-2 rounded" />
          )}
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">
            Gallery Images (optional — other angles, colors, etc.)
          </label>
          <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} />
          {galleryUploading && <p className="text-sm text-gray-500">Uploading...</p>}
          {form.images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.images.map((url, index) => (
                <div key={url} className="relative">
                  <img src={url} alt={`Gallery ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute -top-2 -right-2 bg-gray-900 text-white w-5 h-5 rounded-full text-xs leading-none flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-2">Sizes & Stock</label>
          {sizeStock.map((row, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                placeholder="Size (e.g. M)"
                value={row.size}
                onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                className="border rounded-md p-2 flex-1"
              />
              <input
                type="number"
                placeholder="Stock"
                value={row.stock}
                onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                className="border rounded-md p-2 w-24"
              />
              <button type="button" onClick={() => removeSizeRow(index)} className="text-red-500 px-2">
                ✕
              </button>
            </div>
          ))}
          <button type="button" onClick={addSizeRow} className="text-blue-600 text-sm hover:underline">
            + Add size
          </button>
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border rounded-md p-2"
        />

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.onSale}
            onChange={(e) => setForm((prev) => ({ ...prev, onSale: e.target.checked }))}
          />
          On Sale
        </label>

        {form.onSale && (
          <input
            name="oldPrice"
            type="number"
            placeholder="Original price (before discount)"
            value={form.oldPrice}
            onChange={handleChange}
            className="border rounded-md p-2"
          />
        )}

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.bestSeller}
            onChange={(e) => setForm((prev) => ({ ...prev, bestSeller: e.target.checked }))}
          />
          Best Seller
        </label>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          {isEditMode ? 'Update' : 'Create'} Product
        </button>
      </form>
    </div>
  )
}

export default ProductForm
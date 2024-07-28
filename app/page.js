"use client";
import { useState, useEffect } from 'react';
import Header from "./components/Header";

export default function Home() {
  const [productForm, setProductForm] = useState({ slug: '', quantity: '', price: '' });
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingaction, setLoadingaction] = useState(false);
  const [dropdown, setDropdown] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/product');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const rjson = await response.json();
        setProducts(rjson.products || []); // Ensure products is an array
        console.log('Fetched products:', rjson.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };
    fetchProducts();
  }, []);

  const buttonAction = async (action, slug, initialQuantity) => {
    //immediately the slug of the quantity of the product with given slug in products
    let index = products.findIndex((item) => item.slug === slug);
    let newProducts = JSON.parse(JSON.stringify(products));
    if (action === "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
    setProducts(newProducts);

    //immediately the slug of the quantity of the product with given s
    let indexDrop = dropdown.findIndex((item) => item.slug === slug);
    let newDropdown = JSON.parse(JSON.stringify(dropdown));
    if (action === "plus") {
      newDropdown[indexDrop].quantity = parseInt(initialQuantity) + 1;
    } else {
      newDropdown[indexDrop].quantity = parseInt(initialQuantity) - 1;
    }
    setDropdown(newDropdown);

    console.log(action, slug);
    setLoadingaction(true);
    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, slug, initialQuantity }),
    });
    const r = await response.json();
    console.log(r);

    // Update the quantity in the products state
    if (r.success) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.slug === slug ? { ...product, quantity: r.newQuantity } : product
        )
      );
    }

    setLoadingaction(false);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const result = await response.json();
      console.log('Product added:', result);

      if (result.product) {
        setAlert("Your product has been added!");
        setProducts([...products, result.product]); // Add new product to state
        setProductForm({ slug: '', quantity: '', price: '' }); // Clear the form

        // Reset the alert after 3 seconds
        setTimeout(() => setAlert(""), 1000);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      setAlert("Failed to add product!");
      // Reset the alert after 3 seconds
      setTimeout(() => setAlert(""), 1000);
    }
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropdownEdit = async (e) => {
    if (!loading) {
      setLoading(true);
      setDropdown([]);
      setQuery(e.target.value);
      const response = await fetch('/api/search?query=' + query);
      const rjson = await response.json();
      setDropdown(rjson.products);
      setLoading(false);
    } else {
      setDropdown([]);
    }
  };

  return (
    <>
      <Header />
      <div className='container mx-auto p-4'>
        {alert && <div className='text-center text-green-800'>{alert}</div>}
        <h1 className='text-3xl font-semibold mb-6'>Search a Product</h1>
        <div className='flex flex-col md:flex-row mb-2'>
          <input
            onChange={onDropdownEdit}
            type="text"
            placeholder='Enter a product name'
            className='border border-gray-300 px-4 py-2 rounded-l-md w-full md:flex-1'
          />
          <select className="border border-gray-300 px-4 py-2 rounded-r-md w-full md:flex-1 mt-2 md:mt-0">
            <option value="">All</option>
            <option value="Category1">Category 1</option>
            <option value="Category2">Category 2</option>
          </select>
        </div>
        {loading && <div className='flex justify-center items-center'>
          <svg fill="#000000" height="50px" width="50px" viewBox='0 0 50 50'>
            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="#000" strokeDasharray="31.415, 31.415" strokeDashoffset="0">
              <animate attributeName='strokeDashoffset' repeatCount="indefinite" dur="1.5s" from="0" to="62.83" />
              <animate attributeName='strokeDasharray' repeatCount="indefinite" values='31.415, 31.415; 0,62.83; 31.415, 31.415' />
            </circle>
          </svg>
        </div>}
        <div className="dropContainer absolute w-full border-1 bg-purple-100 rounded-md">
          {dropdown.map(item => (
            <div key={item.slug} className="container flex justify-between p-2 my-1 border-b-2">
              <span className='slug'>{item.slug} ({item.quantity} available for ₹{item.price})</span>
              <div className='mx-5'>
                <button
                  onClick={() => buttonAction("plus", item.slug, parseInt(item.quantity))}
                  disabled={loadingaction}
                  className='add px-4 py-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-full shadow-md cursor-pointer disabled:bg-purple-200'
                >
                  +
                </button>
                <span className='quantity mx-3'>{item.quantity}</span>
                <button
                  onClick={() => buttonAction("minus", item.slug, parseInt(item.quantity))}
                  disabled={loadingaction}
                  className='subtract px-4 py-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-full shadow-md cursor-pointer disabled:bg-purple-200'
                >
                  -
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto p-4">
        <h1 className='text-3xl font-semibold mb-4'>Add a Product</h1>
        <form onSubmit={addProduct} className="mb-4">
          <div className="mb-2">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              name="slug"
              id="slug"
              value={productForm.slug}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              id="quantity"
              value={productForm.quantity}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              value={productForm.price}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-md shadow-md"
          >
            Add Product
          </button>
        </form>
        <h2 className="text-2xl font-semibold mb-4">Current Inventory</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Slug</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.slug}>
                  <td className="py-2 px-4 border-b">{product.slug}</td>
                  <td className="py-2 px-4 border-b">{product.quantity}</td>
                  <td className="py-2 px-4 border-b">₹{product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

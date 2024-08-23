import AdminHeader from "../../../components/adminHeader/adminHeader";
// import "./adminAddProductPage.css";
import { useState } from "react";
import ProductForm from "../../../components/productForm/productForm";

function AdminAddProductPage() {
  const handleAddProduct = async (productData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const data = await response.json();
      console.log("Product added successfully:", data);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  return (
    <>
      <AdminHeader />
      {/* <form className="addProductForm" onSubmit={handleSubmit}>
        <div>
          <h1>Product name:</h1>
          <input
            type="text"
            name="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        <div>
          <h1>Image URL: </h1>
          <input
            type="text"
            name="imageURL"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
          />
        </div>

        <div>
          <h1>Price:</h1>
          <input
            type="number"
            name="productPrice"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
        </div>

        <div>
          <h1>Category:</h1>
          <select
            name="status"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="bracelets">Bracelets</option>
            <option value="chains">Chains</option>
            <option value="rings">Rings</option>
            <option value="earrings">Earrings</option>
          </select>
        </div>

        <div>
          <h1>Status:</h1>
          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="trending">Trending</option>
            <option value="new-arrival">New Arrival</option>
          </select>
        </div>

        <h1>Description:</h1>
        <ReactQuill
          value={productDescription}
          onChange={setProductDescription}
          modules={AdminAddProductPage.modules}
          formats={AdminAddProductPage.formats}
        />

        <button type="submit" className="addProductBtn">
          Add Product
        </button>
      </form> */}
      <ProductForm onSubmit={handleAddProduct} />
    </>
  );
}

export default AdminAddProductPage;

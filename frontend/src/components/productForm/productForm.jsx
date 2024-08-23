import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./productForm.css";

function ProductForm({ product, onSubmit }) {
  const [productName, setProductName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("normal");
  const [productDescription, setProductDescription] = useState("");

  useEffect(() => {
    if (product) {
      setProductName(product.title);
      setImageURL(product.imageUrl);
      setProductPrice(product.price);
      setCategory(product.category);
      setStatus(product.status);
      setProductDescription(product.description);
    }
  }, [product]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const productData = {
      title: productName,
      imageUrl: imageURL,
      price: productPrice,
      description: productDescription,
      category: category,
      status: status,
    };

    onSubmit(productData);
  };

  return (
    <form className="addProductForm" onSubmit={handleSubmit}>
      <div>
        <h1>Product name:</h1>
        <input
          type="text"
          name="productName"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>

      <div>
        <h1>Image URL: </h1>
        <input
          type="text"
          name="imageURL"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          required
        />
      </div>

      <div>
        <h1>Price:</h1>
        <input
          type="number"
          name="productPrice"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          required
        />
      </div>

      <div>
        <h1>Category:</h1>
        <select
          name="status"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
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
          required
        >
          <option value="normal">Normal</option>
          <option value="trending">Trending</option>
          <option value="new-arrival">New Arrival</option>
        </select>
      </div>

      <h1>Description:</h1>
      <ReactQuill
        name="description"
        value={productDescription}
        onChange={setProductDescription}
        modules={ProductForm.modules}
        formats={ProductForm.formats}
      />

      <button type="submit" className="addProductBtn">
        {product ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}

ProductForm.modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};

ProductForm.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];

export default ProductForm;

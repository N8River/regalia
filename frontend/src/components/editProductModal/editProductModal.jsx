import { useState, useEffect } from "react";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import TextEditor from "../textEditor/textEditor";
import { BsImage } from "react-icons/bs";
import { useToast } from "../../context/ToastContext";
import "./editProductModal.css";

function EditProductModal({ product, onProductUpdated, onClose }) {
  const [title, setTitle] = useState(product.title);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState(product.price);
  const [status, setStatus] = useState(product.status);
  const [imageUrl, setImageUrl] = useState(product.imageUrl || "");
  const [description, setDescription] = useState(product.description || "");

  const addToast = useToast(); // Use toast context

  const validateInputs = () => {
    if (!title.trim()) {
      addToast("Title is required.", "error");
      return false;
    }
    if (!category) {
      addToast("Category is required.", "error");
      return false;
    }
    if (!price || isNaN(price) || price <= 0) {
      addToast("Price must be a positive number.", "error");
      return false;
    }
    if (!description || description.trim() === "") {
      addToast("Description is required.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return; // Stop submission if validation fails

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${product._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            title,
            category,
            price,
            status,
            imageUrl,
            description,
          }),
        }
      );

      if (response.ok) {
        onProductUpdated();
        addToast("Product updated successfully!", "success");
        onClose();
      } else {
        addToast("Failed to update product.", "error");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      addToast("An error occurred while updating the product.", "error");
    }
  };

  return (
    <>
      <div className="editProductModal-overlay" onClick={onClose}></div>
      <div className="editProductModal">
        <div className="editProductModalHeader">
          <button
            type="submit"
            className="editProductBtn"
            onClick={handleSubmit}
          >
            Update Product
          </button>
          <button className="editProductModalClose-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="editProductModalForm">
          {/* Image Preview */}
          <div className="editImageModalPreview">
            {imageUrl ? (
              <img src={imageUrl} alt="Product Preview" />
            ) : (
              <BsImage />
            )}
          </div>

          <div className="editProductModalFormInputFields">
            <input
              type="text"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="bracelets">Bracelets</option>
              <option value="chains">Chains</option>
              <option value="rings">Rings</option>
              <option value="earrings">Earrings</option>
            </select>

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="normal">Normal</option>
              <option value="trending">Trending</option>
              <option value="new-arrival">New Arrival</option>
            </select>

            <TextEditor onChange={setDescription} value={description} />
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProductModal;

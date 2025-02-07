import { useState } from "react";
import TextEditor from "../textEditor/textEditor";
import { BsImage } from "react-icons/bs";
import { useToast } from "../../context/ToastContext";
import "./addProductModal.css";

function AddProductModal({ onProductAdded, onClose }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("bracelets");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("normal");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  const addToast = useToast(); // Use toast context for notifications

  // Check if the image URL points to a loadable image
  const validateImageUrl = async (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true); // Image exists and loads successfully
      img.onerror = () => resolve(false); // Image fails to load
      img.src = url;
    });
  };

  const validateInputs = async () => {
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
    if (!status) {
      addToast("Status is required.", "error");
      return false;
    }
    if (!imageUrl || !/^https?:\/\/\S+\.\S+$/.test(imageUrl)) {
      addToast("A valid image URL is required.", "error");
      return false;
    }

    const isImageValid = await validateImageUrl(imageUrl);
    if (!isImageValid) {
      addToast("The provided image URL is not valid or doesn't load.", "error");
      return false;
    }

    if (!description || description.trim() === "") {
      addToast("Description is required.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!(await validateInputs())) return; // Stop submission if validation fails

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/add-product`,
        {
          method: "POST",
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
        onProductAdded(); // Refresh products list
        addToast("Product added successfully!", "success");
        onClose(); // Close the modal
      } else {
        addToast("Failed to add product.", "error");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      addToast("An error occurred while adding the product.", "error");
    }
  };

  return (
    <>
      <div className="addProductModal-overlay" onClick={onClose}></div>
      <div className="addProductModal">
        <div className="addProductModalHeader">
          <button
            type="submit"
            className="addProductBtn"
            onClick={handleSubmit}
          >
            Add Product
          </button>
          <button className="addProductModalClose-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="addProductModalForm">
          <div className="addImageModalPreview">
            {imageUrl ? (
              <img src={imageUrl} alt="Product Preview" />
            ) : (
              <BsImage />
            )}
          </div>

          <div className="addProductModalFormInputFields">
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

export default AddProductModal;

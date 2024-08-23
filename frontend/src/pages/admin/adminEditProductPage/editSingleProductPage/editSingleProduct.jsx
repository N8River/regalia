import AdminHeader from "../../../../components/adminHeader/adminHeader";
import ProductForm from "../../../../components/productForm/productForm";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
// import { useHistory } from "react-router-dom";

function EditSingleProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  // const history = useHistory();
  // console.log(history);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error("Error fetching product:", error));
  }, [productId]);

  const handleEditProduct = async (productData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );
      console.log(productData);

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const data = await response.json();
      console.log("Product updated successfully:", data);
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <>
      <AdminHeader />
      {product ? (
        <ProductForm product={product} onSubmit={handleEditProduct} />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default EditSingleProductPage;

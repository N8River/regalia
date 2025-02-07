import { useEffect, useState } from "react";
import AddProductModal from "../../../components/addProductModal/addProductModal";
import EditProductModal from "../../../components/editProductModal/editProductModal";
import ConfirmationModal from "../../../components/confirmationModal/confirmationModal";
import "./products.css";
import { IoIosAdd } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
import { useToast } from "../../../context/ToastContext";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToDeleteName, setProductToDeleteName] = useState(""); // Store product name for modal

  const addToast = useToast();

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(sortedProducts);
  };

  useEffect(() => {
    const results = products.filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchQuery, products]);

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/admin/products/${productToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      addToast("Product deleted", "success");
      fetchProducts(); // Refresh products after deletion
    } catch (error) {
      console.error("Failed to delete product:", error);
      addToast("Failed to delete product.", "error");
    } finally {
      setIsConfirmModalOpen(false); // Close confirmation modal
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const confirmDeleteProduct = (productId, productName) => {
    setProductToDelete(productId);
    setProductToDeleteName(productName); // Set product name for modal
    setIsConfirmModalOpen(true);
  };

  return (
    <div className="products-section">
      <div className="adminProductsSearchWrapper">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          className="adminProductsSearchInput"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <CiSearch className="searchIcon" />
        <button
          className="adminProductsAddProductBtn"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Product
          <IoIosAdd />
        </button>
      </div>

      <table className="adminProductsTable">
        <thead>
          <tr>
            <th onClick={() => handleSort("_id")}>Product ID</th>
            <th onClick={() => handleSort("title")}>Title</th>
            <th onClick={() => handleSort("category")}>Category</th>
            <th onClick={() => handleSort("price")}>Price</th>
            <th onClick={() => handleSort("status")}>Status</th>
            <th className="actionsTable">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
              <td>{product._id.slice(-5).toUpperCase()}</td>
              <td>{product.title}</td>
              <td>{product.category}</td>
              <td>₹{product.price}</td>
              <td>{product.status}</td>
              <td className="actionsTable">
                <button
                  className="editAdminProductBtn"
                  onClick={() => openEditModal(product)}
                >
                  Edit
                </button>
                <button
                  className="deleteAdminProductBtn"
                  onClick={() =>
                    confirmDeleteProduct(product._id, product.title)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isAddModalOpen && (
        <AddProductModal
          onProductAdded={fetchProducts}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {isEditModalOpen && (
        <EditProductModal
          product={selectedProduct}
          onProductUpdated={fetchProducts}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {isConfirmModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this product?"
          productName={productToDeleteName} // Pass product name to modal
          onConfirm={handleDelete}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Products;

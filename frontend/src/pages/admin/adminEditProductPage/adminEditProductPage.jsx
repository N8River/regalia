import AdminHeader from "../../../components/adminHeader/adminHeader";
import AdminProductCard from "../../../components/adminProductCard/adminProductCard";
import "./adminEditProductPage.css";
import { useEffect, useState } from "react";

function AdminEditProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <AdminHeader />
      <div className="adminProductList">
        {products.map((p) => {
          return <AdminProductCard key={p._id} product={p} />;
        })}
      </div>
    </>
  );
}

export default AdminEditProductPage;

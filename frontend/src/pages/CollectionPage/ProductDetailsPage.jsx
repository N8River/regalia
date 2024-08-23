import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCollection from "./productCollection/productCollection";
import ProductDetails from "../../components/productDetails/ProductDetails";
import AnnouncementBar from "../../components/announcementBar/announcementBar";

function ProductDetailsPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [productId]);

  if (!product) return <p>Product not found</p>;

  return (
    <>
      <AnnouncementBar />
      <Header />
      <div className="content">
        <ProductDetails product={product} />
        <Footer />
      </div>
    </>
  );
}

export default ProductDetailsPage;

import "./adminProductCard.css";

function adminProductCard({ product }) {
  const deleteHandler = async () => {
    console.log(product._id);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${product._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // const data = await response.json();
      // console.log("Product deleted successfully:", data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="adminProductCard">
      <div className="adminProductImgContainer">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="adminProductImg"
        />
      </div>
      <div className="adminProductName">
        <h1>{product.title}</h1>
      </div>

      <div className="editDeleteBtns">
        <button className="editProductBtn">
          <a href={"./edit-product/" + product._id}>EDIT</a>
        </button>
        <button onClick={deleteHandler} className="deleteProductBtn">
          DELETE
        </button>
      </div>
    </div>
  );
}

export default adminProductCard;

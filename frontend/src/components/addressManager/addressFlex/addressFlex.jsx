import "./addressFlex.css";

function AddressFlex({ address, toggleForm, fetchAddress }) {
  const token = localStorage.getItem("token");

  const deletehandler = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/delete-address/${
          address._id
        }`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }
    } catch (error) {
      console.log("Error deleting address:", error);
    }
  };

  const setDefaultHandler = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/set-default-address/${address._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to set address as default");
      }

      const responseData = await response.json();
      console.log(responseData.message);

      fetchAddress();
    } catch (error) {
      console.log("Error setting address as default:", error);
    }
  };

  return (
    <div className="addressCard">
      <h2>{address.isDefault ? "DEFAULT" : "OTHER"} ADDRESS</h2>
      <div className="addressInfo">
        <p>{address.line1}</p>
        <p>{address.line2}</p>
        <p>{address.city}</p>
        <p>{address.state}</p>
        <p>{address.zip}</p>
        <p>{address.country}</p>
      </div>
      <div className="addressBtns">
        <button className="linkBtn" onClick={() => toggleForm(address)}>
          <p>Edit</p>
        </button>
        <button className="linkBtn" onClick={deletehandler}>
          <p>Delete</p>
        </button>
        {!address.isDefault ? (
          <button onClick={setDefaultHandler} className="linkBtn">
            <p>Set as default</p>
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default AddressFlex;

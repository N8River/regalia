import { IoAddCircleOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import { MdOutlineChevronLeft } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

import "./addressManager.css";
import AddressFlex from "./addressFlex/addressFlex";
import useUserInfo from "../../hooks/useUserInfo";

function AddressManager() {
  const navigate = useNavigate();

  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");

  const [formVisible, setFormVisible] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);

  const [addresses, setAddresses] = useState([]); // Ensure it's always an array

  const userInfo = useUserInfo();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data = await response.json();
      setAddresses(data || []); // Ensure it's always an array
    } catch (error) {
      console.log("Error fetching addresses:", error);
    }
  };

  const toggleForm = (address = null) => {
    setLine1(address?.line1 || "");
    setLine2(address?.line2 || "");
    setCity(address?.city || "");
    setState(address?.state || "");
    setZip(address?.zip || "");
    setCountry(address?.country || "");
    setEditAddressId(address?._id || null);

    setFormVisible(!formVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const addressData = {
      line1,
      line2,
      city,
      state,
      zip,
      country,
    };

    try {
      const url = editAddressId
        ? `${
            import.meta.env.VITE_BACKEND_URL
          }/api/user/update-address/${editAddressId}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/user/create-address`;

      const method = editAddressId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      });

      if (!response.ok) {
        throw new Error("Failed to save address");
      }

      setLine1("");
      setLine2("");
      setCity("");
      setState("");
      setZip("");
      setCountry("");
      setFormVisible(false);
      setEditAddressId(null);

      fetchAddress();
    } catch (error) {
      console.log("Error saving address:", error);
    }
  };

  const handleNavigation = () => {
    navigate("/account");
  };

  return (
    <>
      <div
        onClick={toggleForm}
        className={`overlayAddressForm ${formVisible ? "show" : ""}`}
      ></div>
      <div className="addressManager">
        <div className="goToAccount" onClick={handleNavigation}>
          <MdOutlineChevronLeft /> <p>GO TO ACCOUNT</p>
        </div>

        <h2>Your Addresses</h2>
        <button className="btn" onClick={toggleForm}>
          <big>Create new address</big>
          <IoAddCircleOutline />
        </button>

        {formVisible && (
          <form className="addressForm" onSubmit={handleSubmit}>
            <div>
              <button
                onClick={() => toggleForm()}
                className="closeAddressFormBtn"
                type="button"
              >
                <IoIosClose />
              </button>
            </div>
            <p>Address Line 1:</p>
            <input
              type="text"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              required
            />
            <p>Address Line 2:</p>
            <input
              type="text"
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
            />
            <p>City</p>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <p>State</p>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
            <p>Zip</p>
            <input
              type="number"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              required
            />
            <p>Country</p>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
            <button className="btn" type="submit">
              {editAddressId ? "Update Address" : "Save Address"}
            </button>
          </form>
        )}

        <div className="addressFlex">
          {addresses.length > 0 ? (
            addresses
              .sort((a, b) =>
                a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1
              )
              .map((address, index) => (
                <AddressFlex
                  toggleForm={toggleForm}
                  key={index}
                  address={address}
                  fetchAddress={fetchAddress}
                />
              ))
          ) : (
            <p>No addresses available.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default AddressManager;

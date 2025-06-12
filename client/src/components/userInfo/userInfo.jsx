import React, { useEffect, useState } from "react";
import axios from "axios";
import "./userInfo.css";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SwipeOrder from "../SwipeOrder/SwipeOrder";

const UserInfo = ({
  selectedChoice,
  totalPreparationTime,
  sendOrderToBackend = () => {},
  cart = {}, 
  food_list = {},
  setTableNumber = () => {},
  tableNumber = "",
}) => {
  const navigate = useNavigate();

  console.log(
    "UserInfo.jsx - Received totalPreparationTime prop:",
    totalPreparationTime
  );
  const [mostRecentUserInfo, setMostRecentUserInfo] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const [form, setForm] = useState({
    orderType: selectedChoice || "Dine In", 
    name: "",
    number: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    table: "",
  });
  const [swiped, setSwiped] = useState(false);

  // update orderType in form state when selectedChoice changes
  useEffect(() => {
    const newOrderType = selectedChoice; 
    console.log(
      "selectedChoice changed to:",
      selectedChoice,
      "setting form.orderType to:",
      newOrderType
    );
    setForm((prevForm) => ({
      ...prevForm,
      orderType: selectedChoice,
      street: selectedChoice === "Dine In" ? "" : prevForm.street,
      city: selectedChoice === "Dine In" ? "" : prevForm.city,
      state: selectedChoice === "Dine In" ? "" : prevForm.state,
      zipCode: selectedChoice === "Dine In" ? "" : prevForm.zipCode,
      country: selectedChoice === "Dine In" ? "" : prevForm.country,
    }));
    if (selectedChoice !== "Dine In") {
      setTableNumber("");
    }
    setMostRecentUserInfo(null);
    setShowForm(true);
  }, [selectedChoice]);

  // Handler for updating form fields
  const updateFormField = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleTableNumberChange = (e) => {
    setTableNumber(e.target.value); 
  };

  // Handler for form submission (POST request)
  const createForm = async (e) => {
    e.preventDefault();
    console.log("Sending form data:", form);
    const payload = {
      ...form,
      ...(selectedChoice === "Dine In" && { table: tableNumber }),
    };
    console.log("Sending UserInfo form data:", payload);

    try {
      // Send the form data to the backend
      const res = await axios.post(
        "https://foodapp-server-t1i3.onrender.com/api/food",
        payload
      );
      // console.log("Received response data:", res.data);
      setMostRecentUserInfo(JSON.parse(JSON.stringify(payload)));

      setShowForm(false);
      setForm({
        orderType: selectedChoice, 
        name: "",
        number: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      });
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };

  const handleEdit = () => {
    if (mostRecentUserInfo) {
      setForm({
        orderType:
          mostRecentUserInfo.orderType ||
          (selectedChoice === "Dine In" ? "Dine In" : "Take Away"), 
        name: mostRecentUserInfo.name || "",
        number: mostRecentUserInfo.number || "",
        street: mostRecentUserInfo.street || "",
        city: mostRecentUserInfo.city || "",
        state: mostRecentUserInfo.state || "",
        zipCode: mostRecentUserInfo.zipCode || "",
        country: mostRecentUserInfo.country || "",
        table: mostRecentUserInfo.table || "",
      });
      setTableNumber(mostRecentUserInfo.table || ""); 
      setShowForm(true);
    }
  };
  console.log("UserInfo.jsx - Rendering with selectedChoice:", selectedChoice);
  // setForm(JSON.parse(JSON.stringify(mostRecentUserInfo)));

  return (
     <>
    <div className="user-info-container">
     
      {showForm ? (
        <form onSubmit={createForm} className="user-form">
          <h3 className="label">Your Details</h3>
          <div className="name-phone">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={form.name}
              onChange={updateFormField}
              required
              className="form-input"
            />
            <input
              type="tel"
              placeholder="+91"
              name="number"
              pattern="[0-9]{10}"
              title="Enter a 10-digit mobile number"
              value={form.number}
              onChange={updateFormField}
              required
              className="form-input"
            />
          </div>

          {/* Conditional input for Dine In (Table number) */}
          {selectedChoice === "Dine In" && (
            <input
              type="text"
              placeholder="Table"
              name="table"
              value={tableNumber}
              onChange={handleTableNumberChange}
              required
              className="form-input"
            />
          )}

          {/* Conditional inputs for Take Away (Address details) */}
          {selectedChoice === "Take Away" && (
            <div className="address-fields">
              <input
                type="text"
                placeholder="Street"
                name="street"
                value={form.street}
                onChange={updateFormField}
                required
                className="form-input"
              />
              <input
                type="text"
                placeholder="City"
                name="city"
                value={form.city}
                onChange={updateFormField}
                required
                className="form-input"
              />
              <input
                type="text"
                placeholder="State"
                name="state"
                value={form.state}
                onChange={updateFormField}
                required
                className="form-input"
              />
              <input
                type="text"
                placeholder="Zip code"
                name="zipCode"
                value={form.zipCode}
                onChange={updateFormField}
                required
                className="form-input"
              />
              <input
                type="text"
                placeholder="Country"
                name="country"
                value={form.country}
                onChange={updateFormField}
                required
                className="form-input"
              />
            </div>
          )}

          {/* Delivery time display */}
          <div className="itemCharges">
            <p>
              {" "}
              <FaClock color="#4AB425" /> Delivery in {totalPreparationTime}{" "}
              mins
            </p>
          </div>

          {/* Save button */}
          <button type="submit" className="save-button">
            Save
          </button>
        </form>
      ) : (
        <div id="savedData" className="saved-data-container">
          {mostRecentUserInfo && (
            <div className="saved-data-item">
              <div className="user-details">
                <h3>Your details</h3>
                {mostRecentUserInfo.name} , {mostRecentUserInfo.number} <br />
              </div>
              {/* Conditionally display address for 'takeaway' */}
              {mostRecentUserInfo.orderType === "Take Away" && (
                <p className="delivery-address">
                  <FaMapMarkerAlt color="#4AB425" /> Delivery at Home - Flat no:
                  {mostRecentUserInfo.street
                    ? ` ${mostRecentUserInfo.street},`
                    : ""}
                  {mostRecentUserInfo.city
                    ? ` ${mostRecentUserInfo.city},`
                    : ""}
                  {mostRecentUserInfo.state
                    ? ` ${mostRecentUserInfo.state},`
                    : ""}
                  {mostRecentUserInfo.zipCode
                    ? ` ${mostRecentUserInfo.zipCode},`
                    : ""}
                  {mostRecentUserInfo.country
                    ? ` ${mostRecentUserInfo.country}`
                    : ""}
                </p>
              )}
              {mostRecentUserInfo.orderType === "Dine In" && (
                <p>Table no {mostRecentUserInfo.table}</p>
              )}

              {totalPreparationTime > 0 && (
                <p className="preparation-time">
                  <FaClock color="#4AB425" /> Delivery in{" "}
                  <strong>{totalPreparationTime} mins</strong>
                </p>
              )}
              <button className="edit-button" onClick={handleEdit}>
                Edit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
    <SwipeOrder
  mostRecentUserInfo={mostRecentUserInfo}
  showForm={showForm}
  sendOrderToBackend={() => sendOrderToBackend(mostRecentUserInfo)}
  navigate={navigate}
  setSwiped={setSwiped}
/>

     </>
  );
};

export default UserInfo;

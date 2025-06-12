import React, { useContext, useState, useEffect } from "react";
import "./Cart.css";
import { ItemContext } from "../../context/itemsContext/itemsContext";
import ItemCounter from "../../components/Counter/ItemCounter";
import UserInfo from "../../components/userInfo/userInfo";
import Instruction from "../../components/InstructionModal/Instruction";
import { menu_list } from "../../assests/assets";
import Searchbar from "../../components/searchbar/Searchbar";
import axios from "axios";


const Cart = () => {
  const url = "https://foodapp-server-t1i3.onrender.com";

  const [tableNumber, setTableNumber] = useState("");
  const { cart, food_list, removeFromCart, totalCartAmount } =
    useContext(ItemContext);

  const [selectedChoice, setSelectedChoice] = useState(null);
  const handleChoiceClick = (choice) => {
    setSelectedChoice(choice);
  };

  const sendOrderToBackend = async () => {
    try {
      // Prepare order details
      const createOrder = {
        items: Object.entries(cart).map(([itemId, quantity]) => {
          const item = food_list.find((food) => food._id === itemId);
          return {
            id: itemId,
            name: item?.name || "Unknown",
            quantity,
            price: item?.price || 0,
          };
        }),
        instructions,
        orderType: selectedChoice,
        totalAmount:
          selectedChoice === "takeAway"
            ? totalCartAmount() + DeliveryCharge + Tax
            : totalCartAmount() + Tax,

        ...(selectedChoice === "Dine In" &&
          tableNumber && { table: tableNumber }),
        preparationTime: totalPreparationTime,
        timestamp: new Date().toISOString(),
      };

      // Post data to backend
      const response = await axios.post(
        `${url}/api/food/orders/create`,
        createOrder
      );
      console.log("Order response:", response.data);
      alert("Order placed successfully!");
    } catch (error) {
      alert("Failed to place order. Please try again.");
    }
  };

  const DeliveryCharge = 50;
  const Tax = 5;

  const calculateTotalPreparationTime = () => {
    let calculatedTime = 0;
    food_list.forEach((foodItem) => {
      const quantity = cart[foodItem._id] || 0;
      if (quantity > 0) {
        const menuItem = menu_list.find(
          (item) => item.menu_name === foodItem.category
        );
        if (menuItem) {
          calculatedTime += menuItem.time * quantity;
        } else {
          console.warn(
            `Cart.jsx - No preparation time found for category: ${foodItem.category}`
          );
        }
      }
    });
    return calculatedTime;
  };
  const totalPreparationTime = calculateTotalPreparationTime();

  //-----------------INSTRUCTIONS-------------
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [instructions, setInstructions] = useState("");

  const handleInstructionsClick = () => {
    setShowInstructionsModal(true);
  };

  const handleCloseInstructionsModal = () => {
    setShowInstructionsModal(false);
  };

  const handleSaveInstructions = (text) => {
    setInstructions(text);
    setShowInstructionsModal(false);
    console.log("Cooking Instructions:", text);
  };

  return (
    <>
      <Searchbar />
      {/* CART DISPLAY */}
      <div className="cart">
        <div className="itemsScroll">
          <div className="cart-items">
            {food_list.map((item) => {
              const quantity = cart[item._id];
              if (quantity > 0) {
                return (
                  <div key={item._id} className="itemCard">
                    <img src={item.image} alt="img" className="itemImg" />
                    <div className="itemInfo">
                      <div className="itemTop">
                        <h3 className="name">{item.name}</h3>
                        <button
                          className="removeItem"
                          onClick={() => removeFromCart(item._id)}
                        >
                          X
                        </button>
                      </div>
                      <div className="itemBottom">
                        <p className="price">₹{item.price}</p>
                        <ItemCounter id={item._id} />
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
        {/* INSTRUCTIONS */}
        <input
          type="text"
          placeholder="Add cooking instructions (optional)"
          className="instructionInputGlobal"
          readOnly
          onClick={handleInstructionsClick}
          value={instructions}
        />

        {showInstructionsModal && (
          <Instruction
            onClose={handleCloseInstructionsModal}
            onSave={handleSaveInstructions}
            initialInstructions={instructions}
          />
        )}
        {/* CHOICE SECTION */}
        <div className="choice">
          <div
            className={`dineIn ${selectedChoice === "Dine In" ? "active" : ""}`}
            onClick={() => handleChoiceClick("Dine In")}
          >
            Dine In
          </div>
          <div
            className={`takeAway ${selectedChoice === "Take Away" ? "active" : ""}`}
            onClick={() => handleChoiceClick("Take Away")}
          >
            Take Away
          </div>
        </div>

        {/* TOTAL BILL BASED ON ORDER TYPE */}
        <div className="checkout">
          <div className="itemCharges">
            <p>Item Total</p>
            <p>₹{totalCartAmount()}.00</p>
          </div>
          <div className="itemCharges">
            <p>Delivery Charge</p>
            <p>₹{DeliveryCharge}.00</p>
          </div>
          <div className="itemCharges">
            <p>Taxes</p>
            <p>₹{Tax}.00</p>
          </div>
          <div className="grandTotal">
            <h3>Grand Total</h3>
            <h3>
              ₹
              {selectedChoice === "Take Away"
                ? totalCartAmount() + DeliveryCharge + Tax
                : totalCartAmount() + Tax}
              .00
            </h3>
          </div>
        </div>

        {/* USER INFORMATION */}
        <UserInfo
          selectedChoice={selectedChoice}
          totalPreparationTime={totalPreparationTime}
          sendOrderToBackend={sendOrderToBackend}
          cart={cart}
          food_list={food_list}
          setTableNumber={setTableNumber}
          tableNumber={tableNumber}
        />
      </div>
    </>
  );
};

export default Cart;

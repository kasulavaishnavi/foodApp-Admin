const Order = require("../../models/orderDetails");

// ✅ Fetch all orders (latest first) and format for admin panel
const listOrders = async (req, res) => {
  try {
    const ordersFromDB = await Order.find().sort({ createdAt: -1 }); // .lean() for plain JS objects

    const formattedOrders = ordersFromDB.map(order => {
      // Calculate total item count
      const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

      switch (order.status) {
        case "Processing":
          actionButtonText = "Processing";
          actionButtonIcon = "hourglass"; 
         const now = new Date();
    const createdAt = new Date(order.createdAt);
    const diffInMinutes = Math.round((now - createdAt) / (1000 * 60));
          statusDetails = `${diffInMinutes} Min`; 
          break;
        case "Served":
          actionButtonText = "Order Done";
          actionButtonIcon = "check-circle"; 
          break;
        case "Not Picked up":
          actionButtonText = "Order Done";
          actionButtonIcon = "check-circle"; 
          break;
        default:
          actionButtonText = "Update Status";
          actionButtonIcon = "sync";
          break;
      }

      return {
       orderId: order.orderId ? `#${order.orderId}` : "#N/A", 
        orderType: order.orderType,
        table: order.orderType === "Dine In" ? order.table : "N/A",
        orderTime: new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }), 
        itemCount: itemCount,
        items: order.items.map(item => ({ quantity: item.quantity, name: item.name })),
        status: order.status,
        statusDetails: statusDetails,
        actionButtonText: actionButtonText,
        actionButtonIcon: actionButtonIcon
      };
    });

    res.status(200).json(formattedOrders);
  } catch (error) {
    console.error("Error fetching and formatting orders", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const createOrder = async (req, res) => {
  try {
    const { table, time, items, orderType, status, totalAmount } = req.body;
    const orderId = Date.now() + Math.floor(Math.random() * 1000); 

    const newOrder = new Order({
      orderId,
      table,
      time,
      items,
      orderType,
      status,
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

module.exports = {
  listOrders,
  createOrder,
};
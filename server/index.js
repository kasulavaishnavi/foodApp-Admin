const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");


dotenv.config();

const app = express();
const allowedOrigins = [
  "https://foodappclient1.onrender.com",
  "https://foodapp-admin-cola.onrender.com",
  "http://localhost:3000",
  "http://localhost:3001"
];


app.use(cors({
  origin: allowedOrigins
}));

// Middleware
app.use(express.json());

// Port
const port = process.env.PORT || 4000;

app.get("/",(req,res)=>{

  console.log("hello")
    res.send("heeloo000 byeee");

}) 

//Database connection
require("./DB/connection");


// Require Routes
const userDetails = require("./routes/userDetails");
const itemRoute = require("./routes/itemRoute");
const cartRouter = require("./routes/cartRoutes");
const tableRouter = require("./routes/tableRoutes")
// Routes
app.use("/api/food", userDetails);
app.use("/api/food", itemRoute)
app.use("/images", express.static('uploads'));
app.use("/api/food", cartRouter)
app.use("/api/food", tableRouter)




app.listen(port, () => {
  console.log(`Server is running at PORT: ${port}`);
});
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("./cloudinaryConfig");
const Product = require("./Product");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb+srv://root:root@razorpay.emjiy.mongodb.net/?retryWrites=true&w=majority&appName=razorpay")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const upload = multer({ dest: "uploads/" });

// POST Product with Image Upload
app.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    console.log(result);
    const newProduct = new Product({
      name,
      price,
      description,
      imageUrl: result.secure_url,
      category,
    });

    await newProduct.save();
    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//get api

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));

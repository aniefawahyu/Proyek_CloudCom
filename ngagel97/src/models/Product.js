import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product_id: { type: String, required: true, unique: true },
  category: {
    category_id: String,
    category_name: String,
  },
  product_name: { type: String, required: true },
  product_price: { type: Number, required: true },
  product_description: String,
  add_ons: [
    {
      add_on_id: String,
      add_on_name: String,
      add_on_price: Number,
      add_on_description: String,
    },
  ],
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;

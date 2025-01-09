import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  order_date: { type: Date, default: Date.now },
  order_status: String,
  order_shipping_price: Number,
  order_sent: Date,
  order_arrived: Date,
  order_payment_method: String,
  order_total_price: Number,
  order_details: [
    {
      product: {
        product_id: String,
        product_name: String,
        product_price: Number,
        product_description: String,
        category: {
          category_id: String,
          category_name: String,
        },
      },
      add_on: {
        add_on_id: String,
        add_on_name: String,
        add_on_price: Number,
        add_on_description: String,
      },
      order_detail_qty: Number,
      order_detail_subtotal: Number,
      order_detail_notes: String,
      order_detail_document: String,
    },
  ],
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

module.exports = Order;

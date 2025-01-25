import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    }, // Relasi ke User
    items: [
      {
        jasaId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Jasa",
          required: true,
        }, // Relasi ke Jasa
        nama: { type: String, required: true }, // Nama jasa saat transaksi
        harga: { type: Number, required: true }, // Harga jasa per lembar saat transaksi
        lembar: { type: Number, required: true }, // Jumlah lembar yang diproses
        file: { type: String, required: true }, // file yang dikirim
        qty: { type: Number, required: true }, // Berapa kali dicopy
        notes: { type: String },
        addOns: [
          {
            addOnId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "AddOn",
              required: true,
            }, // Relasi ke AddOn
            nama: { type: String, required: true }, // Nama AddOn saat transaksi
            harga: { type: Number, required: true }, // Harga AddOn saat transaksi
            qty: {
              type: Number,
              required: function () {
                return this.tipeHarga === "lembar";
              }, // Qty wajib jika tipe harga "lembar"
            },
            tipeHarga: { type: String, required: true }, // "bundle" atau "lembar"
            subtotal: { type: Number, required: true }, // Harga total AddOn ini
          },
        ],
        subtotal: { type: Number, required: true }, // Harga total jasa ini (termasuk AddOn)
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

module.exports = Cart;

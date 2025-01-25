import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const TransaksiSchema = new mongoose.Schema(
  {
    idTransaksi: { type: Number }, // ID auto increment
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    }, // Relasi ke User
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    isOnline: { type: Boolean, required: true }, // True untuk transaksi online, false untuk offline
    alamat: { type: String }, // Alamat untuk transaksi online
    notes: { type: String },
    ongkir: { type: Number, default: 0 }, // Ongkos kirim untuk online
    status: {
      type: String,
      enum: ["unpaid", "pending", "progress", "completed", "failed"],
      default: "unpaid",
    }, // Status transaksi
    barang: [
      {
        barangId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Barang",
          required: true,
        }, // Relasi ke Barang
        nama: { type: String, required: true }, // Nama barang saat transaksi
        harga: { type: Number, required: true }, // Harga barang saat transaksi
        qty: { type: Number, required: true }, // Kuantitas barang
        subtotal: { type: Number, required: true }, // Harga total barang ini
      },
    ],
    jasa: [
      {
        jasaId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Jasa",
          required: true,
        }, // Relasi ke Jasa
        nama: { type: String, required: true }, // Nama jasa saat transaksi
        harga: { type: Number, required: true }, // Harga jasa per lembar saat transaksi
        lembar: { type: Number, required: true }, // Jumlah lembar yang diproses
        file: { type: String }, // file yang dikirim
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
    addOns: [
      {
        addOnId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "AddOn",
          required: true,
        }, // Relasi ke AddOn
        nama: { type: String, required: true }, // Nama AddOn saat transaksi
        harga: { type: Number, required: true }, // Harga AddOn saat transaksi
        qty: { type: Number, required: true }, // Kuantitas AddOn
        subtotal: { type: Number, required: true }, // Harga total AddOn ini
      },
    ],
    subtotal: { type: Number, required: true }, // Total seluruh barang + jasa (termasuk AddOn)
    total: { type: Number, required: true }, // Total setelah menambahkan ongkir (untuk online)
    midtransId: { type: String }
  },
  { timestamps: true }
);

TransaksiSchema.plugin(AutoIncrement(mongoose), {
  inc_field: "idTransaksi",
});

const Transaksi =
  mongoose.models.Transaksi || mongoose.model("Transaksi", TransaksiSchema);
export default Transaksi;

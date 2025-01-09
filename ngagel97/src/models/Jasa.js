import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const JasaSchema = new mongoose.Schema(
  {
    idJasa: { type: Number },
    nama: { type: String, required: true },
    harga: { type: Number, required: true }, // Harga per satuan (misal per lembar untuk print)
    deskripsi: { type: String, required: true }, // Opsional, untuk informasi tambahan
    gambar: { type: String }, // Link ke gambar
    addOns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AddOn", // Referensi ke model AddOn
      },
    ],
    deleted: { type: Boolean, default: false }, // Soft delete
  },
  { timestamps: true }
);

JasaSchema.plugin(AutoIncrement(mongoose), {
  inc_field: "idJasa",
});

const Jasa = mongoose.models.Jasa || mongoose.model("Jasa", JasaSchema);
export default Jasa;

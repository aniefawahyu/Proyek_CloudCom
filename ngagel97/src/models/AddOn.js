import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const AddOnSchema = new mongoose.Schema(
  {
    idAddon: { type: Number },
    nama: { type: String, required: true },
    harga: { type: Number, required: true }, // Harga default
    tipeHarga: {
      type: String,
      enum: ["bundle", "lembar"],
      required: true,
    }, // Menentukan jenis harga apakah nanti dihitung per lembar atau per bundle
    // Contoh harga bundle (1 harga sesuai yang tertera) : Jilid Hard Cover, Jilid Lakban, Jilid Spiral, dll
    // Contoh harga per lembar (harga x jumlah lembar yang dipesan) : Laminating, Laminasi Glossy, Laminasi Doff
    deskripsi: { type: String, required: true }, // Opsional
    gambar: { type: String }, // Link ke gambar
    deleted: { type: Boolean, default: false }, // Soft delete
  },
  { timestamps: true }
);

AddOnSchema.plugin(AutoIncrement(mongoose), {
  inc_field: "idAddon",
});

const AddOn = mongoose.models.AddOn || mongoose.model("AddOn", AddOnSchema);
export default AddOn;

import Jasa from "@/models/Jasa"; // Sesuaikan dengan lokasi model Anda
import connectDB from "@/app/api/mongoose"; // Sesuaikan dengan lokasi file koneksi DB

// Fungsi GET (gabungan)
export async function GET() {
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    // Ambil semua Jasa yang belum dihapus
    const jasas = await Jasa.find({ deleted: false });

    return new Response(JSON.stringify(jasas), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch Jasa" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Fungsi POST untuk membuat Jasa baru
export async function POST(request) {
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const { nama, harga, deskripsi, gambar, addOns } = await request.json();

    // Membuat Jasa baru
    const newJasa = new Jasa({
      nama,
      harga,
      deskripsi,
      gambar,
      addOns, // Referensi ke AddOn
    });

    // Simpan ke database
    await newJasa.save();

    return new Response(
      JSON.stringify({ message: "Jasa created successfully", jasa: newJasa }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create Jasa" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

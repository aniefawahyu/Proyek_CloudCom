import Barang from "@/models/Barang"; // Sesuaikan dengan lokasi model Anda
import connectDB from "@/app/api/mongoose"; // Sesuaikan dengan lokasi file koneksi DB

export async function POST(request) {
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const { nama, harga, deskripsi } = await request.json();

    // Membuat Barang baru
    const newBarang = new Barang({
      nama,
      harga,
      deskripsi,
    });

    // Simpan ke database
    await newBarang.save();

    return new Response(
      JSON.stringify({
        message: "Barang created successfully",
        barang: newBarang,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create Barang" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const barangs = await Barang.find({ deleted: false });

    return new Response(JSON.stringify(barangs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch Barangs" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

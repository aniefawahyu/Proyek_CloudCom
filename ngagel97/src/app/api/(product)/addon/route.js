import AddOn from "@/models/AddOn"; // Sesuaikan dengan lokasi model Anda
import dbConnect from "@/app/api/mongoose"; // Sesuaikan dengan lokasi file koneksi DB

export async function POST(request) {
  try {
    await dbConnect(); // Pastikan koneksi DB berhasil

    const { nama, harga, tipeHarga, deskripsi, gambar } = await request.json();

    // Membuat AddOn baru
    const newAddOn = new AddOn({
      nama,
      harga,
      tipeHarga,
      deskripsi,
      gambar,
    });

    // Simpan ke database
    await newAddOn.save();

    return new Response(
      JSON.stringify({
        message: "AddOn created successfully",
        addOn: newAddOn,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to create AddOn" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  try {
    await dbConnect(); // Pastikan koneksi DB berhasil

    // Ambil semua AddOns yang belum dihapus
    const addOns = await AddOn.find({ deleted: false });

    return new Response(JSON.stringify(addOns), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch AddOns" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

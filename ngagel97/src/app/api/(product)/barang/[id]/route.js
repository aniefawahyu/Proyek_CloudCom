import Barang from "@/models/Barang"; // Sesuaikan dengan lokasi model Anda
import connectDB from "@/app/api/mongoose"; // Sesuaikan dengan lokasi file koneksi DB

export async function GET(request, { params }) {
  const { id } = await params; // Mengakses params.id langsung

  if (!id) {
    return new Response(
      JSON.stringify({ message: "ID parameter is missing" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const barang = await Barang.findOne({ idBarang: id, deleted: false });
    if (!barang) {
      return new Response(JSON.stringify({ message: "Barang not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(barang), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch Barang" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request, { params }) {
  const { id } = await params; // Mengakses params.id langsung

  if (!id) {
    return new Response(
      JSON.stringify({ message: "ID parameter is missing" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const updatedData = await request.json();

    const updatedBarang = await Barang.findOneAndUpdate(
      { idBarang: id, deleted: false },
      updatedData,
      { new: true }
    );

    if (!updatedBarang) {
      return new Response(JSON.stringify({ message: "Barang not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Barang updated", barang: updatedBarang }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update Barang" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params; // Mengakses params.id langsung

  if (!id) {
    return new Response(
      JSON.stringify({ message: "ID parameter is missing" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const deletedBarang = await Barang.findOneAndUpdate(
      { idBarang: id, deleted: false },
      { deleted: true },
      { new: true }
    );

    if (!deletedBarang) {
      return new Response(JSON.stringify({ message: "Barang not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Barang deleted", barang: deletedBarang }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to delete Barang" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

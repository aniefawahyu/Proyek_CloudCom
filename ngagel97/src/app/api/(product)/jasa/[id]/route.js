import Jasa from "@/models/Jasa"; // Sesuaikan dengan lokasi model Anda
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

    // Ambil jasa berdasarkan id
    const jasa = isNaN(id) ? await Jasa.findOne({ _id: id, deleted: false }) : await Jasa.findOne({ idJasa: id, deleted: false });

    if (!jasa) {
      return new Response(JSON.stringify({ message: "Jasa not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(jasa), {
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

    const updatedJasa = await Jasa.findOneAndUpdate(
      { idJasa: id, deleted: false },
      updatedData,
      { new: true }
    );

    if (!updatedJasa) {
      return new Response(JSON.stringify({ message: "Jasa not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Jasa updated", jasa: updatedJasa }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update Jasa" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Fungsi DELETE untuk soft delete Jasa
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

    const deletedJasa = await Jasa.findOneAndUpdate(
      { idJasa: id, deleted: false },
      { deleted: true },
      { new: true }
    );

    if (!deletedJasa) {
      return new Response(JSON.stringify({ message: "Jasa not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "AddOn deleted", jasa: deletedJasa }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to delete Jasa" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

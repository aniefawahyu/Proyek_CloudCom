import AddOn from "@/models/AddOn"; // Sesuaikan dengan lokasi model Anda
import dbConnect from "@/app/api/mongoose";

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
    await dbConnect(); // Pastikan koneksi DB berhasil

    // Ambil AddOn berdasarkan id
    const addOn = await AddOn.findOne({ idAddon: id, deleted: false });

    if (!addOn) {
      return new Response(JSON.stringify({ message: "AddOn not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(addOn), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch AddOn" }), {
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
    await dbConnect(); // Pastikan koneksi DB berhasil

    const updatedData = await request.json();

    const updatedAddOn = await AddOn.findOneAndUpdate(
      { idAddon: id, deleted: false },
      updatedData,
      { new: true }
    );

    if (!updatedAddOn) {
      return new Response(JSON.stringify({ message: "AddOn not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "AddOn updated", addOn: updatedAddOn }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to update AddOn" }), {
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
    await dbConnect(); // Pastikan koneksi DB berhasil

    const deletedAddOn = await AddOn.findOneAndUpdate(
      { idAddon: id, deleted: false },
      { deleted: true },
      { new: true }
    );

    if (!deletedAddOn) {
      return new Response(JSON.stringify({ message: "AddOn not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "AddOn deleted", addOn: deletedAddOn }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to delete AddOn" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

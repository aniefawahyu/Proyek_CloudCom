import connectDB from "@/app/api/mongoose";
import Transaksi from "@/models/Transaksi";
import { jwtVerify } from "jose";

export async function PUT(request, { params }) {
  const { id } = await params; // Ambil ID dari URL
  const token = request.cookies.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  if (!id) {
    return new Response(
      JSON.stringify({ message: "ID parameter is missing" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const adminId = payload.id;
    const role = payload.role;
    await connectDB(); // Pastikan koneksi DB berhasil

    // Data yang akan diupdate
    const { status } = await request.json();
    const transaksi = await Transaksi.findById(id);
    // Update data transaksi berdasarkan ID
    if(role == "admin" && !transaksi.adminId){
      const updatedTransaksi = await Transaksi.findByIdAndUpdate(
        id, // ID dari params
        { 
          status: status,
          adminId: adminId,
        }, // Data yang dikirim dari client
        { new: true } // Mengembalikan data terbaru
      );
      if (!updatedTransaksi) {
        return new Response(
          JSON.stringify({ message: "Transaction not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
  
      return new Response(
        JSON.stringify({
          message: "Transaction updated successfully",
          data: updatedTransaksi,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    else{
      const updatedTransaksi = await Transaksi.findByIdAndUpdate(
        id, // ID dari params
        { status: status }, // Data yang dikirim dari client
        { new: true } // Mengembalikan data terbaru
      );
      if (!updatedTransaksi) {
        return new Response(
          JSON.stringify({ message: "Transaction not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
  
      return new Response(
        JSON.stringify({
          message: "Transaction updated successfully",
          data: updatedTransaksi,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    
  } catch (error) {
    console.error("Error updating transaction:", error.message);
    return new Response(
      JSON.stringify({ message: "Failed to update transaction" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(request, { params }) {
  const { id } = await params; // Ambil ID dari URL

  if (!id) {
    return new Response(
      JSON.stringify({ message: "ID parameter is missing" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    // Update data transaksi berdasarkan ID
    const transaksi = await Transaksi.findById(id);

    if (!transaksi) {
      return new Response(
        JSON.stringify({ message: "Transaction not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Transaction updated successfully",
        data: transaksi,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error updating transaction:", error.message);
    return new Response(
      JSON.stringify({ message: "Failed to update transaction" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

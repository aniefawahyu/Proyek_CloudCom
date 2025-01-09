import connectDB from "@/app/api/mongoose";
import Transaksi from "@/models/Transaksi";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req) {
  const token = req.cookies.get("token");
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const adminId = payload.id;

    await connectDB();

    // Perbaikan query menggunakan $in
    let orders = await Transaksi.find({
      isOnline: true,
      status: { $in: ["pending", "progress"] }, // Menggunakan operator $in
    });

    orders = orders.filter((item) => !item.adminId || item.adminId == adminId);

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { success: true, data: { orders: [] } },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: { orders: orders } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetch orders:", error);
    return NextResponse.json(
      { success: false, message: "Error fetch orders", error: error.message },
      { status: 500 }
    );
  }
}

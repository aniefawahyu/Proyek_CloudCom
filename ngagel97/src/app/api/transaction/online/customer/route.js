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
    // Decode JWT
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    
    const userId = payload.id;

    await connectDB();

    // Perbaikan query menggunakan $in
    let userOrders = await Transaksi.find({
      userId: userId,
      status: { $in: ["pending", "progress", "completed"] },
    }).sort({ updatedAt: -1 });

    if (!userOrders || userOrders.length === 0) {
      return NextResponse.json(
        { success: true, data: { userId: userId, orders: [] } },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: { userId: userId, orders: userOrders } },
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

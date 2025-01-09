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

    await connectDB();

    // Fetch all completed orders
    let completedOrders = await Transaksi.find({
      status: "completed",
    });

    if (!completedOrders || completedOrders.length === 0) {
      return NextResponse.json(
        { success: true, data: { orders: [] } },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, data: { orders: completedOrders } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching orders", error: error.message },
      { status: 500 }
    );
  }
}

import connectDB from "@/app/api/mongoose";
import Transaksi from "@/models/Transaksi";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
      await connectDB();
  
      let completedOrders = await Transaksi.find({
        status: "completed",
      }).sort({ updatedAt: -1 });
  
      if (!completedOrders || completedOrders.length === 0) {
        return NextResponse.json(
          { success: true, data: { orders: [] } },
          { status: 200 }
        );
      }
      console.log(completedOrders);
      
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
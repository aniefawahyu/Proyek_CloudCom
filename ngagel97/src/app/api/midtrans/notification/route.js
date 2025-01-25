import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import connectDB from "@/app/api/mongoose";
import Transaksi from "@/models/Transaksi";

// Inisialisasi Midtrans Client untuk verifikasi notification
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Endpoint untuk menerima notifikasi dari Midtrans
export async function POST(req) {
  try {
    const notification = await req.json();

    const { order_id, transaction_status, transaction_id } = notification;

    // Cari transaksi berdasarkan order_id atau transaction_id
    const transaksi = await Transaksi.findOne({ midtransId: transaction_id });

    if (!transaksi) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Proses status transaksi
    if (transaction_status === "capture") {
      // Jika status pembayaran "capture", berarti pembayaran sukses
      transaksi.status = "pending";
    } else if (transaction_status === "cancel" || transaction_status === "deny") {
      // Jika status pembayaran "cancel" atau "deny", berarti pembayaran gagal
      transaksi.status = "failed";
    } else if (transaction_status === "pending") {
      // Jika status pembayaran "pending", transaksi belum selesai
      transaksi.status = "unpaid";
    }

    // Simpan status transaksi terbaru
    await transaksi.save();

    // Kembalikan response sukses ke Midtrans
    return NextResponse.json({ message: "Notification received" }, { status: 200 });

  } catch (error) {
    console.error("Error processing notification:", error.message);
    return NextResponse.json({ error: "Failed to process notification" }, { status: 500 });
  }
}

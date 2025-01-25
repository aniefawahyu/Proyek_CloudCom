import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import connectDB from "@/app/api/mongoose";
import Transaksi from "@/models/Transaksi";

// Inisialisasi Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Endpoint untuk membuat Snap Token
export async function POST(req) {
  await connectDB();
  const { userId, alamat, notes, ongkir, subtotal, total, jasa, user } =
    await req.json();
  
  let itemDetails = [];
  let calculatedTotal = 0;

  // Loop melalui jasa dan add-ons
  jasa.forEach(jasaItem => {
    const lembar = jasaItem.lembar !== 0 ? jasaItem.lembar : 1;
    const jasaSubtotal = jasaItem.harga * lembar * jasaItem.qty;
    itemDetails.push({
      id: jasaItem._id,
      name: jasaItem.nama,
      price: jasaItem.harga,
      quantity: jasaItem.qty * lembar,
      category: "Jasa",
    });
    calculatedTotal += jasaSubtotal;

    // Loop melalui add-ons dan menambahkannya ke item_details
    jasaItem.addOns.forEach(addOn => {
      const addOnSubtotal = addOn.harga * addOn.qty;
      itemDetails.push({
        id: addOn._id,
        name: addOn.nama,
        price: addOn.harga,
        quantity: addOn.qty,
        category: "Add-On",
      });
      calculatedTotal += addOnSubtotal;
    });
  });

  // Menambahkan ongkir ke item_details dan total
  itemDetails.push({
    id: `ship-${Date.now()}`,
    name: "ongkir",
    price: ongkir,
    quantity: 1,
    category: "shipping",
  });

  // Menambahkan ongkir ke total yang dihitung
  calculatedTotal += ongkir;

  // Pastikan gross_amount dibulatkan
  const grossAmount = Math.round(calculatedTotal); // Pembulatan ke angka bulat

  console.log("Gross Amount:", grossAmount);
  console.log("Calculated Total:", calculatedTotal);
  console.log("Item Details:", itemDetails);

  try {
    // Validasi data
    if (!userId || !total || !jasa || jasa.length === 0) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    // Verifikasi bahwa calculatedTotal sama dengan total yang dikirim
    if (grossAmount !== total) {
      console.error("Total does not match calculated total");
      return NextResponse.json({ error: "Total mismatch" }, { status: 400 });
    }

    const transactionDetails = {
      order_id: `order-${Date.now()}`,
      gross_amount: grossAmount, // Total amount including shipping cost
    };

    const customerDetails = {
      first_name: user.name,
      email: user.email,
      phone: user.phone_number,
    };

    const parameter = {
      transaction_details: transactionDetails,
      item_details: itemDetails,
      customer_details: customerDetails,
    };

    // Membuat Snap Token
    const snapToken = await snap.createTransaction(parameter);

    // Simpan transaksi ke database
    const newTransaksi = new Transaksi({
      userId,
      isOnline: true,
      alamat,
      notes,
      ongkir,
      status: "unpaid",
      jasa,
      subtotal,
      total,
      midtransId: snapToken.transaction_id,  // Menambahkan transaction_id
    });
    console.log(newTransaksi);
    await newTransaksi.save();

    return NextResponse.json({ snapToken: snapToken.token , transaksi_id: newTransaksi._id});
  } catch (error) {
    console.error("Error creating Snap token:", error.message);
    return NextResponse.json({ error: "Failed to create Snap Token" }, { status: 500 });
  }
}

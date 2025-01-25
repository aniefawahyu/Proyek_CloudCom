import connectDB from "@/app/api/mongoose";
import Transaksi from "@/models/Transaksi";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function POST(req) {
  const token = req.cookies.get("token");
  console.log(token);

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    // Pastikan koneksi ke database
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const adminId = payload.id;
    await connectDB();

    // Parse body dari request
    const {
      barang,
      jasa,
      addon,
      subtotal,
      total,
    } = await req.json();
    // console.log(barang);
    // console.log(jasa);
    
    // Validasi data yang wajib diisi
    if (!subtotal || !total) {
      return NextResponse.json(
        { success: false, message: "Subtotal dan total wajib diisi." },
        { status: 400 }
      );
    }
    let brg =  barang.map((item)=>{
        return {
            barangId: item.product._id,
            nama: item.product.nama,
            harga: item.product.harga,
            qty: item.jumlah,
            subtotal: item.product.harga * item.jumlah
        }
    })
    // console.log(brg);
    let js = jasa.map((item) => {
        return {
          jasaId: item.product._id,
          nama: item.product.nama,
          harga: item.product.harga,
          qty: item.jumlah,
          subtotal: item.product.harga * item.jumlah * item.lembar, //tambah subtotal add on
          lembar: item.lembar,
          addOns: item.addOnsDetails.map((aon) => {
            return {
                addOnId: aon.id,
                nama: aon.name,
                harga: aon.harga,
                tipeHarga: aon.tipeHarga,
                qty: aon.qty,
                subtotal: aon.harga * aon.qty
            }
          }) || [], // Menyimpan informasi add-ons yang dipilih
        };
    });
    console.log(js.addOns);
      
    let ao = addon.map((item)=>{
        return {
            addOnId: item.product._id,
            nama: item.product.nama,
            harga: item.product.harga,
            qty: item.jumlah,
            subtotal: item.product.harga * item.jumlah
        }
    })

    // Buat dokumen transaksi baru
    const newTransaksi = new Transaksi({
      isOnline: false,
      status: "completed",
      adminId: adminId,
      barang: brg || [],
      jasa: js || [],
      addOns: ao || [],
      subtotal: parseInt(subtotal, 10),
      total: parseInt(total, 10),
    });

    // Simpan ke database
    await newTransaksi.save();

    return NextResponse.json({ success: true, data: newTransaksi }, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { success: false, message: "Gagal membuat transaksi.", error: error.message },
      { status: 500 }
    );
  }
}

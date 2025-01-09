import connectDB from "@/app/api/mongoose";
import Cart from "@/models/Cart";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req, { params }) {
  const token = req.cookies.get("token"); // Ambil token dari cookies
  const { id } = await params; // Ambil id dari route dinamis (cart/[id])

  // Pengecekan jika token tidak ada
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

    // Koneksi ke database
    await connectDB();

    // Cari cart berdasarkan userId
    const userCart = await Cart.findOne({ userId });

    // Jika cart tidak ditemukan, kembalikan array kosong
    if (!userCart || !userCart.items) {
      return NextResponse.json(
        { success: true, data: null, message: "Cart is empty or not found" },
        { status: 200 }
      );
    }

    // Ambil item spesifik berdasarkan index/id
    const cartItem = userCart.items[id];

    // Jika item tidak ditemukan, kirim respons kosong
    if (!cartItem) {
      return NextResponse.json(
        { success: false, message: "Item not found" },
        { status: 404 }
      );
    }

    // Return item spesifik
    return NextResponse.json(
      { success: true, data: cartItem },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching cart", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
    const token = req.cookies.get("token"); // Ambil token dari cookies
    const { id } = await params; // Ambil id dari route dinamis (cart/[id])
  
    // Pengecekan jika token tidak ada
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
  
      // Koneksi ke database
      await connectDB();
  
      // Cari cart berdasarkan userId
      const userCart = await Cart.findOne({ userId });
  
      // Jika cart tidak ditemukan, kembalikan array kosong
      if (!userCart || !userCart.items) {
        return NextResponse.json(
          { success: true, data: null, message: "Cart is empty or not found" },
          { status: 200 }
        );
      }
  
      // Ambil item spesifik berdasarkan index/id
      const cartItem = userCart.items[id];
  
      // Jika item tidak ditemukan, kirim respons kosong
      if (!cartItem) {
        return NextResponse.json(
          { success: false, message: "Item not found" },
          { status: 404 }
        );
      }
      const { qty, lembar, file, notes, addOns, subtotal } = await req.json();

      // Update item cart dengan data baru
      cartItem.qty = qty || cartItem.qty;
      cartItem.lembar = lembar || cartItem.lembar;
      cartItem.file = file || cartItem.file;
      cartItem.notes = notes || cartItem.notes;
      cartItem.addOns = addOns || cartItem.addOns;
      cartItem.subtotal = subtotal || cartItem.subtotal;
  
      // Simpan perubahan
      await userCart.save();
  
      return NextResponse.json(
        { success: true, message: "Cart item updated successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating cart:", error);
      return NextResponse.json(
        { success: false, message: "Error updating cart", error: error.message },
        { status: 500 }
      );
    }
  }

  export async function DELETE(req, { params }) {
    const token = req.cookies.get("token"); // Ambil token dari cookies
    const { id } = await params; // Ambil id dari route dinamis (cart/[id])
  
    // Pengecekan jika token tidak ada
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
  
      // Koneksi ke database
      await connectDB();
  
      // Cari cart berdasarkan userId
      const userCart = await Cart.findOne({ userId });
  
      // Jika cart tidak ditemukan atau tidak memiliki items
      if (!userCart || !userCart.items) {
        return NextResponse.json(
          { success: true, data: null, message: "Cart is empty or not found" },
          { status: 200 }
        );
      }
  
      // Cek apakah item yang diminta ada dalam cart
      const cartItem = userCart.items[id];
  
      if (!cartItem) {
        return NextResponse.json(
          { success: false, message: "Item not found" },
          { status: 404 }
        );
      }
  
      // Hapus item dari array items
      userCart.items.splice(id, 1);
  
      // Simpan perubahan
      await userCart.save();
  
      return NextResponse.json(
        { success: true, message: "Cart item deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error deleting cart item:", error);
      return NextResponse.json(
        { success: false, message: "Error deleting cart item", error: error.message },
        { status: 500 }
      );
    }
  }
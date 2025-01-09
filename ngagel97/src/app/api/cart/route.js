import connectDB from "@/app/api/mongoose";
import Cart from "@/models/Cart";
import Jasa from "@/models/Jasa";
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
  const { items } = await req.json();
  console.log(items);

  try {
    // Decode JWT
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const userId = payload.id;

    await connectDB();

    // Parse body dari request

    if (!items) {
      return NextResponse.json(
        {
          success: false,
          message: "Data jasa, subtotal, dan qty wajib diisi.",
        },
        { status: 400 }
      );
    }

    // Cek apakah user sudah memiliki cart
    let userCart = await Cart.findOne({ userId });

    if (userCart) {
      // Tambahkan item ke cart yang sudah ada
      userCart.items.push(items);
    } else {
      // Buat cart baru jika belum ada
      userCart = new Cart({
        userId: userId,
        items: [items],
      });
    }

    await userCart.save();

    return NextResponse.json(
      { success: true, data: userCart },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error add to cart:", error);
    return NextResponse.json(
      { success: false, message: "Gagal add to cart.", error: error.message },
      { status: 500 }
    );
  }
}

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
    console.log(userId);

    let userCart = await Cart.findOne({ userId }).populate({
      path: "items.jasaId", // populate jasaId di setiap item
      select: "gambar", // hanya mengambil gambar dari model Jasa
    });

    // Jika cart tidak ditemukan, return cart kosong
    if (!userCart) {
      return NextResponse.json(
        { success: true, data: { userId: userCart.userId, items: [] } }, // Pastikan ada properti "items"
        { status: 200 }
      );
    }

    // Map untuk menambahkan properti gambar pada setiap item
    const cartWithImages = userCart.items.map((item) => {
      return {
        ...item.toObject(), // mengambil data item yang ada
        gambar: item.jasaId?.gambar || null, // tambahkan gambar dari jasaId
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: { userId: userCart.userId, items: cartWithImages },
      }, // Pastikan ada properti "items"
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetch cart:", error);
    return NextResponse.json(
      { success: false, message: "Error fetch cart", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
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

    // Hapus item dari array items
    userCart.items = [];

    // Simpan perubahan
    await userCart.save();

    return NextResponse.json(
      { success: true, message: "Cart item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting cart item",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

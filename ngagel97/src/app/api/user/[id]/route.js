import connectDB from "@/app/api/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

// PUT: Update user role
export async function PUT(request, { params }) {
  try {
    // Ambil ID dari parameter
    const { id } = await params;

    // Pastikan request body memiliki role
    const { role } = await request.json();

    if (!id || !role) {
      return NextResponse.json(
        { success: false, message: "User ID and new role are required" },
        { status: 400 }
      );
    }

    // Koneksikan ke database
    await connectDB();

    // Temukan user berdasarkan ID dan update role-nya
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true } // Mengembalikan user yang sudah diperbarui
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User role updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user role" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Ambil ID dari parameter
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Koneksikan ke database
    await connectDB();

    // Temukan user berdasarkan ID
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Toggle atribut `deleted`
    user.deleted = !user.deleted;

    // Simpan perubahan
    await user.save();

    const statusMessage = user.deleted
      ? "User successfully banned"
      : "User successfully activated";

    return NextResponse.json(
      {
        success: true,
        message: statusMessage,
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling user deletion status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user deletion status" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    await connectDB();
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: { user } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

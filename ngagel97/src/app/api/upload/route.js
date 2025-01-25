import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const blob = await put(file.name, file, { access: "public" });

    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json(
      { error: "File upload failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("filepath");
  let message = "No file path provided";
  try {
    if (filePath) {
      await del(filePath); // Hapus file
      message = "File deleted successfully";
    }

    return NextResponse.json({
      success: true,
      message: message,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete file", details: error.message },
      { status: 500 }
    );
  }
}

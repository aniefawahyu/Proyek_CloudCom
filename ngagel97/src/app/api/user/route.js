import connectDB from "@/app/api/mongoose";
import User from "@/models/User";

// Named export for GET method
export async function GET() {
  try {
    await connectDB(); // Pastikan koneksi DB berhasil

    const users = await User.find();

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch Users" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

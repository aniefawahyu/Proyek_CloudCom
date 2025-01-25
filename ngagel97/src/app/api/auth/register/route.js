import bcrypt from "bcrypt";
import User from "@/models/User"; // Adjust path based on your folder structure
import connectDB from "@/app/api/mongoose"; // Adjust path based on your folder structure

export async function POST(request) {
  try {
    await connectDB(); // Ensure DB connection is successful

    const { email, password, name, phoneNumber } = await request.json();

    // Check if user already exists by email or phone number
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return new Response(
        JSON.stringify({ error: "Email is already registered" }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      phone_number: phoneNumber,
      role: "customer", // Default role
    });

    // Save the new user to the database
    await newUser.save();

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        user: { email: newUser.email, name: newUser.name },
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Registration failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

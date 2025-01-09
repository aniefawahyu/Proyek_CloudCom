import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone_number: String,
  role: String,
  deleted: { type: Boolean, default: false },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;

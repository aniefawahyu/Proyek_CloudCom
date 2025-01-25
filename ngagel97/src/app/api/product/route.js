import dbConnect from "@/app/api/mongoose";
import Product from "@/models/Product";

export default async function handler(req, res) {
  await dbConnect(); // Hubungkan ke database

  const {
    method,
    query: { id },
  } = req; // `id` untuk update dan delete

  try {
    switch (method) {
      case "POST": // Create Product
        const newProduct = new Product(req.body);
        await newProduct.save();
        return res
          .status(201)
          .json({ message: "Product created", product: newProduct });

      case "GET": // Read Products
        const products = await Product.find();
        return res.status(200).json(products);

      case "PUT": // Update Product
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (!updatedProduct)
          return res.status(404).json({ message: "Product not found" });
        return res
          .status(200)
          .json({ message: "Product updated", product: updatedProduct });

      case "DELETE": // Delete Product
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct)
          return res.status(404).json({ message: "Product not found" });
        return res
          .status(200)
          .json({ message: "Product deleted", product: deletedProduct });

      default:
        res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
        return res
          .status(405)
          .json({ message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

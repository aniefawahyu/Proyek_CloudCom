"use client";

import React, { useState } from "react";
import { Box, Typography, Button, Paper, Divider, Grid2 } from "@mui/material";
import Image from "next/image";

// Sample data for products
const productData = [
  { id: 1, name: "Print Kertas HVS (1 Lembar)", price: 10000 },
  { id: 2, name: "Print Kertas Folio (1 Lembar)", price: 10000 },
  { id: 3, name: "Print Kertas Folio Berwarna (1 Lembar)", price: 10000 },
];

const PaymentPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("");

  const handlePaymentSelect = (method) => {
    setSelectedMethod(method);
  };

  // Calculate total price and shipping cost
  const totalPrice = productData.reduce(
    (total, product) => total + product.price,
    0
  );
  const shippingCost = 12000;
  const totalBill = totalPrice + shippingCost;

  return (
    <Box
      sx={{
        backgroundColor: "#f4e4d8",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Typography
        variant="h4"
        mb={3}
        sx={{ fontWeight: "bold", textAlign: "center" }}
        color="black"
      >
        Pembayaran
      </Typography>

      <Grid2 container spacing={3}>
        {/* Left: Payment Methods */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h6"
            mb={2}
            sx={{ fontWeight: "bold" }}
            color="black"
          >
            Pilih Metode Pembayaran
          </Typography>
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              padding: "20px",
              backgroundColor: "#fff",
            }}
          >
            {["BCA", "QRIS", "Mandiri"].map((method) => (
              <Box
                key={method}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  border:
                    selectedMethod === method
                      ? "2px solid #4caf50"
                      : "2px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    border:
                      selectedMethod !== method
                        ? "2px solid #4caf50"
                        : "2px solid #4caf50",
                  },
                }}
                onClick={() => handlePaymentSelect(method)}
              >
                <Box display="flex" alignItems="center" gap="10px">
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor:
                        selectedMethod === method ? "#4caf50" : "#f44336",
                    }}
                  />
                  <Image
                    src={`/${method.toLowerCase()}-logo.png`}
                    alt={method}
                    width={50}
                    height={25}
                  />
                  <Typography sx={{ color: "black", fontWeight: "bold" }}>
                    {method}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid2>

        {/* Right: Product Details */}
        <Grid2 size={{ xs: 12, md: 6 }}>
          <Paper sx={{ padding: "20px", backgroundColor: "#fff" }}>
            <Typography variant="h6" mb={2} sx={{ fontWeight: "bold" }}>
              Detail Produk
            </Typography>
            {productData.map((product) => (
              <Box
                key={product.id}
                display="flex"
                justifyContent="space-between"
                mb={1}
              >
                <Typography>{product.name}</Typography>
                <Typography>Rp. {product.price.toLocaleString()},-</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" mb={2} sx={{ fontWeight: "bold" }}>
              Ringkasan Harga
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>
                Total Harga ({productData.length} Produk):
              </Typography>
              <Typography>Rp. {totalPrice.toLocaleString()},-</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Ongkos Kirim:</Typography>
              <Typography>Rp. {shippingCost.toLocaleString()},-</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Typography>Total Tagihan:</Typography>
              <Typography>Rp. {totalBill.toLocaleString()},-</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={!selectedMethod}
              sx={{
                fontWeight: "bold",
                backgroundColor: selectedMethod ? "#4caf50" : "#b0b0b0",
                "&:hover": {
                  backgroundColor: selectedMethod ? "#388e3c" : "#b0b0b0",
                },
              }}
            >
              Lanjut Pembayaran
            </Button>
          </Paper>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default PaymentPage;

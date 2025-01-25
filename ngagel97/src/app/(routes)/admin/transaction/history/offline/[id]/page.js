"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Grid2,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useRouter } from "next/navigation";
import CenterLoading from "@/app/(routes)/(public)/components/CenterLoading";

const OfflineDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransaction = async () => {
    try {
      const response = await fetch(`/api/transaction/online/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transaction");
      }
      const data = await response.json();
      setOrder(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  if (loading) return <CenterLoading />;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box sx={{minHeight: "100vh", padding: 4 }}>
      {/* Header Section */}
      <Box mb={4}>
        <Grid2 container alignItems="center" spacing={2}>
          <Grid2 xs={12} sm={6}>
            <IconButton
              onClick={() => router.push("/admin/transaction/history")}
              sx={{
                backgroundColor: "#E0E0E0",
                borderRadius: "8px",
                padding: 1,
                "&:hover": { backgroundColor: "#BDBDBD" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Grid2>
          <Grid2 xs={12} sm={6}>
            <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center" }}>
              Offline Transaction Details
            </Typography>
          </Grid2>
        </Grid2>
      </Box>

      {/* Order Details */}
      <Card elevation={4} sx={{ marginBottom: 4, padding: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Order Information
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Order ID:</strong> {order.idTransaksi}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Status:</strong> {order.status || "-"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Total Price:</strong> Rp. {order.total || "-"}
          </Typography>
        </CardContent>
      </Card>

      {/* Items Section */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Items
      </Typography>
      <Grid2 container spacing={3}>
        {order.barang.length > 0 ? (
          order.barang.map((item, index) => (
            <Grid2 xs={12} sm={6} md={4} key={index}>
              <Card elevation={4} sx={{ padding: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {item.nama}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Quantity: {item.qty}
                  </Typography>
                  <Typography variant="body1">Price: Rp. {item.harga}</Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))
        ) : (
          <Grid2 xs={12}>
            <Typography variant="body1">No Items</Typography>
          </Grid2>
        )}
      </Grid2>

      {/* Services Section */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ marginTop: 4 }}>
        Services
      </Typography>
      <Grid2 container spacing={3}>
        {order.jasa.length > 0 ? (
          order.jasa.map((service, index) => (
            <Grid2 xs={12} sm={6} md={4} key={index}>
              <Card elevation={4} sx={{ padding: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {service.nama}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Sheets: {service.lembar} | Copies: {service.qty}
                  </Typography>
                  <Typography variant="body1">Price: Rp. {service.harga}</Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))
        ) : (
          <Grid2 xs={12}>
            <Typography variant="body1">No Services</Typography>
          </Grid2>
        )}
      </Grid2>

      {/* Add-Ons Section */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ marginTop: 4 }}>
        Add-Ons
      </Typography>
      <Grid2 container spacing={3}>
        {order.addOns.length > 0 ? (
          order.addOns.map((addOn, index) => (
            <Grid2 xs={12} sm={6} md={4} key={index}>
              <Card elevation={4} sx={{ padding: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {addOn.nama}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Quantity: {addOn.qty}
                  </Typography>
                  <Typography variant="body1">Price: Rp. {addOn.harga}</Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))
        ) : (
          <Grid2 xs={12}>
            <Typography variant="body1">No Add-Ons</Typography>
          </Grid2>
        )}
      </Grid2>
    </Box>
  );
};

export default OfflineDetail;

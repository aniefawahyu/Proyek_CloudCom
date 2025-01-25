"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Grid2,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams, useRouter } from "next/navigation";
import CenterLoading from "@/app/(routes)/(public)/components/CenterLoading";

const TransactionDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  const fetchTransaction = async () => {
    try {
      const response = await fetch(`/api/transaction/online/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transaction");
      }
      const data = await response.json();
      setOrder(data.data);

      const userResponse = await fetch(`/api/user/${data.data.userId}`);
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();
      setUser(userData.data.user);

      if (data.data.adminId) {
        const adminResponse = await fetch(`/api/user/${data.data.adminId}`);
        if (!adminResponse.ok) {
          throw new Error("Failed to fetch admin data");
        }
        const adminData = await adminResponse.json();
        setAdmin(adminData.data.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const handleOpenDialog = (type) => {
    setActionType(type);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setActionType(null);
  };

  const updateOrderStatus = async () => {
    if (!actionType) return;
    const newStatus = actionType === "deliver" ? "progress" : "completed";

    try {
      const response = await fetch(`/api/transaction/online/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      const updatedOrder = await response.json();

      if (newStatus === "completed") {
        router.push("/admin/order");
      } else {
        fetchTransaction();
      }
    } catch (err) {
      console.error("Error updating order status:", err.message);
    } finally {
      handleCloseDialog();
    }
  };

  if (loading) return <CenterLoading />;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box
      sx={{ 
        minHeight: "100vh",
        padding: 4,
        fontFamily: "Roboto, sans-serif",
      }}
    >
      {/* Header Section */}
      <Box mb={4}>
        <Grid2 container alignItems="center" spacing={2}>
          <Grid2 xs={12} sm={6}>
            <IconButton
              onClick={() => router.push("/admin/transaction/history")}
              sx={{
                backgroundColor: "#FFFFFF",
                boxShadow: 1,
                "&:hover": { backgroundColor: "#E0E0E0" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Grid2>
          <Grid2 xs={12} sm={6} textAlign={{ xs: "center", sm: "right" }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: "#333333" }}
            >
              Transaction Details
            </Typography>
          </Grid2>
        </Grid2>
      </Box>

      {/* Order Details */}
      <Card elevation={3} sx={{ marginBottom: 4, borderRadius: 2 }}>
        <CardContent>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "#3F51B5" }}
          >
            Order Information
          </Typography>
          <Typography variant="body1">
            <strong>Order ID:</strong> {order.idTransaksi}
          </Typography>
          <Typography variant="body1">
            <strong>Admin Name:</strong> {admin?.name || "-"}
          </Typography>
          <Typography variant="body1">
            <strong>Customer Name:</strong> {user?.name || "-"}
          </Typography>
          <Typography variant="body1">
            <strong>Phone Number:</strong> {user?.phone_number || "-"}
          </Typography>
          <Typography variant="body1">
            <strong>Address:</strong> {order.alamat || "-"}
          </Typography>
          <Typography variant="body1">
            <strong>Notes:</strong> {order.notes || "-"}
          </Typography>
          <Typography variant="body1">
            <strong>Total Price:</strong> Rp. {order.total || "-"}
          </Typography>
        </CardContent>
      </Card>

      {/* List of Services */}
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
        sx={{ color: "#3F51B5" }}
      >
        Services and Add-Ons
      </Typography>
      <Grid2 container spacing={2}>
        {order.jasa.map((jasa, index) => (
          <Grid2 xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              elevation={3}
              sx={{
                height: "100%",
                borderRadius: 2,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ color: "#333333" }}
                >
                  {jasa.nama}
                </Typography>
                <Typography variant="body1">
                  <strong>Sheets:</strong> {jasa.lembar} | <strong>Copies:</strong> {jasa.qty} | <strong>Price:</strong> Rp. {jasa.harga}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginTop: 1 }}
                >
                  Notes: {jasa.notes || "-"}
                </Typography>
                {jasa.addOns.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Add-Ons:
                    </Typography>
                    {jasa.addOns.map((addOn, idx) => (
                      <Typography key={idx} variant="body2">
                        - {addOn.nama} per {addOn.tipeHarga === "lembar" ? "sheet" : "copy"} {addOn.qty} for Rp. {addOn.harga}
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default TransactionDetailPage;

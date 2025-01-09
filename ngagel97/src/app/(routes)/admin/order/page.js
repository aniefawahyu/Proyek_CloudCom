"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CenterLoading from "../../(public)/components/CenterLoading";

const TransactionOrderPage = () => {
  const [orders, setOrders] = useState([]); // State to store transaction data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State to display errors
  const [users, setUsers] = useState({}); // State to store user data
  const router = useRouter();

  // Fetch data from API when component first loads
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transaction/online/admin");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data = await response.json();
        setOrders(data.data.orders);

        // Fetch user data for each order
        const userIds = [
          ...new Set(data.data.orders.map((order) => order.userId)),
        ];
        const userPromises = userIds.map((userId) =>
          fetch(`/api/user/${userId}`).then((res) =>
            res.ok ? res.json() : Promise.reject("Failed to fetch user data")
          )
        );
        const usersData = await Promise.all(userPromises);
        const usersMap = usersData.reduce((acc, userData) => {
          acc[userData.data.user._id] = userData.data.user;
          return acc;
        }, {});

        setUsers(usersMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <CenterLoading />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Typography variant="h4" mb={3} color="black" fontWeight="bold">
        ORDERS
      </Typography>
      {/* Error Handling */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: "20px" }}>
          {error}
        </Alert>
      )}

      {/* Display Transaction Data */}
      <Box display="flex" flexDirection="column" gap="20px">
        {orders.length > 0
          ? orders.map((order) => (
              <Paper
                key={order._id}
                onClick={() => router.push(`/admin/order/${order._id}`)} // Navigate to detail page
                sx={{
                  padding: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                {/* Left: Product Details */}
                <Box display="flex" alignItems="center" gap="15px">
                  <Box>
                    <Typography variant="h6">{`Purchase By: ${
                      users[order.userId]?.name || "-"
                    }`}</Typography>
                    <Typography variant="body1" sx={{ color: "#6d6d6d" }}>
                      Location: {order.alamat}
                    </Typography>
                  </Box>
                </Box>

                {/* Right: Order Status */}
                <Box textAlign="right">
                  <Typography variant="body2" sx={{ marginBottom: "8px" }}>
                    Purchase On{" "}
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      timeZone: "Asia/Jakarta",
                    })}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      width: 100,
                      backgroundColor:
                        order.status === "pending"
                          ? "#D64649"
                          : order.status === "progress"
                          ? "#FFB340"
                          : "#36B93C",
                      color: "#fff",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor:
                          order.status === "pending"
                            ? "#D61A1E"
                            : order.status === "progress"
                            ? "#FB9903"
                            : "#00AD08",
                      },
                    }}
                  >
                    {order.status.toUpperCase()}
                  </Button>
                </Box>
              </Paper>
            ))
          : !loading && (
              <Typography
                variant="body1"
                color="textSecondary"
                textAlign="center"
              >
                No pending orders.
              </Typography>
            )}
      </Box>
    </Box>
  );
};

export default TransactionOrderPage;
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import DetailOrder from "../../(public)/components/DetailOrder";

const UserOrderPage = () => {
  const [filter, setFilter] = useState("All");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/transaction/online/customer");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();

        // Filter orders with specific status
        const filteredOrders = data.data.orders.filter(order =>
          ["completed", "progress", "pending"].includes(order.status)
        );

        setOrders(filteredOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDetailClick = (idTransaksi) => {
    const order = orders.find((o) => o.idTransaksi === idTransaksi);
    if (!order) {
      alert("Order not found. Please check the ID or ensure the order exists.");
    } else {
      setSelectedOrder(order);
    }
  };

  // Calculate total sheets by summing 'lembar' from each service
  const calculateTotalLembar = (jasa) => {
    return jasa.reduce((total, item) => total + item.lembar, 0);
  };

  const sortedOrders = orders
    .filter((order) => filter === "All" || order.status === filter)
    .sort((a, b) => a.status.localeCompare(b.status));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Box sx={{ backgroundColor: "#f4e4d8", minHeight: "100vh", padding: "20px" }}>
      <Typography variant="h4" mb={3} color="black">
        Order Status
      </Typography>

      <Select
        value={filter}
        onChange={handleFilterChange}
        displayEmpty
        sx={{
          backgroundColor: "#fff",
          padding: "5px 10px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="pending">Pending</MenuItem>
        <MenuItem value="progress">On Progress</MenuItem>
        <MenuItem value="completed">Completed</MenuItem>
      </Select>

      <Box display="flex" flexDirection="column" gap="20px">
        {sortedOrders.map((order) => (
          <Paper
            key={order.idTransaksi}
            sx={{
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <Box>
              <Typography variant="h6">{`Order ID: ${order.idTransaksi}`}</Typography>
              <Typography variant="body1" sx={{ color: "#6d6d6d" }}>
                Total: Rp.{order.total}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6d6d6d" }}>
                Sheets: {calculateTotalLembar(order.jasa)} sheets
              </Typography>
              <Typography variant="body2" sx={{ color: "#6d6d6d" }}>
                Shipping: Rp.{order.ongkir || "0"}
              </Typography>
              <Typography variant="body2" sx={{ color: "#6d6d6d" }}>
                Total Without Shipping: Rp.{order.total - (order.ongkir || 0)}
              </Typography>
            </Box>

            <Box textAlign="right" display="flex" flexDirection="column" alignItems="flex-end">
              <Typography variant="body2" sx={{ marginBottom: "8px" }}>
                {`Order ${order.status} on ${formatDate(order.createdAt)} ${new Date(
                  order.createdAt
                ).toLocaleTimeString()}`}
              </Typography>
              <Box display="flex" gap="10px" justifyContent="flex-end">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: (() => {
                      switch (order.status) {
                        case "pending":
                          return "#f9a825";
                        case "progress":
                          return "#2196f3";
                        case "completed":
                          return "#4caf50";
                        default:
                          return "#ccc";
                      }
                    })(),
                    color: "#fff",
                    textTransform: "none",
                    "&:hover": {
                      opacity: 0.9,
                    },
                  }}
                >
                  {(() => {
                    switch (order.status) {
                      case "pending":
                        return `Pending`;
                      case "progress":
                        return `In Progress`;
                      case "completed":
                        return `Completed`;
                      default:
                        return "Unknown Status";
                    }
                  })()}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleDetailClick(order.idTransaksi)}
                >
                  Details
                </Button>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {selectedOrder && (
        <DetailOrder
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </Box>
  );
};

export default UserOrderPage;

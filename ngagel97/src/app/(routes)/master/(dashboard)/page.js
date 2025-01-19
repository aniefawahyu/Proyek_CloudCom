"use client";

import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
} from "@mui/material";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transaction/online/master");
      const transactionsArray = response.data.data.orders || [];

      setTransactions(transactionsArray);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Calculate total transactions
  const totalTransactions = transactions.length;

  // Calculate total revenue (completed)
  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.total, 0);

  // Offline transactions
  const offlineTransactions = transactions.filter((t) => !t.isOnline).length;

  // Transactions happening today
  const today = new Date();
  const transactionsToday = transactions.filter((t) => {
    const transactionDate = new Date(t.createdAt);
    return (
      transactionDate.getDate() === today.getDate() &&
      transactionDate.getMonth() === today.getMonth() &&
      transactionDate.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <div style={{ minHeight: "100vh", padding: "20px" }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            bgcolor: "#b08968",
            p: 2,
            borderRadius: "4px 4px 0 0",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ color: "white" }}>
            Master Dashboard
          </Typography>
        </Box>

        {/* Info Boxes */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">Total Transactions</Typography>
              <Typography variant="h4">{totalTransactions}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">Total Earning</Typography>
              <Typography variant="h4">Rp {totalRevenue.toLocaleString()}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">Offline Transactions</Typography>
              <Typography variant="h4">{offlineTransactions}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">Transactions Today</Typography>
              <Typography variant="h4">{transactionsToday}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Line Chart */}
        <Box sx={{ mt: 5 }}>
          <Paper sx={{ p: 3 }}>
            {transactions.length === 0 ? (
              <Typography variant="h6" align="center" color="text.secondary">
                No transaction data available
              </Typography>
            ) : (
              <Line
                data={{
                  labels: transactions.map((t) =>
                    new Date(t.createdAt).toLocaleDateString()
                  ),
                  datasets: [
                    {
                      label: "Total Transactions",
                      data: transactions.map((t) => t.total || 0),
                      borderColor: "rgba(75, 192, 192, 1)",
                      backgroundColor: "rgba(75, 192, 192, 0.5)",
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Total Transaction Chart",
                    },
                  },
                }}
              />
            )}
          </Paper>
        </Box>
      </Container>
    </div>
  );
};

export default DashboardPage;

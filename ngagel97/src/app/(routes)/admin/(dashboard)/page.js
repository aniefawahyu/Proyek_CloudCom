"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";
import CenterLoading from "../../(public)/components/CenterLoading";

const DashboardPage = () => {
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentHistory, setRecentHistory] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch orders data
        const orderResponse = await fetch("/api/transaction/online/admin");
        if (!orderResponse.ok) throw new Error("Failed to fetch orders");
        const orderData = await orderResponse.json();
        const recentOrdersData = orderData.data.orders.slice(0, 3);

        // Fetch history data
        const historyResponse = await fetch(
          "/api/transaction/online/admin/history"
        );
        if (!historyResponse.ok) throw new Error("Failed to fetch history");
        const historyData = await historyResponse.json();
        const recentHistoryData = historyData.data.orders.slice(0, 3);

        // Extract unique userIds from both orders and history
        const userIds = [
          ...new Set([
            ...recentOrdersData.map(order => order.userId),
            ...recentHistoryData.map(history => history.userId)
          ].filter(Boolean))
        ];

        // Fetch user data for each userId
        const usersMap = {};
        await Promise.all(
          userIds.map(async (userId) => {
            try {
              const userResponse = await fetch(`/api/user/${userId}`);
              if (userResponse.ok) {
                const userData = await userResponse.json();
                usersMap[userId] = userData.data.user;
              }
            } catch (error) {
              console.error(`Failed to fetch user data for ID ${userId}:`, error);
              usersMap[userId] = { name: "Offline Transaction" }; // Fallback for failed user fetch
            }
          })
        );

        setUsers(usersMap);
        setRecentOrders(recentOrdersData);
        setRecentHistory(recentHistoryData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getUserName = (userId) => {
    return users[userId]?.name || "Offline Transaction";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) return <CenterLoading />;

  return (
    <Box sx={{ minHeight: "100vh", padding: "20px" }}>
      {/* Dashboard Title */}
      <Typography variant="h4" mb={3} color="black" fontWeight="bold">
        DASHBOARD
      </Typography>

      {/* Error Handling */}
      {error && (
        <Alert severity="error" sx={{ marginBottom: "20px" }}>
          {error}
        </Alert>
      )}

      {/* Recent Orders Section */}
      <Typography variant="h6" mb={2} fontWeight="bold">
        Recent Orders
      </Typography>
      <Box display="flex" flexDirection="column" gap="20px" mb={3}>
        {recentOrders.length > 0 ? (
          recentOrders.map((order) => (
            <Paper
              key={order._id}
              onClick={() => router.push(`/admin/order/${order._id}`)}
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
              <Box>
                <Typography variant="h6">{getUserName(order.userId)}</Typography>
                <Typography variant="body1" sx={{ color: "#6d6d6d" }}>
                  Location: {order.alamat || "Offline Store"}
                </Typography>
              </Box>
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
            </Paper>
          ))
        ) : (
          <Typography color="textSecondary">No recent orders.</Typography>
        )}
      </Box>

      <Button
        variant="contained"
        onClick={() => router.push("/admin/order")}
        sx={{ marginBottom: 5, width: "100%" }}
      >
        View All Orders
      </Button>

      {/* Recent Transaction History Section */}
      <Typography variant="h6" mb={2} fontWeight="bold">
        Recent Transaction History
      </Typography>
      <Box display="flex" flexDirection="column" gap="20px">
        {recentHistory.length > 0 ? (
          recentHistory.map((history) => (
            <Paper
              key={history._id}
              onClick={() =>
                router.push(`/admin/transaction/history/${history._id}`)
              }
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
              <Box>
                <Typography variant="h6">{getUserName(history.userId)}</Typography>
                <Typography variant="body1" sx={{ color: "#6d6d6d" }}>
                  Location: {history.alamat || "Offline Store"}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6d6d6d", mt: 1 }}>
                  {formatDate(history.createdAt)} • {formatCurrency(history.total)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: history.isOnline ? "#4caf50" : "#ff9800",
                  '&:hover': {
                    backgroundColor: history.isOnline ? "#45a049" : "#f57c00"
                  }
                }}
              >
                {history.isOnline ? "Online" : "Offline"}
              </Button>
            </Paper>
          ))
        ) : (
          <Typography color="textSecondary">No recent history.</Typography>
        )}
      </Box>

      <Button
        variant="contained"
        onClick={() => router.push("/admin/transaction/history")}
        sx={{ width: "100%", marginTop: 3 }}
      >
        View Transaction History
      </Button>
    </Box>
  );
};

export default DashboardPage;
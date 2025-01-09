"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  Container,
  Button,
} from "@mui/material";

const StatusPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user");
        console.log(response);

        const data = await response.json();
        const filteredUsers = data.filter((user) => user.role !== "master");

        setUsers(filteredUsers); // Set users data to state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Function to update user role
  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      const data = await response.json();
      alert(data.message); // Show success message
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role");
    }
  };

  // Function to ban or unban user
  const handleToggleBan = async (userId, currentStatus) => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      const data = await response.json();
      alert(data.message); // Show success message
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, deleted: !user.deleted } : user
        )
      );
    } catch (error) {
      console.error("Error banning/unbanning user:", error);
      alert("Failed to update user status");
    }
  };

  // Function to get status color
  const getStatusColor = (status) => {
    return !status ? "#4caf50" : "#f44336"; // Green for Available, Red for Ban
  };

  return (
    <div
      style={{
        // backgroundColor: "#F5E6D3",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
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
          <Typography variant="h6" sx={{ color: "white" }}>
            Status User
          </Typography>
        </Box>

        {/* Table */}
        <Paper sx={{ p: 3, mt: 3 }}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#d7ccc8" }}>
                    <TableCell align="center">
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Phone Number</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Role</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell align="center">
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:nth-of-type(odd)": { bgcolor: "#fafafa" } }}
                    >
                      <TableCell align="center">{user.email}</TableCell>
                      <TableCell align="center">{user.name}</TableCell>
                      <TableCell align="center">{user.phone_number}</TableCell>
                      <TableCell align="center">{user.role}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={user.deleted ? "Banned" : "Active"}
                          sx={{
                            backgroundColor: getStatusColor(user.deleted),
                            color: "white",
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="white"
                          onClick={() =>
                            handleUpdateRole(
                              user._id,
                              user.role === "admin" ? "customer" : "admin"
                            )
                          }
                          sx={{ mr: 1, bgcolor: "#493628", color: "white" }}
                        >
                          Change Role
                        </Button>
                        <Button
                          variant="contained"
                          color={!user.deleted ? "error" : "success"}
                          onClick={() => handleToggleBan(user._id, user.status)}
                        >
                          {!user.deleted ? "Ban" : "Unban"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default StatusPage;

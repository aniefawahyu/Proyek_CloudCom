"use client";

import React, { useState, useEffect } from "react";
import Grid2 from "@mui/material/Grid2";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  TextField,
  Tooltip,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import CenterLoading from "../../(public)/components/CenterLoading";

const ItemPage = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/barang");
        const data = await response.json();
        setItems(data);
        setFilteredItems(data); // Awalnya semua data ditampilkan
        setLoading(false);
      } catch (error) {
        setLoading(false);
        throw new Error("Gagal mengambil data barang:", error);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = items.filter((item) =>
        item.nama.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredItems(filtered);
    }, 500); // Delay 500ms untuk debouncing

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, items]);

  const handleDelete = async (id) => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus barang ini?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/barang/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Gagal menghapus data barang.");
      }

      setItems((prevItems) => prevItems.filter((item) => item.idBarang !== id));
    } catch (error) {
      throw new Error("Gagal menghapus barang:", error);
    }
  };

  if (loading) {
    return <CenterLoading />;
  }

  return (
    <Box
      sx={{ padding: "20px", backgroundColor: "#D6C0B3", minHeight: "100vh" }}
    >
      {/* Kotak Header */}
      <Box
        sx={{
          backgroundColor: "#AB886D",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "white",
              textTransform: "uppercase",
              marginTop: "10px",
            }}
          >
            Items
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {/* <Button
              variant="contained"
              color="primary"
              onClick={() => {
                window.location.href = "/master/item/add";
              }}
              sx={{
                textTransform: "none",
                backgroundColor: "#493628",
                fontSize: "16px",
                padding: "12px 36px",
                "&:hover": {
                  backgroundColor: "#493628",
                },
              }}
            >
              Add Barang
            </Button> */}
            <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Typography
                variant="body1"
                component="span"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Search:
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Type Item Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Daftar Barang */}
      <Grid2 container spacing={4} justifyContent="center">
        {filteredItems.map((item) => (
          <Grid2 key={item.idBarang} xs={12} sm={12} md={6}>
            <Card
              sx={{
                width: 1200,
                margin: "auto",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                gap: "16px",
              }}
            >
              {/* Content Section */}
              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Item Details */}
                <div>
                  <Typography
                    variant="h6"
                    component="div"
                    gutterBottom
                    sx={{ color: "#5A4634", fontWeight: "bold" }}
                  >
                    {item.nama}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                  >
                    Harga: Rp {item.harga},-
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontStyle: "italic",
                      marginTop: "8px",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 2,
                      overflow: "hidden",
                    }}
                  >
                    Deskripsi: {item.deskripsi || "Deskripsi tidak tersedia"}
                  </Typography>
                </div>
              </CardContent>

              {/* Action Buttons */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <Link href={`/master/item/${item.idBarang}`} passHref>
                  <Button variant="contained" color="primary" size="small">
                    Detail
                  </Button>
                </Link>
                <Tooltip title="Delete">
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.idBarang);
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Tooltip>
              </Box>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default ItemPage;

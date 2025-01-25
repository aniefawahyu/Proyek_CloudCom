"use client";

import React, { useState, useEffect } from "react";
import Grid2 from "@mui/material/Grid2";
import {
  Button,
  Typography,
  Card,
  CardContent,
  TextField,
  Box,
  Tooltip,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import CenterLoading from "../../(public)/components/CenterLoading";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/jasa");
        const data = await response.json();
        setServices(data);
        setFilteredServices(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Gagal mengambil data jasa:", error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = services.filter((service) =>
        service.nama.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredServices(filtered);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, services]);

  const handleDelete = async (id) => {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus jasa ini?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/jasa/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Gagal menghapus data jasa.");
      }

      setServices((prevServices) =>
        prevServices.filter((service) => service.idJasa !== id)
      );
    } catch (error) {
      console.error("Gagal menghapus jasa:", error);
    }
  };

  if (loading) {
    return <CenterLoading />;
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#D6C0B3" }}>
      <Box
        sx={{
          backgroundColor: "#AB886D",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
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
            Services
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "24px" }}>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type Service Name"
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
        </div>
      </Box>

      {/* Service Cards */}
      <Grid2
        container
        spacing={3}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        {filteredServices.map((service) => (
          <Grid2 key={service.idJasa} xs={12} sm={12} md={6}>
            <Card
              sx={{
                width: 1200,
                margin: "auto",
                display: "grid",
                gridTemplateColumns: "180px auto",
                gap: "16px",
                alignItems: "center",
                padding: "16px",
              }}
            >
              {/* Image Section */}
              {service.gambar ? (
                <Image
                  src={service.gambar}
                  alt={service.nama || "Gambar Jasa"}
                  width={180}
                  height={180}
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <Image
                  src="/image/380x200.png" // Placeholder image
                  alt="Gambar Jasa"
                  width={180}
                  height={180}
                  style={{
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}

              {/* Content Section */}
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  flexGrow: 1,
                }}
              >
                {/* Text Details */}
                <div>
                  <Typography variant="h6" component="div" gutterBottom>
                    {service.nama}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Harga: Rp {service.harga},-
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
                    Deskripsi: {service.deskripsi || "Deskripsi tidak tersedia"}
                  </Typography>
                </div>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    gap: "10px",
                    marginTop: "auto",
                  }}
                >
                  <Link href={`/master/service/${service.idJasa}`} passHref>
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
                        handleDelete(service.idJasa);
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
};

export default ServicesPage;

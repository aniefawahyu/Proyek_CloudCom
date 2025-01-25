"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid2
} from "@mui/material";
import Image from "next/image";

const HomePage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/jasa");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleCardClick = (idjasa) => {
    router.push(`/product/${idjasa}`);
  };

  return (
    <Box p={4} mt={5}>
      {/* Banner Section with custom image */}
      <Box sx={{ width: "100%", height: 200, position: "relative", mb: 4 }}>
        <Image
          src="/image/Carousel1.jpg" // Ganti dengan path gambar Anda
          alt="Banner Image"
          layout="fill" // Membuat gambar mengisi area secara responsif
          objectFit="cover" // Agar gambar tetap terpotong dan mengikuti ukuran kontainer
          priority
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.4)", // Memberikan overlay transparan untuk teks lebih terlihat
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Explore Our High-Quality Services
          </Typography>
        </Box>
      </Box>

      {/* Icons Section */}
      <Grid2 container spacing={2} justifyContent="center" mb={4} mt={10}>
        <Grid2 xs={6} sm={3}>
          <Box textAlign="center" sx={{ mb: 2, mx: 1 }}>
            <Image
              src="/image/DigitalPrinting.png"
              alt="High Digital Printing"
              width={80}
              height={80}
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1">High Digital Printing</Typography>
          </Box>
        </Grid2>
        <Grid2 xs={6} sm={3}>
          <Box textAlign="center" sx={{ mb: 2, mx: 1 }}>
            <Image
              src="/image/GreatQuality.png"
              alt="Great Quality"
              width={80}
              height={80}
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1">Great Quality</Typography>
          </Box>
        </Grid2>
        <Grid2 xs={6} sm={3}>
          <Box textAlign="center" sx={{ mb: 2, mx: 1 }}>
            <Image
              src="/image/HandledWithCare.png"
              alt="Handled With Care"
              width={80}
              height={80}
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1">Handled With Care</Typography>
          </Box>
        </Grid2>
        <Grid2 xs={6} sm={3}>
          <Box textAlign="center" sx={{ mb: 2, mx: 1 }}>
            <Image
              src="/image/FastDelivery.png"
              alt="Fast Delivery"
              width={80}
              height={80}
              style={{ marginBottom: 8 }}
            />
            <Typography variant="body1">Fast Delivery</Typography>
          </Box>
        </Grid2>
      </Grid2>

      {/* Services Section */}
      <Typography variant="h6" fontWeight="bold" mb={5} ml={15} mt={5}>
        Our Services
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid2 container spacing={3} justifyContent="center">
          {services.map((service) => (
            <Grid2 xs={12} sm={6} md={4} lg={3} key={service._id}>
              <Card
                sx={{
                  cursor: "pointer",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                  transition: "transform 0.2s",
                  position: "relative",
                  width: 280, // Set consistent width
                  height: 350, // Set consistent height
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                  "&:hover .addons": {
                    opacity: 1,
                  },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                onClick={() => handleCardClick(service.idJasa)}
              >
                {/* Image Section */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 200,
                  }}
                >
                  {service.gambar ? (
                    <Image
                      src={service.gambar}
                      alt={service.nama || "Gambar Jasa"}
                      width={280}
                      height={200}
                      style={{
                        objectFit: "cover",
                        borderTopLeftRadius: "4px",
                        borderTopRightRadius: "4px",
                      }}
                    />
                  ) : (
                    <Image
                      src="/image/380x200.png"
                      alt="Gambar Jasa"
                      width={280}
                      height={200}
                      style={{
                        objectFit: "cover",
                        borderTopLeftRadius: "4px",
                        borderTopRightRadius: "4px",
                      }}
                    />
                  )}
                </Box>

                {/* Add-ons Overlay */}
                <Box
                  className="addons"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: 0,
                    transition: "opacity 0.2s ease-in-out",
                    padding: 2,
                  }}
                >
                  <Typography variant="h6" mb={1}>
                    See more details
                  </Typography>
                </Box>

                {/* Content Section */}
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="body1" fontWeight="bold">
                    {service.nama}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ marginTop: 1 }}
                  >
                    {service.deskripsi || "No description available"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      )}
    </Box>
  );
};

export default HomePage;
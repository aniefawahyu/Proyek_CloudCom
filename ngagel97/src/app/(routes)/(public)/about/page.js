import React from "react";
import {
  Container,
  Box,
  Typography,
  Grid,
  Divider,
  IconButton,
} from "@mui/material";
import { Email, Instagram, WhatsApp } from "@mui/icons-material";
import Image from "next/image";

const AboutUsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box textAlign="center" mb={6}>
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            backgroundColor: "#AB886D",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto",
          }}
        >
          <Image
            src="/image/Ngagel97Logo.png"
            alt="Fotocopy Ngagel 97 Logo"
            width={100}
            height={100}
          />
        </Box>
        <Typography variant="h5" color="text.secondary" sx={{ mt: 3, mb: 3 }}>
          ABOUT US
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>

      {/* Content with Images */}
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 6 }}>
        {/* Section 1 */}
        <Grid item xs={12} md={8} textAlign="center">
          <Typography variant="body1" sx={{ mt: 2 }}>
            Berdiri sejak 1997 di Jalan Ngagel Jaya Tengah, Surabaya, Fotocopy
            Ngagel 97 telah menjadi mitra utama bagi mahasiswa dan masyarakat
            sekitar dalam pencetakan dokumen penting selama hampir 30 tahun.
            Dengan website ini, pelanggan kini pelanggan dapat memesan layanan
            percetakan di manapun dan kapanpun.
          </Typography>
        </Grid>

        {/* Shared Image Section */}
        <Grid item xs={12} md={6}>
          <Image
            src="/image/about_illustration.webp"
            alt="Shared Image"
            width={500}
            height={500}
            style={{ borderRadius: 5, objectFit: "cover", width: "100%" }}
          />
        </Grid>
      </Grid>
      <Divider sx={{ mb: 6 }} />

      <Box mt={6} mb={6}>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 4, textAlign: "center" }}
        >
          LOKASI KAMI
        </Typography>
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            overflow: "hidden",
            maxWidth: "100%",
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5410.718308485194!2d112.75547871177554!3d-7.291479892685609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fbb3f16cf801%3A0x2fd8ffe8c4fad9d1!2sVindi%20Copy%20Service!5e1!3m2!1sen!2sid!4v1733919511277!5m2!1sen!2sid"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: 5 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Box>
      </Box>
      <Divider sx={{ mb: 6 }} />

      {/* Footer with Icons */}
      <Box mt={6} textAlign="center">
        <Typography variant="h6" sx={{ mb: 4 }}>
          HUBUNGI KAMI
        </Typography>
        <Grid container justifyContent="center" spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              justifyContent="center"
            >
              <IconButton href="mailto:contact@ngagel97.com" color="primary">
                <Email />
              </IconButton>
              <Typography variant="body1">ngagel97@gmail.com</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              justifyContent="center"
            >
              <IconButton
                href="https://instagram.com/ngagel97"
                target="_blank"
                color="secondary"
              >
                <Instagram />
              </IconButton>
              <Typography variant="body1">ngagel97_surabaya</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              justifyContent="center"
            >
              <IconButton
                href="https://wa.me/6281234567890"
                target="_blank"
                color="success"
              >
                <WhatsApp />
              </IconButton>
              <Typography variant="body1">081234567890</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AboutUsPage;

import React from "react";
import { Box, CircularProgress } from "@mui/material";

const CenterLoading = () => {
  return (
    <Box
      sx={{
        position: "fixed", // Menempatkan Box secara tetap di layar
        top: "50%", // Posisikan Box di tengah vertikal
        left: "50%", // Posisikan Box di tengah horizontal
        transform: "translate(-50%, -50%)", // Menyesuaikan posisi untuk benar-benar di tengah
        zIndex: 9999, // Pastikan di atas konten lain
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default CenterLoading;

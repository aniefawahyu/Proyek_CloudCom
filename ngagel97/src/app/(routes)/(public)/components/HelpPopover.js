import React, { useState } from "react";
import { Popover, Typography, IconButton, Box } from "@mui/material";
import HelpOutline from "@mui/icons-material/HelpOutline";

const HelpPopover = ({ nama, image, description }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "help-popover" : undefined;

  return (
    <Box display="inline-block">
      <IconButton aria-describedby={id} onClick={handleClick}>
        <HelpOutline />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            p: 2,
            maxWidth: 400,
          }}
        >
          {image && (
            <img
              src={image}
              alt={nama}
              style={{
                width: "100%",
                maxHeight: 200,
                objectFit: "cover",
                marginBottom: "10px",
              }}
            />
          )}
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
            {nama}
          </Typography>
          <Typography variant="body2">{description}</Typography>
        </Box>
      </Popover>
    </Box>
  );
};

export default HelpPopover;

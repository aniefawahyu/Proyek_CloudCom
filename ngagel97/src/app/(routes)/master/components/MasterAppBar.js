"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const settings = [{ link: "/login", text: "Logout" }];

function MasterAppBar() {
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    router.push("/login");
  };
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#AB886D",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}></IconButton>
          <Avatar
            alt="Ngagel97"
            src="/image/Ngagel97Logo.png"
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/master"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "",
              fontWeight: 600,
              letterSpacing: "",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Ngagel97
          </Typography>
          <Avatar
            alt="Ngagel97"
            src="/image/Ngagel97Logo.png"
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/master"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "",
              fontWeight: 600,
              letterSpacing: "",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Ngagel97
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Account">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="avatar" src="" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.text}
                  onClick={() => {
                    handleCloseUserMenu();
                    if (setting.text === "Logout") {
                      handleLogout();
                    }
                  }}
                >
                  <Link
                    href={setting.link}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      textAlign: "center",
                    }}
                  >
                    {setting.text}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default MasterAppBar;

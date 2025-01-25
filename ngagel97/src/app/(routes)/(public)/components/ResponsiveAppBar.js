"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "@mui/material";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

const defaultPages = [
  { link: "/home", text: "Home" },
  { link: "/about", text: "About" },
];
const defaultSettings = [{ link: "/login", text: "Login" }];

function ResponsiveAppBar() {
  const [pages, setPages] = useState(defaultPages);
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const checkRole = () => {
      const userRole = Cookies.get("role");
      const userToken = Cookies.get("token");

      if (userToken && userRole && userRole.toLowerCase() === "customer") {
        setPages([
          { link: "/home", text: "Home" },
          { link: "/about", text: "About" },
          { link: "/cart", text: "Cart" },
          { link: "/order", text: "Order" },
        ]);
        setSettings([
          { link: "/profile", text: "Profile" },
          { link: "/login", text: "Logout" },
        ]);
      } else {
        setPages(defaultPages);
        setSettings(defaultSettings);
      }
    };

    checkRole();
    const interval = setInterval(checkRole, 1000);
    return () => clearInterval(interval);
  }, []);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
  };
  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#AB886D" }}>
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
            href="/home"
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

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.text} onClick={handleCloseNavMenu}>
                  <Link
                    href={page.link}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    {page.text}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Avatar
            alt="Ngagel97"
            src="/image/Ngagel97Logo.png"
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/home"
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
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                href={page.link}
                key={page.text}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: "white",
                  display: "block",
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                {page.text}
              </Button>
            ))}
          </Box>

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
export default ResponsiveAppBar;

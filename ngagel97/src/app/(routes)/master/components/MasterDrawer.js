import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SummarizeIcon from '@mui/icons-material/Summarize';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import CreateIcon from '@mui/icons-material/Create';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const products = [
  {
    link: "/master/addon",
    text: "Addon",
    icon: <AttachFileIcon/>,
    subMenu: [
      { link: "/master/addon/add", text: "Add Addon", icon: <AddIcon /> },
    ],
  },
  {
    link: "/master/service",
    text: "Service",
    icon: <MiscellaneousServicesIcon />,
    subMenu: [
      { link: "/master/service/add", text: "Add Service", icon: <AddIcon /> },
    ],
  },
  {
    link: "/master/item",
    text: "Item",
    icon: <CreateIcon />,
    subMenu: [
      { link: "/master/item/add", text: "Add Item", icon: <AddIcon /> },
    ],
  },
];

const menu = [
  { link: "/master", text: "Dashboard", icon: <HomeIcon /> },
  { link: "/master/user", text: "User", icon:  <PersonIcon /> },
  {
    text: "Reports",
    icon: <SummarizeIcon />,
    children: [
      { link: "/master/report/sales", text: "Sales", icon: <TrendingUpIcon /> },
      { link: "/master/report/daily", text: "Daily", icon: <QueryStatsIcon /> },
    ],
  },
];

export default function MasterDrawer() {
  const [open, setOpen] = React.useState({});

  const handleClick = (text) => {
    setOpen((prevState) => ({
      ...prevState,
      [text]: !prevState[text],
    }));
  };

  const renderListItems = (items) => {
    return items.map((item, index) => (
      <ListItemButton
        key={`list-${item.text}-${index}`}
        component="a"
        href={item.link}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItemButton>
    ));
  };

  const renderNestedListItems = (item) => {
    return (
      <React.Fragment key={`nested-${item.text}`}>
        {" "}
        {/* Tambahkan key */}
        <ListItemButton onClick={() => handleClick(item.text)}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
          {open[item.text] ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open[item.text]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child, index) => (
              <ListItemButton
                key={`child-${child.text}-${index}`} // Kombinasi untuk unik
                sx={{ pl: 4 }}
                component="a"
                href={child.link}
              >
                <ListItemIcon>{child.icon}</ListItemIcon>
                <ListItemText primary={child.text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </React.Fragment>
    );
  };

  return (
    <Box sx={{ overflow: "auto" }}>
      <List
        key={"a"}
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Menu
          </ListSubheader>
        }
      >
        {menu.map((item, index) =>
          item.children ? (
            <React.Fragment key={`menu-${index}`}>
              {" "}
              {/* Tambahkan key pada Fragment */}
              {renderNestedListItems(item)}
            </React.Fragment>
          ) : (
            renderListItems([item])
          )
        )}
      </List>
      <Divider />
      <List
        key={"b"}
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Products
          </ListSubheader>
        }
      >
        {products.map((product) => (
          <React.Fragment key={product.text}>
            {" "}
            {/* Tambahkan key pada Fragment */}
            {/* Produk Utama */}
            <ListItemButton component="a" href={product.link}>
              <ListItemIcon>{product.icon}</ListItemIcon>
              <ListItemText primary={product.text} />
            </ListItemButton>
            {/* Menu Tambahan */}
            {product.subMenu &&
              product.subMenu.map((sub, index) => (
                <ListItemButton
                  key={`${product.text}-${index}`} // Kombinasi agar unik
                  sx={{ pl: 4 }}
                  component="a"
                  href={sub.link}
                >
                  <ListItemIcon>{sub.icon}</ListItemIcon>
                  <ListItemText primary={sub.text} />
                </ListItemButton>
              ))}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

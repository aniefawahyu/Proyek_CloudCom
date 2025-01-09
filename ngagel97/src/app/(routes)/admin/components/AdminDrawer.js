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
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from "@mui/icons-material/Drafts";
import PrintIcon from "@mui/icons-material/Print";
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import HistoryIcon from '@mui/icons-material/History';

const menu = [
  { link: "/admin", text: "Dashboard", icon: <HomeIcon /> },
  { link: "/admin/order", text: "Orders", icon: <InboxIcon /> },
  {
    text: "Transactions",
    icon: <BarChartIcon />,
    children: [
      {
        link: "/admin/transaction/offline",
        text: "Offline Transaction",
        icon: <ReceiptLongIcon />,
      },
      { link: "/admin/transaction/history", text: "History", icon: <HistoryIcon /> },
    ],
  },
];

export default function AdminDrawer() {
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
        key={`list-${item.text}-${index}`} // Tambahkan indeks jika diperlukan
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
    </Box>
  );
}

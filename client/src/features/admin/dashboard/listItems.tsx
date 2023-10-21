import {
  BadgeOutlined,
  Category,
  DashboardCustomize,
  Groups,
  Home,
  Info,
  Task,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import { Link } from "react-router-dom";

const dashboardItems = [
  { title: "Product list", path: "inventory", icon: <DashboardCustomize /> },
  { title: "Home Page Slider list", path: "sliderList", icon: <Home /> },
  { title: "About Us Info", path: "aboutUsList", icon: <Groups /> },
  { title: "Duty List", path: "dutyList", icon: <Task /> },
  { title: "Worker List", path: "workerList", icon: <BadgeOutlined /> },
  { title: "Product Category List", path: "categoryList", icon: <Category /> },
  { title: "Contact info", path: "contactInfo", icon: <Info /> },
];

export const mainListItems = (
  <React.Fragment>
    {dashboardItems.map((item, index) => {
      return (
        <Box
          component={Link}
          to={item.path}
          sx={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemButton>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItemButton>
        </Box>
      );
    })}
  </React.Fragment>
);

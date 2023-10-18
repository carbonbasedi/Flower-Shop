import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { get_random_color, invertHex } from "../../../app/util/util";

const dashboardItems = [
  { title: "Product list", path: "inventory" },
  { title: "Home Page Slider list", path: "sliderList" },
  { title: "About Us Info", path: "aboutUsList" },
  { title: "Duty List", path: "dutyList" },
  { title: "Worker List", path: "workerList" },
];

export default function Dashboard() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="absolute">
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={4}>
            {dashboardItems.map((item, index) => {
              let color = get_random_color();
              return (
                <Grid item xs={12} md={4} lg={3} key={index}>
                  <Box
                    bgcolor={color}
                    component={Link}
                    to={item.path}
                    sx={{
                      p: 2,
                      display: "flex",
                      flexDirection: "column",
                      height: 120,
                      color: invertHex(color),
                      textDecoration: "none",
                    }}
                  >
                    <Typography variant="h6" gutterBottom textAlign="center">
                      {item.title}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <Typography>Here be recent orders</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import Header from "./Header";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./Loading";
import Footer from "./Footer";
import { useAppDispatch } from "../store/configureStore";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import { fetchBasketAsync } from "../../features/basket/basketSlice";
import HomePage from "../../features/home/HomePage";

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchBasketAsync());
    } catch (e) {
      console.log(e);
    }
  }, [dispatch]);

  useEffect(() => {
    initApp().then(() => setLoading(false));
  }, [initApp]);

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      primary: {
        main: "#9ccc65",
      },
      secondary: {
        main: "#1b5e20",
      },
      mode: paletteType,
      background: {
        default: paletteType === "light" ? "#eaeaea" : "#121212",
      },
    },
  });

  function handThemeChange() {
    setDarkMode(!darkMode);
  }

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <CssBaseline />
        {loading ? (
          <Loading message="Initailizing App..." />
        ) : location.pathname === "/" ? (
          <>
            <Header darkMode={darkMode} handleThemeChange={handThemeChange} />
            <HomePage />
            <Footer />
          </>
        ) : location.pathname.includes("/dashboard") ? (
          <>
            <Box>
              <Outlet />
            </Box>
          </>
        ) : (
          <>
            <Header darkMode={darkMode} handleThemeChange={handThemeChange} />
            <Container sx={{ mt: 4 }}>
              <Outlet />
            </Container>
            <Footer />
          </>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;

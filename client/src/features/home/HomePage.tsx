import { Box } from "@mui/material";
import HomePageSlider from "./HomePageSlider";

export default function HomePage() {
  return (
    <>
      <HomePageSlider />
      <Box display="flex" justifyContent="center" sx={{ p: 4 }}>
        Welcome to the Shop!
      </Box>
    </>
  );
}

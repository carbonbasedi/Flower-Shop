import { Box } from "@mui/material";
import AboutUs from "./AboutUs";
import WorkerSlider from "./WorkerSlider";

export default function AboutPage() {
  return (
    <Box>
      <AboutUs />
      <Box sx={{ py: 8 }}>
        <WorkerSlider />
      </Box>
    </Box>
  );
}

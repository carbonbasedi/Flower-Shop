import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import useSliders from "../../app/hooks/useSliders";

const settings = {
  dots: false,
  infinite: true,
  arrows: false,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  speed: 5000,
  autoplaySpeed: 10000,
  cssEase: "linear",
};

export default function HomePageSlider() {
  const { sliders } = useSliders();

  return (
    <Slider {...settings}>
      {sliders.map((slider) => (
        <Paper
          sx={{
            position: "relative",
            backgroundColor: "grey.800",
            color: "#fff",
            mb: 4,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `url(${slider.pictureUrl})`,
          }}
        >
          {
            <img
              style={{ display: "none" }}
              src={slider.pictureUrl}
              alt={slider.title}
            />
          }
          <Box
            sx={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,.3)",
            }}
          />
          <Grid container>
            <Grid item md={6}>
              <Box
                sx={{
                  position: "relative",
                  p: { xs: 3, md: 12 },
                }}
              >
                <Typography
                  component="h1"
                  variant="h3"
                  color="inherit"
                  gutterBottom
                >
                  {slider.title}
                </Typography>
                <Typography variant="h5" color="inherit" paragraph>
                  {slider.subtitle}
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  component={Link}
                  to="#"
                >
                  {slider.buttonLink}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </Slider>
  );
}

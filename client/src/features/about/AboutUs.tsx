import { Paper, Box, Grid, Typography } from "@mui/material";
import useAboutUs from "../../app/hooks/useAboutUs";

export default function AboutUs() {
  const { aboutUs } = useAboutUs();

  return (
    <>
      {aboutUs?.map((about) => (
        <Paper
          key={about.id}
          sx={{
            position: "relative",
            backgroundColor: "grey.800",
            color: "#fff",
            mb: 4,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundImage: `url(${about.pictureUrl})`,
          }}
        >
          {
            <img
              style={{ display: "none" }}
              src={about.pictureUrl}
              alt={about.title}
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
                  p: { xs: 3, md: 6 },
                  pr: { md: 0 },
                }}
              >
                <Typography
                  component="h1"
                  variant="h3"
                  color="inherit"
                  gutterBottom
                >
                  {about.title}
                </Typography>
                <Typography variant="h5" color="inherit" paragraph>
                  {about.subtitle}
                </Typography>
                <Typography variant="subtitle1">{about.description}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </>
  );
}

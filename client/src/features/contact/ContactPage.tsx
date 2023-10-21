import { Box, Grid, Typography } from "@mui/material";
import Iframe from "react-iframe";
import useContactInfo from "../../app/hooks/useContactInfo";

export default function ContactPage() {
  const { contactInfo } = useContactInfo();
  return (
    <>
      {contactInfo?.map((info, index) => {
        return (
          <Box
            key={index}
            display={"flex"}
            flexDirection={"row"}
            sx={{ mt: 5, mb: 5 }}
          >
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  Our Address
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {info.address}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  Our Numbers
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {info.phoneNumber1}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {info.phoneNumber2}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {info.phoneNumber3}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  Our Web addresses
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {info.webAddress1}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {info.webAddress2}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {info.webAddress3}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={5} >
              <Grid item xs={3}>
                <Iframe
                  url={info.mapLocation}
                  width="640px"
                  height="400px"
                  id=""
                  className=""
                  display="block"
                  position="relative"
                />
              </Grid>
            </Grid>
          </Box>
        );
      })}
    </>
  );
}

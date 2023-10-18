import { Facebook, Instagram, Twitter } from "@mui/icons-material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Worker } from "../../app/models/workers";
import { Box } from "@mui/material";

interface Props {
  worker: Worker;
}

export default function RecipeReviewCard({ worker }: Props) {
  return (
    <Card sx={{ maxWidth: 265 }} key={worker.id}>
      <CardMedia
        component="img"
        height="300"
        image={worker.pictureUrl}
        alt={worker.name}
      />
      <CardContent>
        <Typography align="center" variant="h6" color="text.secondary">
          {worker.name} {worker.surname}
        </Typography>
        <Typography align="center" variant="body2" color="text.secondary">
          {worker.duty}
        </Typography>
      </CardContent>
      <Box component={CardActions} justifyContent="center">
        <IconButton aria-label="add to favorites">
          <Instagram />
        </IconButton>
        <IconButton aria-label="share">
          <Facebook />
        </IconButton>
        <IconButton aria-label="share">
          <Twitter />
        </IconButton>
      </Box>
    </Card>
  );
}

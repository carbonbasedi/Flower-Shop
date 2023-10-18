import { Typography } from "@mui/material";
import Slider from "react-slick";
import useWorkers from "../../app/hooks/useWorkers";
import WorkerCard from "./WorkerCard";

const settings = {
  dots: false,
  infinite: true,
  arrows: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  speed: 1000,
  cssEase: "linear",
};

export default function WorkerSlider() {
  const { workers } = useWorkers();

  if (!workers) {
    return (
      <Typography variant="h5">Here be worker but there is none</Typography>
    );
  } else {
    return (
      <>
        <Typography
          variant="h4"
          align="center"
          sx={{
            mb: 3,
          }}
        >
          Team Members
        </Typography>
        <Slider {...settings}>
          {workers.map((worker) => (
            <WorkerCard worker={worker} />
          ))}
        </Slider>
      </>
    );
  }
}

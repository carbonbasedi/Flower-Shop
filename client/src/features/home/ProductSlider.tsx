import { Box, Divider, Typography } from "@mui/material";
import { useEffect } from "react";
import Slider from "react-slick";
import useProducts from "../../app/hooks/useProducts";
import { useAppDispatch } from "../../app/store/configureStore";
import ProductCard from "../catalog/ProductCard";
import { setProductParams } from "../catalog/catalogSlice";

const settings = {
  dots: false,
  infinite: true,
  arrows: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  speed: 5000,
  autoplaySpeed: 10000,
  cssEase: "linear",
};

export default function ProductSlider() {
  const { prods } = useProducts();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const mode = "featured";
    dispatch(setProductParams({ orderBy: mode }));
  }, [dispatch]);

  return (
    <Box sx={{ py: 2, px: 4 }}>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant="h6" gutterBottom>
          Featured Products
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ my: 3 }}>
        <Slider {...settings}>
          {prods.map((product) => (
            <ProductCard key={product.id} product={product} spacing={5} />
          ))}
        </Slider>
      </Box>
    </Box>
  );
}

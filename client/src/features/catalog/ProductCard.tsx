import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { currencyFormat } from "../../app/util/util";
import { addBasketItemAsync } from "../basket/basketSlice";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  const deco = product.discount > 0 ? "line-through" : "";

  return (
    <>
      <Card>
        <CardMedia
          sx={{
            height: 140,
            backgroundSize: "contain",
            bgcolor: "primary.light",
          }}
          image={product.pictureUrl}
          title={product.name}
        />
        <CardContent>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
          >
            <Typography
              gutterBottom
              color="secondary"
              variant="h6"
              sx={{ textDecoration: deco }}
            >
              {currencyFormat(product.price)}
            </Typography>
            <Typography gutterBottom color="khaki" variant="h5">
              {product.discount > 0
                ? currencyFormat(
                    product.price - (product.price / 100) * product.discount
                  )
                : ""}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: "Green" }}>
            {product.name}
          </Typography>
        </CardContent>
        <CardActions>
          <LoadingButton
            onClick={() =>
              dispatch(addBasketItemAsync({ productId: product.id }))
            }
            loading={status === "pendingAddItem" + product.id}
            size="small"
          >
            Add to Cart
          </LoadingButton>
          <Button component={Link} to={`/catalog/${product.id}`} size="small">
            View
          </Button>
        </CardActions>
      </Card>
    </>
  );
}

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
import { addBasketItemAsync } from "../basket/basketSlice";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { Visibility } from "@mui/icons-material";

interface Props {
  product: Product;
  spacing: number;
}

export default function ProductCard({ product, spacing }: Props) {
  const { status } = useAppSelector((state) => state.basket);
  const dispatch = useAppDispatch();

  const deco = product.discount > 0 ? "line-through" : "";

  return (
    <Box mx={spacing}>
      <Card>
        <CardMedia
          sx={{
            height: 300,
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
              ${product.price.toFixed(2)}
            </Typography>
            {product.discountedPrice > 0 && (
              <>
                <Typography gutterBottom color="" variant="h6">
                  -{product.discount}%
                </Typography>
                <Typography gutterBottom color="red" variant="h5">
                  ${product.discountedPrice.toFixed(2)}
                </Typography>
              </>
            )}
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
            <AddShoppingCartIcon />
          </LoadingButton>
          <Button component={Link} to={`/catalog/${product.id}`} size="small">
            <Visibility />
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

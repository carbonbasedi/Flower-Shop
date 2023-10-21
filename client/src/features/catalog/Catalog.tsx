import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { setPageNumber, setProductParams } from "./catalogSlice";
import { Grid, Paper } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import AppPagination from "../../app/components/AppPagination";
import useProducts from "../../app/hooks/useProducts";

const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High to low" },
  { value: "price", label: "Price - Low to high" },
  { value: "discounted", label: "On Discount" },
];

export default function Catalog() {
  const { prods, categories, filtersLoaded, metaData } = useProducts();
  const dispatch = useAppDispatch();
  const { productParams } = useAppSelector((state) => state.catalog);

  if (!filtersLoaded) return <Loading message="Loading products..." />;

  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <ProductSearch />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <RadioButtonGroup
            selectedValue={productParams.orderBy}
            options={sortOptions}
            onChange={(e) =>
              dispatch(setProductParams({ orderBy: e.target.value }))
            }
          />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={categories}
            checked={productParams.categories}
            onChange={(items: any[]) =>
              dispatch(setProductParams({ categories: items }))
            }
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList prods={prods} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={9} sx={{ mb: 2, mt:2 }}>
        {metaData && (
          <AppPagination
            metaData={metaData}
            onPageChange={(page: number) =>
              dispatch(setPageNumber({ pageNumber: page }))
            }
          />
        )}
      </Grid>
    </Grid>
  );
}

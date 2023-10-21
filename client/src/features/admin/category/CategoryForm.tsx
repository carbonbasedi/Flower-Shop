import { FieldValues, useForm } from "react-hook-form";
import { Category } from "../../../app/models/product";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./categoryValidation";
import { useAppDispatch } from "../../../app/store/configureStore";
import { useEffect } from "react";
import agent from "../../../app/api/agent";
import { setCategory } from "./categorySlice";
import { LoadingButton } from "@mui/lab";
import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import AppTextInput from "../../../app/components/AppTextInput";

interface Props {
  category?: Category;
  cancelEdit: () => void;
}

export default function CategoryForm({ category, cancelEdit }: Props) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (category && !isDirty) reset(category);
  }, [category, reset, isDirty]);

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: Category;
      if (category) {
        response = await agent.Admin.updateCategory(data);
      } else {
        response = await agent.Admin.createCategory(data);
      }
      dispatch(setCategory(response));
      cancelEdit();
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Product Details
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppTextInput
              control={control}
              name="title"
              label="Category title"
            />
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button onClick={cancelEdit} variant="contained" color="inherit">
            Cancel
          </Button>
          <LoadingButton
            disabled={!isDirty}
            loading={isSubmitting}
            variant="contained"
            color="success"
            type="submit"
          >
            Submit
          </LoadingButton>
        </Box>
      </form>
    </Box>
  );
}

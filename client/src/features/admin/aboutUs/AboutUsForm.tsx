import { FieldValues, useForm } from "react-hook-form";
import { AboutUs } from "../../../app/models/aboutUs";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationScheme } from "./aboutUsValidation";
import { useAppDispatch } from "../../../app/store/configureStore";
import { useEffect } from "react";
import agent from "../../../app/api/agent";
import { setAboutUs } from "./aboutUsSlice";
import { LoadingButton } from "@mui/lab";
import { Box, Paper, Typography, Grid, Button } from "@mui/material";
import AppDropzone from "../../../app/components/AppDropzone";
import AppTextInput from "../../../app/components/AppTextInput";

interface Props {
  aboutUs?: AboutUs;
  cancelEdit: () => void;
}

export default function AboutUsForm({ aboutUs, cancelEdit }: Props) {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver<any>(validationScheme),
  });
  const watchFile = watch("file", null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (aboutUs && !watchFile && !isDirty) reset(aboutUs);
    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview);
    };
  }, [aboutUs, reset, watchFile, isDirty]);

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: AboutUs;
      if (aboutUs) {
        response = await agent.Admin.updateAboutUs(data);
      } else {
        response = await agent.Admin.createAboutUs(data);
      }
      dispatch(setAboutUs(response));
      cancelEdit();
    } catch (error) {
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
            <AppTextInput control={control} name="title" label="Title" />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AppTextInput control={control} name="subtitle" label="Subtitle" />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AppTextInput
              control={control}
              name="description"
              label="Description"
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <AppDropzone control={control} name="file" />
              {watchFile ? (
                <img
                  src={watchFile.preview}
                  alt="preview"
                  style={{ maxHeight: 200 }}
                />
              ) : (
                <img
                  src={aboutUs?.pictureUrl}
                  alt={aboutUs?.title}
                  style={{ maxHeight: 200 }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
        <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
          <Button onClick={cancelEdit} variant="contained" color="inherit">
            Cancel
          </Button>
          <LoadingButton
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

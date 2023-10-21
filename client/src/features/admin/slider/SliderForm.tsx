import { Typography, Grid, Paper, Box, Button } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import AppTextInput from "../../../app/components/AppTextInput";
import { useEffect } from "react";
import AppDropzone from "../../../app/components/AppDropzone";
import { yupResolver } from "@hookform/resolvers/yup";
import agent from "../../../app/api/agent";
import { useAppDispatch } from "../../../app/store/configureStore";
import { LoadingButton } from "@mui/lab";
import { validationSchema } from "./sliderValidation";
import { AppSlider } from "../../../app/models/slider";
import { setSlider } from "./sliderSlice";

interface Props {
  slider?: AppSlider;
  cancelEdit: () => void;
}

export default function SliderForm({ slider, cancelEdit }: Props) {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });
  const watchFile = watch("file", null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (slider && !watchFile && !isDirty) reset(slider);
    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview);
    };
  }, [slider, reset, watchFile, isDirty]);

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: AppSlider;
      if (slider) {
        response = await agent.Admin.updateSlider(data);
      } else {
        response = await agent.Admin.createSlider(data);
      }
      dispatch(setSlider(response));
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
            <AppTextInput
              control={control}
              name="subtitle"
              label="Subtitle"
              multiline={true}
              rows={4}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              name="buttonLink"
              label="Link for button"
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
                  src={slider?.pictureUrl}
                  alt={slider?.title}
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

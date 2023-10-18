import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import agent from "../../../app/api/agent";
import AppDropzone from "../../../app/components/AppDropzone";
import AppSelecList from "../../../app/components/AppSelectList";
import AppTextInput from "../../../app/components/AppTextInput";
import useWorkers from "../../../app/hooks/useWorkers";
import { Worker } from "../../../app/models/workers";
import { useAppDispatch } from "../../../app/store/configureStore";
import { setWorker } from "./workerSlice";
import { validationSchema } from "./workerValidator";

interface Props {
  worker?: Worker;
  cancelEdit: () => void;
}

export default function WorkerForm({ worker, cancelEdit }: Props) {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver<any>(validationSchema),
  });
  const { duties } = useWorkers();
  const watchFile = watch("file", null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (worker && !watchFile && !isDirty) reset(worker);
    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview);
    };
  }, [worker, reset, watchFile, isDirty]);

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: Worker;
      if (worker) {
        response = await agent.Admin.updateWorker(data);
      } else {
        response = await agent.Admin.createWorker(data);
      }
      dispatch(setWorker(response));
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
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} name="name" label="Worker Name" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              name="surname"
              label="Worker Surname"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AppSelecList
              control={control}
              name="dutyId"
              label="Duty"
              items={duties}
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
                  src={worker?.pictureUrl}
                  alt={worker?.name}
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

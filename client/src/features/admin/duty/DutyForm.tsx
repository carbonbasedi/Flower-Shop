import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import agent from "../../../app/api/agent";
import AppTextInput from "../../../app/components/AppTextInput";
import { Duty } from "../../../app/models/workers";
import { useAppDispatch } from "../../../app/store/configureStore";
import { setDuty } from "./dutySlice";
import { validationSchema } from "./dutyValidation";

interface Props {
  duty?: Duty;
  cancelEdit: () => void;
}

export default function DutyForm({ duty, cancelEdit }: Props) {
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
    if (duty && !isDirty) reset(duty);
  }, [duty, reset, isDirty]);

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: Duty;
      if (duty) {
        response = await agent.Admin.updateDuty(data);
      } else {
        response = await agent.Admin.createDuty(data);
      }
      dispatch(setDuty(response));
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
            <AppTextInput control={control} name="title" label="Duty title" />
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

import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import agent from "../../../app/api/agent";
import AppTextInput from "../../../app/components/AppTextInput";
import { ContactInfo } from "../../../app/models/contactInfo";
import { useAppDispatch } from "../../../app/store/configureStore";
import { setContactInfo } from "./contactInfoSlice";
import { validationScheme } from "./contactInfoValidation";

interface Props {
  contactInfo?: ContactInfo;
  cancelEdit: () => void;
}

export default function ContactInfoForm({ contactInfo, cancelEdit }: Props) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty, isSubmitting },
  } = useForm({
    resolver: yupResolver<any>(validationScheme),
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (contactInfo && !isDirty) reset(contactInfo);
  }, [contactInfo, reset, isDirty]);

  async function handleSubmitData(data: FieldValues) {
    try {
      let response: ContactInfo;
      if (contactInfo) {
        response = await agent.Admin.updateContactInfo(data);
      } else {
        response = await agent.Admin.createContactInfo(data);
      }
      dispatch(setContactInfo(response));
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
            <AppTextInput control={control} name="address" label="Address" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppTextInput
              control={control}
              name="phoneNumber1"
              label="Phone Number 1"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppTextInput
              control={control}
              name="phoneNumber2"
              label="Phone Number 2"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppTextInput
              control={control}
              name="phoneNumber3"
              label="Phone Number 3"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppTextInput
              control={control}
              name="webAddress1"
              label="Web Address 1"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppTextInput
              control={control}
              name="webAddress2"
              label="Web Address 2"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <AppTextInput
              control={control}
              name="webAddress3"
              label="Web Address 3"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <AppTextInput
              control={control}
              name="mapLocation"
              label="Embeded Map"
            />
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

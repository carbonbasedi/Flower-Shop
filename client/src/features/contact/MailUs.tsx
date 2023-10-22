import { LoadingButton } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import { useEffect } from "react";

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitSuccessful, isSubmitting, errors, isValid },
  } = useForm({
    mode: "all",
  });

  const onSubmit = (data: FieldValues) => {
    agent.Account.sendEmail(data)
      .then(() => {
        toast.success("Message sent");
      })
      .catch((error) => handleApiError(error));
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({ name: "", email: "", message: "" });
    }
  });

  function handleApiError(error: string) {
    setError("email", { message: error });
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        <Typography variant="h4" align="center" mb={2}>
          Contact Us
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Name"
            margin="normal"
            {...register("name", { required: "Name is required" })}
            error={!!errors?.name}
            helperText={errors?.name?.message as string}
          />
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            type="email"
            {...register("email", { required: "Email is required" })}
            error={!!errors?.email}
            helperText={errors?.email?.message as string}
          />
          <TextField
            fullWidth
            label="Message"
            margin="normal"
            multiline
            rows={4}
            {...register("message", { required: "Message is required" })}
            error={!!errors?.message}
            helperText={errors?.message?.message as string}
          />
          <LoadingButton
            disabled={!isValid}
            loading={isSubmitting}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
}

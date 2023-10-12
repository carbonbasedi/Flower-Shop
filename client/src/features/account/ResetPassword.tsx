import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";

export default function ResetPassword() {
  const navigate = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "all",
  });
  const watchFields = watch(["password", "confirmPassword"]);
  const [checked, setChecked] = useState("password");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(checked === "password" ? "" : "password");
  };

  function handleApiError(error: string) {
    setError("password", { message: error });
  }

  return (
    <Container
      component={Paper}
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 4,
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit((data) =>
            agent.Account.resetPassword(data)
              .then(() => {
                toast.success("Registration successfull");
                navigate("/login");
              })
              .catch((error) => handleApiError(error))
          )}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type={checked}
            {...register("password", {
              required: "Password is required",
              pattern: {
                value:
                  /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                message: "password is not strong",
              },
            })}
            error={!!errors.password}
            helperText={errors?.password?.message as string}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Confirm Password"
            type={checked}
            {...register("confirmPassword", {
              required: "Confirmation is required",
              validate: (value) => {
                return value !== watchFields[0]
                  ? "Passwords doesn't match"
                  : true;
              },
              pattern: {
                value:
                  /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                message: "password is not strong",
              },
            })}
            error={!!errors.confirmPassword}
            helperText={errors?.confirmPassword?.message as string}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checked.length === 0}
                color="secondary"
                onChange={handleChange}
              />
            }
            label="Show passwords"
          />
          <LoadingButton
            disabled={!isValid}
            loading={isSubmitting}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Change password
          </LoadingButton>
        </Box>
      </Box>
    </Container>
  );
}

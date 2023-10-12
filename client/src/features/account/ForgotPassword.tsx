import { LoadingButton } from "@mui/lab";
import {
  Container,
  Paper,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import agent from "../../app/api/agent";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "all",
  });

  function handleApiError(error: string) {
    setError("email", { message: error });
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
          Forgot Password
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit((data) =>
            agent.Account.forgotPassword(data)
              .then(() => {
                toast.success("Reset link sent successfull");
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
            label="Email"
            autoFocus
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors?.email?.message as string}
          />
          <LoadingButton
            disabled={!isValid}
            loading={isSubmitting}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send reset link
          </LoadingButton>
          <Grid container>
            <Grid item>
              <Button component={Link} to="/login">
                Go Back
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

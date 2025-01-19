"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import Joi from "joi";
import { useForm } from "react-hook-form";

// Custom Styled Card (similar to Login)
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm();

  const schema = Joi.object({
    name: Joi.string().min(3).required().messages({
      "string.base": `Name must be a text`,
      "string.empty": `Name should not be empty`,
      "string.min": `Name must be a minimum of {#limit} Characters`,
    }),
    email: Joi.string()
      .pattern(new RegExp(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/))
      .required()
      .messages({
        "string.base": `Email must be a text`,
        "string.pattern.base": `Email must be a valid email`,
        "string.empty": `Email should not be empty`,
      }),
    password: Joi.string()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
      .required()
      .messages({
        "string.base": `Password must be a text`,
        "string.pattern.base": `Password must be a minimum of 8 letters and consist of 1 number, 1 Lowercase character and 1 Capital letter`,
        "string.empty": `Password should not be empty`,
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": `Confirmation Password must be the same as Password`,
        "string.empty": `Confirmation Password should not be empty`,
      }),
    phoneNumber: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required()
      .messages({
        "string.base": `Phone Number must be a text`,
        "string.pattern.base": `Phone Number Invalid`,
        "string.empty": `Phone Number should not be empty`,
      }),
  });

  const onSubmit = async (data) => {
    const validation = schema.validate(data, { abortEarly: false });

    if (validation.error) {
      validation.error.details.forEach((err) => {
        setFormError(err.context.key, { message: err.message });
      });
      return;
    }

    setError(""); // Clear previous errors

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/login");
      } else {
        const errorData = await res.json();
        setError(
          errorData.error || "Gagal melakukan registrasi. Silahkan coba lagi."
        );
      }
    } catch (error) {
      setError("Gagal melakukan registrasi. Silahkan coba lagi.");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ display: "flex", justifyContent: "center", minHeight: "100vh" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        width="100%"
      >
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              textAlign: "center",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              fontWeight: 700,
            }}
          >
            Register
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <TextField
              label="Name"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              label="Confirmation Password"
              type="password"
              fullWidth
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <TextField
              label="Phone Number"
              fullWidth
              {...register("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />

            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{ textAlign: "center" }}
              >
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#493628",
                color: "#fff",
                "&:hover": { backgroundColor: "#5a4632" },
              }}
            >
              Register
            </Button>
          </Box>
          <Typography sx={{ textAlign: "center" }}>
            {"Already have an account? "}
            <Link href="/login" sx={{ color: "inherit" }} underline="hover">
              Login here
            </Link>
          </Typography>
        </Card>
      </Box>
    </Container>
  );
}

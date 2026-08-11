import "./Signup.css";

import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";


import AuthLayout from "../../../layouts/AuthLayout";

import Input from "../../../components/Common/Form/Input";
import PasswordInput from "../../../components/Common/Form/PasswordInput";
import Button from "../../../components/Common/Form/Button";
import PasswordStrength from "../../../components/Common/Form/PasswordStrength";

import { signup as signupService } from "../../../services/api/authService";

import { signupSchema } from "../../../validations/auth/signupSchema";




function Signup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {

    register,
    handleSubmit,
    watch,
    formState: { errors }

  } = useForm({

    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
      role: "student",
    }

  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const username = watch("username") || "";
  const email = watch("email") || "";
  const password = watch("password") || "";
  const confirmPassword = watch("confirmPassword") || "";


  const navigate = useNavigate();

  const onSubmit = async (data) => {

    setError("");
    setLoading(true);

    try {

      await signupService(data);

      toast.success("OTP sent to your Gmail account.");

      setTimeout(() => {

        navigate("/verify-signup-otp", {
          state: {
            email: data.email
          }
        });

      }, 1200);

    } catch (err) {

      toast.error(err.response?.data?.message);

      setError(
        err.response?.data?.message ||
        "Sign up failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <>

      {
        loading && (

          <div className="loading-overlay">

            <HashLoader
              color="#2563eb"
              size={70}
              speedMultiplier={1.2}
            />

            <h3>Creating your account...</h3>

            <p>
              Sending OTP to your Gmail...
            </p>

          </div>

        )
      }
      <AuthLayout
        title="Create Account"
        subtitle="Join Tech Monster Pvt. Ltd."
      >
        <motion.form
          id="signup-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Username"
            placeholder="@Username"
            value={username}
            {...register("username")}
            error={errors.username?.message}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            {...register("email")}
            error={errors.email?.message}
          />


          <PasswordInput
            label="Password"
            showStrength
            value={password}
            {...register("password")}
            error={errors.password?.message}
          />

          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />


          <PasswordStrength password={watch("password")} />

          {error && <p className="signup-error">{error}</p>}

          <label id="terms">
            <input
              type="checkbox"
              {...register("terms")}
            />
            I accept Terms & Conditions
            <Link to="/terms-and-conditions"> Terms & Conditions</Link>
          </label>
          <p id="terms-error">{errors.terms?.message}</p>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

          <p id="login-link">
            Already have an account?
            <Link to="/login">
              Login
            </Link>
          </p>


        </motion.form>

      </AuthLayout>
    </>
  )

}

export default Signup;
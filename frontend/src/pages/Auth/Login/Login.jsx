import "./Login.css";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import LoaderPage from "../../../components/Dashboard/common/LoaderPage";

import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";

import Input from "../../../components/Common/Form/Input";
import PasswordInput from "../../../components/Common/Form/PasswordInput";
import Button from "../../../components/Common/Form/Button";

import { FaEnvelope } from "react-icons/fa";

import { login as loginService } from "../../../services/api/authService";
import useAuth from "../../../hooks/useAuth";


function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("logoutSuccess")) {
      toast.success("Logout Successfully");
      sessionStorage.removeItem("logoutSuccess");
    }
  }, []);

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.email || !formData.password) {
      return setError(
        "Please fill all fields."
      );
    }
    try {
      setLoading(true);
      const response = await loginService(formData);
      const {
        accessToken,
        user
      } = response.data;

      // Store Auth Data
      login({
        token: accessToken,
        user
      });
      // Role Based Dashboard Navigation

      if (user.role === "student") {
        navigate("/student");
      } else if (user.role === "admin") {
        navigate("/admin");
      }
      else {
        navigate("/login");
      }
    }
    catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed."
      );
    }
    finally {
      setLoading(false);
    }
  };

  {
    loading && (
      <LoaderPage
        fullScreen
        message="Logging you in..."
        size={70}
      />
    )
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to continue your internship journey."
    >

      <motion.form
        className="login-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          icon={<FaEnvelope />}
          required
        />

        <PasswordInput
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          required
        />

        {
          error &&
          <p className="login-error">
            {error}
          </p>
        }

        <div className="login-options">
          <label className="remember-me">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() =>
                setRememberMe(!rememberMe)
              }
            />
            Remember Me
          </label>
          <Link
            to="/forgot-password"
            className="forgot-link"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={loading}
        >
          {loading ? "Logging In..." : "Login"}
        </Button>

        <p className="signup-text">
          Don't have an account?
          <Link to="/signup">Create Account </Link>
        </p>

        <p className="signup-text">
          Log in as a admin
          <Link to="/admin_login">Admin login</Link>
        </p>
      </motion.form>

    </AuthLayout>
  );
}


export default Login;
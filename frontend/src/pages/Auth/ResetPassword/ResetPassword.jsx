import "./ResetPassword.css";

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import AuthLayout from "../../../layouts/AuthLayout";

import PasswordInput from "../../../components/Common/Form/PasswordInput";
import Button from "../../../components/Common/Form/Button";
import PasswordStrength from "../../../components/Common/Form/PasswordStrength";

import { resetPasswordSchema } from "../../../validations/auth/resetPasswordSchema";
import { resetPassword } from "../../../services/api/authService";
import LoaderPage from "../../../components/Dashboard/common/LoaderPage";

function ResetPassword() {

    const navigate = useNavigate();

    const location = useLocation();

    const email = location.state?.email;

    const [serverError, setServerError] = useState("");

    const [loading, setLoading] = useState(false);

    const {

        register,

        handleSubmit,

        watch,

        formState: {

            errors

        }

    } = useForm({

        resolver: zodResolver(resetPasswordSchema)

    });

    const onSubmit = async (data) => {

        try {

            setLoading(true);

            setServerError("");

            await resetPassword({

                email,

                newPassword: data.password,

                confirmPassword: data.confirmPassword

            });

            navigate("/login", {

                replace: true,

                state: {

                    success:

                        "Password changed successfully."

                }

            });

        }

        catch (error) {

            setServerError(

                error.response?.data?.message ||

                "Unable to reset password."

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
                message="Updating your password..."
                size={70}
            />
        )
    }

    return (

        <AuthLayout

            title="Reset Password"

            subtitle="Create a strong password."

        >

            <motion.form

                className="reset-form"

                onSubmit={handleSubmit(onSubmit)}

                initial={{

                    opacity: 0,

                    y: 20

                }}

                animate={{

                    opacity: 1,

                    y: 0

                }}

            >

                <PasswordInput

                    label="New Password"

                    placeholder="Enter new password"

                    showStrength

                    {...register("password")}

                    error={errors.password?.message}

                />

                <PasswordInput

                    label="Confirm Password"

                    placeholder="Confirm password"

                    {...register("confirmPassword")}

                    error={errors.confirmPassword?.message}

                />

                <PasswordStrength password={watch("password")} />

                {

                    serverError &&

                    <p className="reset-error">

                        {serverError}

                    </p>

                }

                <Button

                    fullWidth

                    type="submit"

                    disabled={loading}

                >

                    {

                        loading

                            ?

                            "Updating..."

                            :

                            "Update Password"

                    }

                </Button>

            </motion.form>

        </AuthLayout>

    );

}

export default ResetPassword;
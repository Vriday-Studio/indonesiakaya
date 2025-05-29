import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authWithProvider, confirmResetPassword, getUserByEmail, resetPassword, signIn, signUp, verifyResetPasswordCode } from "../../lib/firebase/auth";
import { FIREBASE_ERRORS_CODE, MESSAGE } from "../../lib/constant";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import Loading from "../../components/Loading";
import BackIcon from "../../components/BackIcon";
import bgAuth from "/images/bg-auth.png";
import { EyeIcon } from "../../components/EyeIcon";
import PrivacyPolicy from "../PrivacyPolicy";

const emailSchema = z.string().email({ message: MESSAGE.emailValidation });
const passwordSchema = z.string().min(6, { message: MESSAGE.passwordValidation });
const confirmPasswordSchema = z.string().min(6, { message: MESSAGE.confirmPasswordValidation });

const basicSchema = {
    email: emailSchema,
    password: passwordSchema,
};
const signInSchema = z.object(basicSchema);
const signUpSchema = z
    .object({
        name: z.string().min(3, { message: MESSAGE.nameValidation }),
        ...basicSchema,
        confirmPassword: confirmPasswordSchema,
        terms: z.boolean().refine((value) => value, { message: MESSAGE.terms }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: MESSAGE.passwordNotMatch,
        path: ["confirmPassword"],
    });
const resetPasswordSchema = z.object({ email: emailSchema });
const newPasswordSchema = z.object({ password: passwordSchema, confirmPassword: confirmPasswordSchema });

const EMAIL_INPUT = {
    label: "Alamat Email",
    type: "email",
    name: "email",
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#888888" className="h-4 w-4">
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
        </svg>
    ),
};

const PASSWORD_INPUT = {
    label: "Kata Sandi",
    type: "password",
    name: "password",
    icon: (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M18.2127 1.39648L16.4923 3.17221M16.4923 3.17221L19.073 5.83579L16.0621 8.94331L13.4814 6.27972M16.4923 3.17221L13.4814 6.27972M9.94583 9.92883C10.39 10.3812 10.7431 10.9197 10.9848 11.5135C11.2265 12.1072 11.352 12.7445 11.3541 13.3885C11.3562 14.0325 11.2348 14.6706 10.997 15.266C10.7591 15.8615 10.4096 16.4024 9.96832 16.8578C9.52709 17.3132 9.00294 17.674 8.42605 17.9195C7.84916 18.165 7.23092 18.2902 6.60693 18.2881C5.98294 18.2859 5.36553 18.1564 4.79024 17.9069C4.21495 17.6575 3.69316 17.2931 3.25489 16.8346C2.39305 15.9136 1.91616 14.6801 1.92694 13.3997C1.93772 12.1194 2.4353 10.8946 3.31253 9.9892C4.18975 9.08381 5.37642 8.57025 6.61696 8.55912C7.8575 8.548 9.05264 9.0402 9.94497 9.92972L9.94583 9.92883ZM9.94583 9.92883L13.4814 6.27972"
                stroke="#888888"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
};

const CONFIRM_PASSWORD_INPUT = {
    label: "Konfirmasi Kata Sandi",
    type: "password",
    name: "confirmPassword",
    icon: (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M18.2127 1.39648L16.4923 3.17221M16.4923 3.17221L19.073 5.83579L16.0621 8.94331L13.4814 6.27972M16.4923 3.17221L13.4814 6.27972M9.94583 9.92883C10.39 10.3812 10.7431 10.9197 10.9848 11.5135C11.2265 12.1072 11.352 12.7445 11.3541 13.3885C11.3562 14.0325 11.2348 14.6706 10.997 15.266C10.7591 15.8615 10.4096 16.4024 9.96832 16.8578C9.52709 17.3132 9.00294 17.674 8.42605 17.9195C7.84916 18.165 7.23092 18.2902 6.60693 18.2881C5.98294 18.2859 5.36553 18.1564 4.79024 17.9069C4.21495 17.6575 3.69316 17.2931 3.25489 16.8346C2.39305 15.9136 1.91616 14.6801 1.92694 13.3997C1.93772 12.1194 2.4353 10.8946 3.31253 9.9892C4.18975 9.08381 5.37642 8.57025 6.61696 8.55912C7.8575 8.548 9.05264 9.0402 9.94497 9.92972L9.94583 9.92883ZM9.94583 9.92883L13.4814 6.27972"
                stroke="#888888"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
};

const LIST_INPUTS_LOGIN = [EMAIL_INPUT, PASSWORD_INPUT];

const LIST_INPUTS_REGISTER = [
    {
        label: "Nama",
        type: "text",
        name: "name",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#888888" className="h-4 w-4">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
        ),
    },
    ...LIST_INPUTS_LOGIN,
    CONFIRM_PASSWORD_INPUT,
];

const CONFIG = {
    login: {
        title: "Masuk",
        pageTitle: "Masuk",
        onSubmit: signIn,
        input: LIST_INPUTS_LOGIN,
        schema: signInSchema,
        cta: "Belum punya akun? Daftar",
        ctaLink: "/register",
        ctaReset: "Lupa password?",
        resetLink: "/reset-password",
    },
    register: {
        title: "Daftar",
        pageTitle: "Daftar",
        onSubmit: signUp,
        input: LIST_INPUTS_REGISTER,
        schema: signUpSchema,
        cta: "Sudah punya akun? Masuk",
        ctaLink: "/login",
    },
    reset: {
        title: "Kirim",
        pageTitle: "Lupa Password",
        onSubmit: resetPassword,
        input: [EMAIL_INPUT],
        schema: resetPasswordSchema,
        cta: "Kembali ke halaman login",
        ctaLink: "/login",
        successMessage: "Email reset password telah dikirim, silahkan cek email Anda.",
    },
    new: {
        title: "Buat Password Baru",
        pageTitle: "Buat Password Baru",
        onSubmit: confirmResetPassword,
        input: [PASSWORD_INPUT, CONFIRM_PASSWORD_INPUT],
        schema: newPasswordSchema,
        cta: "Kembali ke halaman login",
        ctaLink: "/login",
        successMessage: "Reset Password berhasil, silahkan login dengan password baru Anda.",
    },
};

const AuthForm = ({ type }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isButtonDisable, setIsButtonDisable] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const oobCode = searchParams.get("oobCode");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(CONFIG[type].schema),
    });

    const { loginUser } = useAuth();

    useEffect(() => {
        if (type === "new" && oobCode) {
            verifyResetPasswordCode(oobCode)
                .then((email) => {
                    setIsButtonDisable(false);
                })
                .catch((error) => {
                    setIsButtonDisable(true);
                    setErrorMessage(FIREBASE_ERRORS_CODE[error.code] || FIREBASE_ERRORS_CODE.default);
                });
        }
    }, [oobCode]);

    useEffect(() => {
        setErrorMessage("");
        setSuccessMessage("");
        setIsButtonDisable(false);
        reset();
    }, [location]);

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const onSubmit = async (data) => {
        try {
            await CONFIG[type].onSubmit(type === "new" ? { password: data.password, oobCode } : data);
            if (["login", "register"].includes(type)) {
                const userData = await getUserByEmail(data.email);
                if (userData) {
                    if (!userData.terms) {
                        return loginUser({
                            user: userData,
                            redirect: "/privacy-policy",
                        });
                    }

                    if (["admin", "gro"].includes(userData.Role)) {
                        return loginUser({
                            user: userData,
                            redirect: "/dashboard",
                        });
                    } else {
                        return loginUser({
                            user: userData,
                            redirect: "/",
                        });
                    }
                } else {
                    return loginUser({
                        user: {
                            Nama: data.name,
                            Email: data.email,
                        },
                        redirect: "/",
                    });
                }
            }

            if (["reset", "new"].includes(type)) {
                setSuccessMessage(CONFIG[type].successMessage);
            }
        } catch (error) {
            console.log("Submit Error:", error);
            const message = type === "reset" ? error.message : FIREBASE_ERRORS_CODE[error.code] || FIREBASE_ERRORS_CODE.default;
            setErrorMessage(message);
            setSuccessMessage("");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await authWithProvider("google", loginUser);
        } catch (error) {
            console.log("Error Google:", error);
            setErrorMessage(FIREBASE_ERRORS_CODE[error.code] || FIREBASE_ERRORS_CODE.default);
        }
    };

    const handleFacebookLogin = async () => {
        try {
            await authWithProvider("facebook", loginUser);
        } catch (error) {
            console.log("Error Facebook:", error);
            setErrorMessage(FIREBASE_ERRORS_CODE[error.code] || FIREBASE_ERRORS_CODE.default);
        }
    };

    return (
        <>
            <form className="h-screen flex flex-col items-center pb-5 gap-10 relative z-20 bg-primary-dark" onSubmit={handleSubmit(onSubmit)}>
                <BackIcon className="absolute left-2 top-2 z-10" iconColor="white" />
                <div className="relative flex flex-col justify-center items-center gap-1 px-5 w-full bg-primary-orange/80 h-1/5">
                    <h1 className="text-xl font-bold text-white">{CONFIG[type].pageTitle}</h1>
                    <img src={bgAuth} alt="bg-auth" className="absolute w-4/5 h-full py-2" />
                </div>

                <div className="flex flex-col gap-2 md:gap-5 w-4/5 md:w-1/2">
                    {CONFIG[type].input.map((input) => (
                        <div key={input.name} className="flex flex-col gap-y-1">
                            <label className="text-white">{input.label}</label>
                            <div htmlFor={input.name} className="input input-bordered rounded-2xl bg-cream flex items-center gap-2">
                                {input.icon}
                                <input
                                    id={input.name}
                                    type={input.type === "password" && showPassword ? "text" : input.type}
                                    {...register(input.name)}
                                    disabled={isSubmitting}
                                    className="grow text-black"
                                    placeholder={input.label}
                                />
                                {input.type === "password" && <EyeIcon onClick={toggleShowPassword} show={showPassword} />}
                            </div>
                            {errors[input.name] && <p className="text-xs text-red-600 mt-2 text-end">{errors[input.name].message}</p>}
                        </div>
                    ))}
                    {type === "login" && (
                        <Link className="self-end text-white" to={CONFIG[type].resetLink}>
                            {CONFIG[type].ctaReset}
                        </Link>
                    )}

                    {type === "register" && (
                        <>
                            <div className="flex items-center gap-2 mt-2 text-sm">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    {...register("terms")}
                                    disabled={isSubmitting}
                                    className="w-5 h-5 checkbox checkbox-warning"
                                />
                                <label htmlFor="terms" className="text-white text-xs">
                                    Saya menyetujui aplikasi ini untuk mengumpulkan data sesuai dengan{" "}
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById("privacy").showModal()}
                                        className="text-primary-orange hover:text-primary-brass"
                                    >
                                        kebijakan privasi.
                                    </button>
                                </label>
                            </div>
                            {errors.terms && <p className="text-xs text-red-600 mt-2 text-start">{errors.terms.message}</p>}
                        </>
                    )}

                    {successMessage && <p className="text-green-600 text-sm text-center">{successMessage}</p>}
                    <button
                        className="w-3/4 mt-5 self-center text-cream bg-gray-black border border-cream rounded-2xl transition-colors duration-200 px-10 py-2"
                        type="submit"
                        disabled={isSubmitting || successMessage}
                    >
                        {isSubmitting ? <Loading /> : `${CONFIG[type].title}`}
                    </button>
                    {errorMessage && <p className="text-red-600 text-sm text-center">{errorMessage}</p>}

                    {type === "login" && (
                        <>
                            <div className="text-center text-white flex gap-3 my-2 items-center">
                                <hr className="w-full border-gray-300" />
                                <span>atau</span>
                                <hr className="w-full border-gray-300" />
                            </div>
                            <div className="flex justify-center gap-5">
                                <button
                                    className="bg-gray-black/80 rounded-lg border border-gray p-3 hover:scale-105 duration-200 transition-transform"
                                    type="button"
                                    onClick={handleGoogleLogin}
                                >
                                    <svg fill="white" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50">
                                        <path d="M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969 C 39.238281 45.53125 33.457031 48 25.996094 48 Z"></path>
                                    </svg>
                                </button>
                                <button
                                    className="bg-gray-black/80 rounded-lg border border-gray p-3 hover:scale-105 duration-200 transition-transform"
                                    type="button"
                                    onClick={handleFacebookLogin}
                                >
                                    <svg fill="white" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 50 50">
                                        <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M37,19h-2c-2.14,0-3,0.5-3,2 v3h5l-1,5h-4v15h-5V29h-4v-5h4v-3c0-4,2-7,6-7c2.9,0,4,1,4,1V19z"></path>
                                    </svg>
                                </button>
                            </div>
                        </>
                    )}

                    <Link className="self-center text-sm text-white mt-5" to={CONFIG[type].ctaLink}>
                        {CONFIG[type].cta}
                    </Link>
                </div>
            </form>

            <dialog id="privacy" className="modal overflow-scroll">
                <form method="dialog">
                    <button
                        className="btn btn-sm btn-circle btn-ghost text-white absolute right-2 top-2"
                        onClick={() => document.getElementById("privacy").close()}
                    >
                        ✕
                    </button>
                </form>
                <PrivacyPolicy isModal />
            </dialog>
        </>
    );
};

export default AuthForm;

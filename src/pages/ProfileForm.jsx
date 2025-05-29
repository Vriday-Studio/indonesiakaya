import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loading from "../components/Loading";
import BackIcon from "../components/BackIcon";
import bgAuth from "/images/bg-auth.png";
import { FIREBASE_ERRORS_CODE } from "../lib/constant";
import { useAuth } from "../context/AuthProvider";
import { updateProfileUser } from "../lib/firebase/users";

const schema = z.object({
    name: z.string().min(3, { message: "Nama harus lebih dari 3 karakter" }),
    gender: z.string().min(1, { message: "Jenis kelamin tidak valid" }),
    year: z.string().min(4, { message: "Tahun lahir tidak valid" }).max(4, { message: "Tahun lahir tidak valid" }),
    month: z.string().min(1, { message: "Bulan lahir tidak valid" }).max(2, { message: "Bulan lahir tidak valid" }),
    day: z.string().min(1, { message: "Tanggal lahir tidak valid" }).max(2, { message: "Tanggal lahir tidak valid" }),
    phone: z.string().regex(/^(0|\+62)\d{9,12}$/, { message: "Nomor telepon tidak valid" }),
    email: z.string().email({ message: "Email tidak valid" }),
});

const LIST_INPUTS = [
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
    {
        label: "Alamat Email",
        type: "email",
        name: "email",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#888888" className="h-4 w-4">
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
        ),
        isDisabled: true,
    },
    {
        label: "Lengkapi profil untuk  mendapatkan tambahan +80 poin",
        name: "info",
        className: "text-sm text-center text-white my-2 px-5",
    },
    {
        label: "Jenis Kelamin",
        type: "select",
        name: "gender",
    },
    {
        label: "Birthdate",
        type: "text",
        name: "year",
    },
    {
        label: "Nomor Telepon",
        type: "tel",
        name: "phone",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#888888" className="h-4 w-4">
                <path
                    d="M3 5.5C3 14.0604 9.93959 21 18.5 21C18.8862 21 19.2691 20.9859 19.6483 20.9581C20.0834 20.9262 20.3009 20.9103 20.499 20.7963C20.663 20.7019 20.8185 20.5345 20.9007 20.364C21 20.1582 21 19.9181 21 19.438V16.6207C21 16.2169 21 16.015 20.9335 15.842C20.8749 15.6891 20.7795 15.553 20.6559 15.4456C20.516 15.324 20.3262 15.255 19.9468 15.117L16.74 13.9509C16.2985 13.7904 16.0777 13.7101 15.8683 13.7237C15.6836 13.7357 15.5059 13.7988 15.3549 13.9058C15.1837 14.0271 15.0629 14.2285 14.8212 14.6314L14 16C11.3501 14.7999 9.2019 12.6489 8 10L9.36863 9.17882C9.77145 8.93713 9.97286 8.81628 10.0942 8.64506C10.2012 8.49408 10.2643 8.31637 10.2763 8.1317C10.2899 7.92227 10.2096 7.70153 10.0491 7.26005L8.88299 4.05321C8.745 3.67376 8.67601 3.48403 8.55442 3.3441C8.44701 3.22049 8.31089 3.12515 8.15802 3.06645C7.98496 3 7.78308 3 7.37932 3H4.56201C4.08188 3 3.84181 3 3.63598 3.09925C3.4655 3.18146 3.29814 3.33701 3.2037 3.50103C3.08968 3.69907 3.07375 3.91662 3.04189 4.35173C3.01413 4.73086 3 5.11378 3 5.5Z"
                    stroke="#888888"
                    strokeWidth="1"
                />
            </svg>
        ),
    },
];

const ProfileForm = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm({
        resolver: zodResolver(schema),
    });

    const { user, loginUser } = useAuth();

    useEffect(() => {
        if (user) {
            setValue("name", user.Nama);
            setValue("email", user.Email);
            if (user.Tanggal_Lahir && user.Hp && user.Gender) {
                const [year, month, day] = user.Tanggal_Lahir.split("-");

                setIsEditing(true);
                setValue("year", year);
                setValue("month", month);
                setValue("day", day);
                setValue("phone", user.Hp);
                setValue("gender", user.Gender);
            }
        }
    }, []);

    const onSubmit = async (data) => {
        try {
            const pointUser = user.points || 0;
            await updateProfileUser(user.id, { ...data, birthdate: `${data.year}-${data.month}-${data.day}`, points: isEditing ? pointUser : pointUser + 80 });
            loginUser({
                user: {
                    ...user,
                    Nama: data.name,
                    Gender: data.gender,
                    Tanggal_Lahir: `${data.year}-${data.month}-${data.day}`,
                    Hp: data.phone,
                    points: 80,
                },
            });
        } catch (error) {
            console.log("Submit Error:", error);
            const message = FIREBASE_ERRORS_CODE[error.code] || FIREBASE_ERRORS_CODE.default;
            setErrorMessage(message);
            setSuccessMessage("");
        }
    };

    return (
        <form className="h-screen flex flex-col items-center gap-10 relative z-20 bg-primary-dark pb-5" onSubmit={handleSubmit(onSubmit)}>
            <BackIcon className="absolute left-2 top-2 z-10" iconColor="white" />
            <div className="relative flex flex-col justify-center items-center gap-1 px-5 w-full bg-primary-orange/80 h-1/5">
                <h1 className="text-xl font-bold text-white">Profil</h1>
                <img src={bgAuth} alt="bg-auth" className="absolute w-4/5 h-full py-2" />
            </div>

            <div className="flex flex-col gap-2 md:gap-5 w-4/5 md:w-1/2">
                {LIST_INPUTS.map((input) => (
                    <div key={input.name} className="flex flex-col gap-y-1">
                        {input.name === "info" && !isEditing && <label className={`${input.className} text-white`}>{input.label}</label>}
                        {input.name !== "info" && input.label !== "Birthdate" && <label className={`${input.className} text-white`}>{input.label}</label>}
                        {input.type && input.type !== "select" && input.label !== "Birthdate" && (
                            <div htmlFor={input.name} className="input input-bordered rounded-2xl bg-cream flex items-center gap-2">
                                {input.icon}
                                <input
                                    id={input.name}
                                    type={input.type}
                                    {...register(input.name)}
                                    disabled={isSubmitting || input.isDisabled}
                                    className="grow text-black"
                                    placeholder={input.label}
                                />
                            </div>
                        )}
                        {input.label === "Birthdate" && (
                            <>
                                <label className={`${input.className} text-white`}>Tanggal Lahir</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <select {...register("day")} disabled={isSubmitting} className="input input-bordered rounded-2xl bg-cream text-black">
                                        <option value="">Tanggal</option>
                                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                    <select {...register("month")} disabled={isSubmitting} className="input input-bordered rounded-2xl bg-cream text-black">
                                        <option value="">Bulan</option>
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                            <option key={month} value={month}>
                                                {month}
                                            </option>
                                        ))}
                                    </select>
                                    <select {...register("year")} disabled={isSubmitting} className="input input-bordered rounded-2xl bg-cream text-black">
                                        <option value="">Tahun</option>
                                        {Array.from({ length: 80 }, (_, i) => i + 1940).map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                        {input.type && input.type === "select" && (
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    className={`w-1/2 px-4 py-2 rounded-lg ${
                                        watch(input.name) === "male" ? "bg-primary-orange text-black" : "bg-cream text-black"
                                    }`}
                                    onClick={() => setValue(input.name, "male")}
                                >
                                    Pria
                                </button>
                                <button
                                    type="button"
                                    className={`w-1/2 px-4 py-2 rounded-lg ${
                                        watch(input.name) === "female" ? "bg-primary-orange text-black" : "bg-cream text-black"
                                    }`}
                                    onClick={() => setValue(input.name, "female")}
                                >
                                    Wanita
                                </button>
                            </div>
                        )}
                        {errors[input.name] && <p className="text-xs text-red-600 mt-2 text-end">{errors[input.name].message}</p>}
                    </div>
                ))}
                {successMessage && <p className="text-green-600 text-sm text-center">{successMessage}</p>}
                <button
                    className="w-3/4 mt-5 self-center text-cream bg-gray-black border border-cream rounded-2xl transition-colors duration-200 px-10 py-2"
                    type="submit"
                    disabled={isSubmitting || successMessage}
                >
                    {isSubmitting ? <Loading /> : `Simpan`}
                </button>
                {errorMessage && <p className="text-red-600 text-sm text-center">{errorMessage}</p>}
            </div>
        </form>
    );
};

export default ProfileForm;

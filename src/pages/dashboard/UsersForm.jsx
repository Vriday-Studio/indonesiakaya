import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "../../lib/firebase/auth";
import { FIREBASE_ERRORS_CODE, MESSAGE } from "../../lib/constant";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { getSelectedUser, updateSelectedUser } from "../../lib/firebase/users";
import BackIcon from "../../components/BackIcon";

const signUpSchema = z.object({
    name: z.string().min(3, { message: MESSAGE.nameValidation }),
    email: z.string().email({ message: MESSAGE.emailValidation }),
    password: z.string().optional(),
    role: z.string().optional(),
    gender: z.string().min(1, { message: "Jenis kelamin tidak valid" }),
    year: z.string().min(4, { message: "Tahun lahir tidak valid" }).max(4, { message: "Tahun lahir tidak valid" }),
    month: z.string().min(1, { message: "Bulan lahir tidak valid" }).max(2, { message: "Bulan lahir tidak valid" }),
    day: z.string().min(1, { message: "Tanggal lahir tidak valid" }).max(2, { message: "Tanggal lahir tidak valid" }),
    phone: z.string().regex(/^(0|\+62)\d{9,12}$/, { message: "Nomor telepon tidak valid" }),
});
const EMAIL_INPUT = {
    label: "Email",
    type: "email",
    name: "email",
};

const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
    { value: "gro", label: "GRO" },
];

const genderOptions = [
    { value: "male", label: "Laki-laki" },
    { value: "female", label: "Perempuan" },
];

const LIST_INPUTS_REGISTER = [
    {
        label: "Name",
        type: "text",
        name: "name",
    },
    {
        label: "Role",
        type: "select",
        name: "role",
        options: roleOptions,
    },
    EMAIL_INPUT,
    {
        label: "Password",
        type: "password",
        name: "password",
    },
    {
        label: "Jenis Kelamin",
        type: "select",
        name: "gender",
        options: genderOptions,
    },
    {
        label: "Nomor Telepon",
        type: "tel",
        name: "phone",
    },
    {
        label: "Tanggal Lahir",
        type: "text",
        name: "birthdate",
    },
];

const UsersForm = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const params = useParams();
    const userId = params.id === "create" ? "create" : params.id;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset,
    } = useForm({
        resolver: zodResolver(signUpSchema),
    });

    const getUserById = async (id) => {
        try {
            const mappingKey = {
                Nama: "name",
                Email: "email",
                Role: "role",
                Hp: "phone",
                Gender: "gender",
            };
            const content = await getSelectedUser(id);

            Object.keys(mappingKey).forEach((key) => {
                setValue(mappingKey[key], content[key]);
            });

            if (content.Tanggal_Lahir) {
                const [year, month, day] = content.Tanggal_Lahir.split("-");
                setValue("day", day);
                setValue("month", month);
                setValue("year", year);
            }
        } catch (error) {
            console.log("Error getting content setting by id: ", error);
        }
    };

    useEffect(() => {
        if (userId !== "create") {
            getUserById(params.id);
        }
    }, []);

    const onSubmit = async (data) => {
        try {
            const updatedData = { ...data, birthdate: `${data.year}-${data.month}-${data.day}` };
            userId !== "create" ? await updateSelectedUser(userId, updatedData) : await signUp(updatedData);
            reset();
            navigate(-1);
        } catch (error) {
            console.log("Submit Error:", error);
            setErrorMessage(FIREBASE_ERRORS_CODE[error.code] || FIREBASE_ERRORS_CODE.default);
        }
    };

    return (
        <form className="p-5 flex flex-col gap-3 relative z-20" onSubmit={handleSubmit(onSubmit)}>
            <BackIcon iconColor="black" />
            <div className="grid md:grid-cols-2 gap-5">
                {LIST_INPUTS_REGISTER.map((input) => (
                    <div key={input.name} className="flex flex-col gap-2">
                        <label>{input.label}</label>
                        {input.type === "select" && (
                            <select id={input.name} {...register(input.name)} className="select select-bordered w-full">
                                <option value="">Pilih Role User</option>
                                {input.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        )}
                        {input.type !== "select" && input.name !== "birthdate" && (
                            <div htmlFor={input.name} className="input input-bordered flex items-center gap-2">
                                {input.icon}
                                <input
                                    id={input.name}
                                    type={input.type}
                                    {...register(input.name)}
                                    disabled={isSubmitting || (input.name === "password" && userId !== "create")}
                                    className="grow text-black"
                                    placeholder={input.label}
                                />
                            </div>
                        )}
                        {input.name === "birthdate" && (
                            <div className="grid grid-cols-3 gap-2">
                                <select {...register("day")} disabled={isSubmitting} className="input input-bordered rounded-lg text-black">
                                    <option value="">Tanggal</option>
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                                <select {...register("month")} disabled={isSubmitting} className="input input-bordered rounded-lg text-black">
                                    <option value="">Bulan</option>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                        <option key={month} value={month}>
                                            {month}
                                        </option>
                                    ))}
                                </select>
                                <select {...register("year")} disabled={isSubmitting} className="input input-bordered rounded-lg text-black">
                                    <option value="">Tahun</option>
                                    {Array.from({ length: 60 }, (_, i) => i + 1960).map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {errors[input.name] && <p className="text-xs text-red-600 mt-2 text-end">{errors[input.name].message}</p>}
                    </div>
                ))}
            </div>

            <button className="btn btn-outline btn-info px-10 py-2" type="submit">
                {isSubmitting ? <Loading /> : `Submit`}
            </button>
            {errorMessage && <p className="text-red-600 text-sm text-center">{errorMessage}</p>}
        </form>
    );
};

export default UsersForm;

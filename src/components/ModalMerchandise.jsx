import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createMerchandise, updateMerchandise } from "../lib/firebase/merchandise";
import Loading from "./Loading";

const ModalMerchandise = ({ setIsRefetch, selectedMerchandise, setSelectedMerchandise }) => {
    const schema = z.object({
        name: z.string().min(3, { message: "Nama merchandise harus lebih dari 3 karakter" }),
        type: z.string().min(3, { message: "Tipe merchandise harus lebih dari 3 karakter" }),

    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (selectedMerchandise) {
            setValue("name", selectedMerchandise.name);
            setValue("type", selectedMerchandise.type);
        }
    }, [selectedMerchandise]);

    const onCancel = () => {
        reset();
        setSelectedMerchandise(null);
        document.getElementById("add_data").close();
    };

    const onSubmit = async (data) => {
        selectedMerchandise ? await updateMerchandise(selectedMerchandise.id, data) : await createMerchandise(data);
        setIsRefetch((prev) => !prev);
        reset();
        setSelectedMerchandise(null);
        onCancel();
    };

    return (
        <dialog id="add_data" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onCancel}>
                        ✕
                    </button>
                </form>
                <form className="flex flex-wrap gap-5 items-center" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control xl:basis-2/5 basis-full">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input type="text" placeholder="Name" id="name" {...register("name")} className="input input-bordered" />
                        {errors["name"] && <p className="text-xs text-red-600 mt-2 text-start">{errors["name"].message}</p>}
                    </div>
                    <div className="form-control xl:basis-2/5 basis-full">
                        <label className="label">
                            <span className="label-text">Tipe</span>
                        </label>
                        {/* create dropdown */}
                        <select {...register("type")} className="input input-bordered">
                            <option value="">Pilih Tipe</option>
                            <option value="regular">Regular</option>
                            <option value="exclusive">Exclusive</option>
                            <option value="free">Free</option>
                        </select>
                    </div>
                    <div className="form-control basis-full">
                        <button className="btn btn-info btn-outline" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loading /> : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default ModalMerchandise;

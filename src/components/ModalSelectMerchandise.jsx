import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getAllMerchandise } from "../lib/firebase/merchandise";
import Loading from "./Loading";
import { updateRedeemCode, updateRedeemMerchandise } from "../lib/firebase/redeemCode";

const ModalSelectMerchandise = ({ redeemCode, setIsRefetch }) => {
    const [merchandiseOptions, setMerchandiseOptions] = useState([]);

    const onCancel = () => {
        document.getElementById("add_merchandise").close();
    };

    const schema = z.object({
        merchandise: z.string(),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: zodResolver(schema),
    });

    const getMerchandiseOptions = async () => {
        const data = await getAllMerchandise();
    
        const filteredData = data.filter((item) => item.type === redeemCode.type);
    
        const mappedData = filteredData.map((item) => ({
            value: item.name,
            label: item.name,
        }));
    
        setMerchandiseOptions(mappedData);
    };

    useEffect(() => {
        getMerchandiseOptions();
    }, [redeemCode]);

    const onSubmit = async (data) => {
        await updateRedeemCode(redeemCode.id, true);
        await updateRedeemMerchandise(redeemCode.id, data.merchandise);
        setIsRefetch((prev) => !prev);
        reset();
        onCancel();
    };

    return (
        <dialog id="add_merchandise" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onCancel}>
                        ✕
                    </button>
                </form>
                <form className="flex flex-wrap gap-5 items-center" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control basis-full">
                        <label className="label">
                            <span className="label-text">Merchandise</span>
                        </label>
                        <select {...register("merchandise")} className="select select-bordered w-full">
                            {merchandiseOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors["merchandise"] && <p className="text-xs text-red-600 mt-2 text-start">{errors["merchandise"].message}</p>}
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

export default ModalSelectMerchandise;

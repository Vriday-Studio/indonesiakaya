import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Loading from "./Loading";
import { getCanClaim, getMinimalPointQuiz, setRedeemSettings } from "../lib/firebase/quiz";

const ModalRedeemSettings = () => {
    const [isRefetch, setIsRefetch] = React.useState(false);
    const onCancel = () => {
        document.getElementById("set_redeem").close();
    };

    const schema = z.object({
        regular: z.string(),
        exclusive: z.string(),
        canClaim: z.boolean(),
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm({
        resolver: zodResolver(schema),
    });

    const getMinimalPoint = async () => {
        const point = await getMinimalPointQuiz();
        const canClaim = await getCanClaim()
        setValue("regular", point.regular);
        setValue("exclusive", point.exclusive);
        setValue("canClaim", canClaim);
    };

    useEffect(() => {
        getMinimalPoint();
    }, [isRefetch]);

    const onSubmit = async (data) => {
        await setRedeemSettings({
            point: {
                regular: data.regular,
                exclusive: data.exclusive,
            },
            canClaim: data.canClaim,
        });
        setIsRefetch((prev) => !prev);
        onCancel();
    };

    return (
        <dialog id="set_redeem" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onCancel}>
                        ✕
                    </button>
                </form>
                <form className="flex flex-wrap gap-5 items-center" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control xl:basis-2/5 basis-full">
                        <label className="label">
                            <span className="label-text">Minimal Point to Claim Regular</span>
                        </label>
                        <input type="text" placeholder="Point Regular" id="regular" {...register("regular")} className="input input-bordered" />
                        {errors["regular"] && <p className="text-xs text-red-600 mt-2 text-start">{errors["regular"].message}</p>}
                    </div>
                    <div className="form-control xl:basis-2/5 basis-full">
                        <label className="label">
                            <span className="label-text">Minimal Point to Claim Exclusive</span>
                        </label>
                        <input type="text" placeholder="Point Exclusive" id="exclusive" {...register("exclusive")} className="input input-bordered" />
                        {errors["exclusive"] && <p className="text-xs text-red-600 mt-2 text-start">{errors["exclusive"].message}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        <input id="canClaim" {...register("canClaim")} type="checkbox" className="toggle toggle-info" defaultChecked />
                        <label htmlFor="canClaim" className="text-black">
                            Show Button Claim
                        </label>
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

export default ModalRedeemSettings;

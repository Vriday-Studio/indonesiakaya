import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "../../components/Loading";
import { createArtwork, getSelectedArtwork, updateArtwork } from "../../lib/firebase/artwork";
import BackIcon from "../../components/BackIcon";
import RichText from "../../components/RichText";

const DETAIL_INPUTS = [
    {
        name: "title",
        label: "Title",
        type: "text",
    },
    {
        name: "description",
        label: "Description",
        type: "wysiwyg",
    },
    {
        name: "startAtIndex",
        label: "Start At Index",
        type: "number",
    },
    {
        name: "endAtIndex",
        label: "End At Index",
        type: "number",
    },
    {
        name: "material",
        label: "Material",
        type: "text",
    },
    {
        name: "year",
        label: "Year",
        type: "text",
    },
    {
        name: "media",
        label: "Media",
        type: "text",
    },
    {
        name: "size",
        label: "Size",
        type: "text",
    },
    {
        name: "area",
        label: "Area",
        type: "text",
    },
    {
        name: "image",
        label: "Image",
        type: "file",
    },
];

const detailSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
    description: z.string().min(3, { message: "Description must be at least 3 characters long" }),
    startAtIndex: z.string().min(1, { message: "Start At Index must be at least 1 characters long" }),
    endAtIndex: z.string().min(1, { message: "End At Index must be at least 1 characters long" }),
    material: z.string().optional(),
    year: z.string().optional(),
    media: z.string().optional(),
    size: z.string().optional(),
    area: z.string().optional(),
    status: z.boolean().optional(),
    image: z.any().optional(),
});

const ArtworkForm = () => {
    const params = useParams();

    const navigate = useNavigate();
    const type = params.id === "create" ? "create" : params.id;

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm({
        resolver: zodResolver(detailSchema),
    });

    const watchImages = watch("image");

    const getDetail = async (id) => {
        try {
            const content = await getSelectedArtwork(id);
            Object.keys(content).forEach((key) => {
                setValue(key, content[key]);
            });
        } catch (error) {
            console.log("Error getting content setting by id: ", error);
        }
    };

    useEffect(() => {
        if (type !== "create") {
            getDetail(params.id);
        }
    }, []);

    const onSubmit = async (data) => {
        try {
            type === "create" ? await createArtwork(data) : await updateArtwork(params.id, data);
            navigate(`/dashboard/artwork`);
        } catch (error) {
            console.log("Error updating artwork: ", error);
        }
    };

    return (
        <form className="p-5 flex flex-col gap-3 relative z-20" onSubmit={handleSubmit(onSubmit)}>
            <BackIcon iconColor="black" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {DETAIL_INPUTS.map((input) => (
                    <div key={input.name} className="flex flex-col gap-2">
                        <label>{input.label}</label>
                        <div htmlFor={input.name} className="flex items-center gap-2">
                            {input.icon}

                            {input.type === "textarea" && (
                                <textarea id={input.name} placeholder={input.label} {...register(input.name)} className="textarea input-bordered w-full h-24" />
                            )}
                            {input.type === "wysiwyg" && (
                                <RichText 
                                    name={input.name}
                                    setFieldValue={setValue}
                                    inputLabel={input.label}
                                    value={watch(input.name)}
                                />
                            )}
                            {input.type === "file" && (
                                <input
                                    id={input.name}
                                    type={input.type}
                                    {...register(input.name)}
                                    disabled={isSubmitting}
                                    className={`text-black ${input.type === "file" ? "file-input file-input-bordered" : "input input-bordered"} w-full ${
                                        input.className
                                    }`}
                                    accept="image/*"
                                    placeholder={input.label}
                                />
                            )}

                            {["text", "number"].includes(input.type) && (
                                <input
                                    id={input.name}
                                    type={input.type}
                                    {...register(input.name)}
                                    disabled={isSubmitting}
                                    className={`text-black ${input.type === "file" ? "file-input file-input-bordered" : "input input-bordered"} w-full ${
                                        input.className
                                    }`}
                                    placeholder={input.label}
                                />
                            )}
                        </div>
                        {errors[input.name] && <p className="text-xs text-red-600 mt-2 text-end">{errors[input.name].message}</p>}
                    </div>
                ))}

                <div className="flex items-center gap-2">
                    <input id="status" type="checkbox" {...register("status")} disabled={isSubmitting} className="toggle toggle-info" defaultChecked />
                    <label htmlFor="status" className="text-black">
                        Published
                    </label>
                </div>
                {watchImages && Array.from(watchImages).length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        {watchImages instanceof FileList ? (
                            Array.from(watchImages).map((image, index) => (
                                <img key={index} src={URL.createObjectURL(image)} alt="preview" className="w-full h-56 object-cover" />
                            ))
                        ) : (
                            <img src={watchImages} alt="preview" className="w-full h-56 object-cover" />
                        )}
                    </div>
                ) : null}
            </div>
            <button className="btn btn-outline btn-info px-10 py-2" type="submit">
                {isSubmitting ? <Loading /> : `Submit`}
            </button>
        </form>
    );
};

export default ArtworkForm;

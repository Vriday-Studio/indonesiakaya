import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createContentSetting, getSelectedContentSetting, updateContentSetting } from "../../lib/firebase/contentSetting";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "../../components/Loading";
import BackIcon from "../../components/BackIcon";
import RichText from "../../components/RichText";

const CONTENT_INPUTS = [
    {
        name: "title",
        label: "Title",
        type: "text",
    },
    {
        name: "tag",
        label: "Tag",
        type: "text",
    },
    {
        name: "description",
        label: "Description",
        type: "wysiwyg",
    },
    {
        name: "images",
        label: "Images",
        type: "file",
        isMultiple: true,
    },
];

const contentSchema = z.object({
    title: z.string().min(3, { message: "Title must be at least 3 characters long" }),
    description: z.string().min(3, { message: "Description must be at least 3 characters long" }),
    tag: z.string().optional(),
    images: z.any().optional(),
    status: z.boolean().optional(),
});

const ContentSettingForm = () => {
    const params = useParams();
    const type = params.id === "create" ? "create" : params.id;
    const tag = params.tag;

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm({
        resolver: zodResolver(contentSchema),
    });

    const watchImages = watch("images");

    const getContentSettingById = async (id) => {
        try {
            const content = await getSelectedContentSetting({ data: { tag, id } });
            Object.keys(content).forEach((key) => {
                setValue(key, content[key]);
            });
        } catch (error) {
            console.log("Error getting content setting by id: ", error);
        }
    };

    useEffect(() => {
        if (tag === "guide") setValue("tag", "guide");
        if (type !== "create") {
            getContentSettingById(params.id);
        }
    }, []);

    const onSubmit = async (data) => {
        try {
            type === "create"
                ? await createContentSetting({ data: { ...data, paramTag: tag, id: params.id } })
                : await updateContentSetting({ data: { ...data, paramTag: tag, id: params.id } });
            navigate(`/dashboard/${tag}`);
        } catch (error) {
            console.log("Error creating content setting: ", error);
        }
    };

    return (
        <form className="p-5 flex flex-col gap-3 relative z-20" onSubmit={handleSubmit(onSubmit)}>
            <BackIcon iconColor="black" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {CONTENT_INPUTS.map((input) => (
                    <div key={input.name} className="flex flex-col gap-2">
                        <label>{input.label}</label>
                        <div htmlFor={input.name} className="flex items-center gap-2">
                            {input.icon}

                            {input.type === "textarea" && (
                                <textarea id={input.name} placeholder={input.label} {...register(input.name)} className="textarea input-bordered w-full h-24" />
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
                                    multiple={input.isMultiple}
                                />
                            )}
                            {input.type === "text" && (
                                <input
                                    id={input.name}
                                    type={input.type}
                                    {...register(input.name)}
                                    disabled={isSubmitting || (input.name === "tag" && type !== "create") || (tag === "guide" && input.name === "tag")}
                                    className={`text-black ${input.type === "file" ? "file-input file-input-bordered" : "input input-bordered"} w-full ${
                                        input.className
                                    }`}
                                    placeholder={input.label}
                                />
                            )}
                            {input.type === "wysiwyg" && (
                                <RichText 
                                    name={input.name}
                                    setFieldValue={setValue}
                                    inputLabel={input.label}
                                    value={watch(input.name)}
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
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {watchImages &&
                    Array.from(watchImages).map((image, index) => (
                        <img key={index} src={watchImages instanceof FileList ? URL.createObjectURL(image) : image} alt="preview" className="w-full h-56 object-cover" />
                    ))}
            </div>
            <button className="btn btn-outline btn-info px-10 py-2" type="submit">
                {isSubmitting ? <Loading /> : `Submit`}
            </button>
        </form>
    );
};

export default ContentSettingForm;

import React, { useEffect } from "react";
import UploadTab from "../../components/compiler/UploadTab";
import useCompiler, { COMPILER_STATE } from "../../lib/useCompiler";
import { uploadSingleFile } from "../../lib/firebase/utils";
import { createTarget } from "../../lib/firebase/target";
import DataTable from "../../components/DataTable";
import { createCompiledImage, getAllCompiledImages, getCompiledImagesCount, removeAllCompiledImages } from "../../lib/firebase/compiledImages";

const CompiledImages = () => {
    const { startCompiler, exportedBuffer, percentage, step } = useCompiler();
    const [isUploading, setIsUploading] = React.useState(false);
    const [isRefetch, setIsRefetch] = React.useState(false);

    useEffect(() => {
        const uploadCompiledMind = async () => {
            const url = await uploadSingleFile(new File([exportedBuffer], "targets.mind"), "target");
            await createTarget(url);
        };

        if (step === COMPILER_STATE.COMPILED) {
            uploadCompiledMind();
            setIsRefetch(!isRefetch);
        }
    }, [step]);

    const handleAddCompiledImages = async (files) => {
        if (files.length === 0) {
            console.error("please select images.");
            return;
        }
        setIsUploading(true);

        try {
            await removeAllCompiledImages();
            localStorage.removeItem("listAssets");
            for (const file of files) {
                await createCompiledImage(file);
            }
        } catch (error) {
            console.error("Error uploading artworks:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const RenderTab = () => {
        switch (step) {
            case COMPILER_STATE.IDLE:
                return (
                    <UploadTab
                        percentage={percentage}
                        onClick={(files) => {
                            startCompiler(files);
                            handleAddCompiledImages(files);
                        }}
                    />
                );
            case COMPILER_STATE.COMPILED:
                return (
                    <div className="flex flex-col mt-5 mx-10 items-center">
                        <div className="my-5 max-h-[80vh] w-full flex justify-center items-center p-6 border-2 border-dashed rounded-md border-slate-300 bg-slate-100">
                            <p>Images compiled!</p>
                            {isUploading && <p>Uploading images...</p>}
                        </div>
                    </div>
                );
            default:
                return <></>;
        }
    };

    return (
        <>
            <RenderTab />
            {!isUploading && (
                <DataTable
                    fetchData={getAllCompiledImages}
                    fetchCount={getCompiledImagesCount}
                    hideAction
                    columns={[
                        {
                            id: "image",
                            header: "Image",
                            cell: ({ row }) => <img src={row.original.image} alt={`Content`} className="w-24 h-24 object-cover" />,
                        },
                        { id: "id", header: "Index" },
                        { id: "title", header: "Filename" },
                    ]}
                    isRefetch={isRefetch}
                    canAddData={false}
                    userList
                />
            )}
        </>
    );
};

export default CompiledImages;

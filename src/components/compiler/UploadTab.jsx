import { useEffect, useMemo, useState } from "react";

const UploadTab = ({ onClick, percentage }) => {
    const [files, setFiles] = useState([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [isDragAccept, setIsDragAccept] = useState(false);
    const [isDragReject, setIsDragReject] = useState(false);

    const onDrop = (event) => {
        event.preventDefault();
        const acceptedFiles = Array.from(event.dataTransfer.files);

        const handleFile = (file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

        if (acceptedFiles.length > 0) {
            setFiles(acceptedFiles.map(handleFile));
            setIsDragAccept(true);
            setIsDragReject(false);
        } else {
            setIsDragReject(true);
            setIsDragAccept(false);
        }

        setIsDragActive(false);
    };

    const onDragOver = (event) => {
        event.preventDefault();
        setIsDragActive(true);
    };

    const onDragLeave = () => {
        setIsDragActive(false);
    };

    const handleFileInput = (event) => {
        const selectedFiles = Array.from(event.target.files);

        const handleFile = (file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

        setFiles(selectedFiles.map(handleFile));
    };

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isDragActive ? activeStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isDragActive, isDragReject, isDragAccept]
    );

    useEffect(() => {
        return () => {
            files.forEach((file) => URL.revokeObjectURL(file.preview));
        };
    }, [files]);

    const ImagePreview = () => (
        <div className="grid grid-cols-4 gap-5 overflow-auto">
            {files.map((file, id) => (
                <div key={`${file.name}-${id}`} className="flex justify-center">
                    <img src={file.preview} alt={file.name} className="max-w-full h-auto" />
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex flex-col mt-5 mx-10 items-center">
            <div
                className="my-5 max-h-[80vh] flex justify-center items-center p-6 border-2 border-dashed rounded-md"
                style={style}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragLeave={onDragLeave}
            >
                {percentage === null && <input type="file" onChange={handleFileInput} multiple className="hidden" id="fileInput" />}
                <label htmlFor="fileInput">
                    {files.length === 0 ? <p>Drag and drop your target images here or click to select files.</p> : <ImagePreview />}
                </label>
            </div>
            {percentage === null ? (
                <button disabled={files.length === 0} onClick={() => onClick(files)} className="btn">
                    Start Compiler
                </button>
            ) : (
                <progress className="progress progress-primary w-56" value={percentage} max="100"></progress>
            )}
        </div>
    );
};

export default UploadTab;

export const baseStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: "2px",
    borderRadius: "8px",
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    transition: "all 0.3s ease-in-out",
};

export const activeStyle = {
    borderColor: "#2196f3",
};

export const acceptStyle = {
    borderColor: "#00e676",
};

export const rejectStyle = {
    borderColor: "#ff1744",
};

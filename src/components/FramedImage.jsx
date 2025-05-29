import React from "react";
import { useNavigate } from "react-router-dom";

const FramedImage = ({ url, frameSrc, isCollected, imageSrc, imageTitle }) => {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(url)}>
            <div className="relative w-36 h-36">
                <img src={frameSrc} alt="Frame" className={`${isCollected ? "" : "grayscale"} absolute inset-0 w-full h-full object-cover z-10`} />
                <img src={imageSrc} alt="Inside frame" className={`${isCollected ? "" : "grayscale blur-[6px]"} absolute inset-0 w-full h-full object-cover object-center z-20 scale-75`} />
            </div>
            <hr className={`${isCollected ? "border-primary-brass" : "border-slate-400"} w-36 border mt-4`} />
            <p className={`${isCollected ? "text-primary-brass" : "text-slate-400"} text-sm text-center mt-2 w-36`}>{imageTitle}</p>
        </div>
    );
};

export default FramedImage;

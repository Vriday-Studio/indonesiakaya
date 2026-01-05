import React, { useEffect } from "react";
import { getContentSettingByTag } from "../lib/firebase/contentSetting";
import Carousel from "../components/Carousel";
import { useNavigate } from "react-router-dom";
import BackIcon from "../components/BackIcon";
import { sanitizeDOM } from "../lib/sanitizeDOM";
import LoadingScreen from "../components/LoadingScreen";

const Guide = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedContent, setSelectedContent] = React.useState(null);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const navigate = useNavigate();

    const handleActiveIndex = (index) => {
        setActiveIndex(index);
    };

    const handleNavigate = () => {
        sessionStorage.setItem("hasCompletedTutorial", true);
        navigate("/start");
    };

    useEffect(() => {
        const fetchContent = async () => {
            const contents = await getContentSettingByTag("guide", "asc");
            setSelectedContent(contents);
            setIsLoading(false);
        };
        fetchContent();
    }, []);

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <div className="w-full max-h-screen relative">
            <BackIcon className="absolute left-2 top-2 z-10" />
            <Carousel
                loop={false}
                positionNavigation="flex justify-between items-center top-1/3"
                positionPagination="bottom-[7rem] left-1/2 -translate-x-1/2"
                handleActiveIndex={handleActiveIndex}
            >
                {[
                    ...selectedContent.map((s) => (
                        <div key={s.title} className="w-full flex-shrink-0 h-screen object-cover text-gray-black bg-primary-orange">
                            <div className="bg-gray h-1/2">
                                <img src={s.images[0]} alt="Guide" className="w-full h-3/5 object-cover absolute" />
                            </div>
                            <div className="bg-guide flex justify-start items-center flex-col gap-2 px-16 py-5 h-1/2">
                                <h1 className="text-2xl font-bold">{s.title}</h1>
                                <hr className="border-t-4 border-gray-black w-full h-1" />
                                <div
                                    className="text-xs font-light text-center tracking-wide unreset"
                                    dangerouslySetInnerHTML={{ __html: sanitizeDOM(s.description) }}
                                ></div>
                            </div>
                        </div>
                    )),
                ]}
            </Carousel>
            <button onClick={handleNavigate} className="absolute bottom-[4rem] left-1/2 -translate-x-1/2 text-white bg-gray-black px-10 py-2 rounded-full">
                {activeIndex === selectedContent.length - 1 ? "Selesai" : "Lewati"}
            </button>
        </div>
    );
};

export default Guide;

import React, { useEffect } from "react";
import Carousel from "../components/Carousel";
import { useParams } from "react-router-dom";
import { getContentSettingByTag } from "../lib/firebase/contentSetting";
import BackIcon from "../components/BackIcon";
import { sanitizeDOM } from "../lib/sanitizeDOM";
import LoadingScreen from "../components/LoadingScreen";

const About = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedContent, setSelectedContent] = React.useState(null);
    const params = useParams();
    const tag = params.tag;

    useEffect(() => {
        const fetchContent = async () => {
            const contents = await getContentSettingByTag("content");
            const contentByTag = contents.filter((item) => item.tag === tag);
            setSelectedContent(contentByTag[0]);
            setIsLoading(false);
        };
        fetchContent();
    }, [tag]);

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <div>
            <BackIcon />
            <div className="w-full">
                <Carousel autoSlide hideNavigation>
                    {[
                        ...selectedContent.images.map((s) => (
                            <img key={s} src={s} className="w-full flex-shrink-0 max-h-80 md:h-96 object-contain object-top" />
                        )),
                    ]}
                </Carousel>
            </div>
            <div className="text-primary-orange flex justify-center items-center flex-col gap-2 px-10 py-5">
                <h1 className="text-xl font-bold pb-2">{selectedContent.title}</h1>
                <div
                    className="text-xs border-t-2 font-light text-center border-primary-orange py-5 tracking-wide leading-5 unreset"
                    dangerouslySetInnerHTML={{ __html: sanitizeDOM(selectedContent.description) }}
                ></div>
            </div>
        </div>
    );
};

export default About;

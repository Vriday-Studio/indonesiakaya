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
            <div className="w-full text-left">
                <Carousel autoSlide hideNavigation>
                    {[
                        ...selectedContent.images.map((s) => (
                            <img key={s} src={s} className="w-full flex-shrink-0 max-h-80 md:h-96 object-contain object-top" />
                        )),
                    ]}
                </Carousel>
            </div>
            <div className="text-primary-orange flex text-left flex-col gap-2 px-10 py-5">
                <h1 className="text-xl text-left font-bold pb-2">{selectedContent.title}</h1>
                <div
                    className="text-lg border-t-2 font-light  border-primary-orange py-5 text-left"
                >
                    Galeri Indonesia Kaya merupakan ruang edutainment budaya persembahan Bakti Budaya Djarum Foundation yang berbasis teknologi digital dari Indonesia untuk Indonesia yang menyuguhkan informasi kekayaan budaya nusantara. Mulai dari alat musik tradisional, mainan tradisional, baju adat, sampai informasi tentang kuliner, pariwisata, tradisi dan kesenian dikemas secara digital dan interaktif di tempat pertunjukan ini.

Terletak di Grand Indonesia, Galeri Indonesia Kaya menawarkan alternatif dalam mempelajari tradisi budaya Indonesia dengan cara yang lebih modern, menyenangkan, mudah dan gratis.<br></br><br></br>

Galeri Indonesia Kaya dilengkapi dengan auditorium berkapasitas 150 orang sebagai ruang seni pertunjukan yang menyuguhkan tontonan budaya, mulai dari seni panggung teater, musik, pemutaran film, nonton teater, pertunjukan musikal, diskusi budaya, seminar dan workshop secara gratis. Para seniman yang ingin memakai auditorium dapat menggunakannya sebagai gedung pertunjukan atau tempat pertunjukan tanpa dipungut biaya.

Galeri Indonesia Kaya sebagai pentas budaya juga menyuguhkan berbagai macam pertunjukan budaya dari seniman-seniman Indonesia, baik mereka yang baru berkiprah atau mereka yang telah lama berkecimpung dalam dunia seni, tiap akhir pekan.
                </div>
            </div>
        </div>
    );
};

export default About;

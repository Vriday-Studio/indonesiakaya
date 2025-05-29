import React, { useEffect } from "react";
import Carousel from "../components/Carousel";
import { useParams } from "react-router-dom";
import { getContentSettingByTag } from "../lib/firebase/contentSetting";
import BackIcon from "../components/BackIcon";
import { sanitizeDOM } from "../lib/sanitizeDOM";
import LoadingScreen from "../components/LoadingScreen";

const Aboutcerita = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedContent, setSelectedContent] = React.useState(null);
    const params = useParams();
    const tag = params.tag;

 //useEffect(() => {
//const fetchContent = async () => {
           // const contents = await getContentSettingByTag("content");
         //   const contentByTag = contents.filter((item) => item.tag === tag);
          //  setSelectedContent(contentByTag[0]);
          //  setIsLoading(false);
    //    };
//fetchContent();
//}, [tag]);

   

    return (
        <div>
            <div className="relative w-full h-1/2 h-2/5 text-left">
                <Carousel autoSlide animationType="fade" hideNavigation hidePagination>
                    {[
                        "/images/car1.png",
                        "/images/car2.png",
                        "/images/car3.png",
                        "/images/car4.png",
                        "/images/car5.png"
                    ].map((s) => <img key={s} src={s} className="w-full h-1/2 flex-shrink-0 h-full object-cover" />)}
                </Carousel>
                <div className="absolute top-1 bg-gradient-to-t from-primary-darker w-full h-full z-10"></div>
                <BackIcon className="absolute top-4 left-4 z-20" />
            </div>

            <div id="isi" className="text-primary-orange flex justify-center items-left text-left flex-col gap-2 px-10 py-5 -mt-14 relative z-20">
               <h1 className="text-xl font-bold pb-2">Cerita Rakyat</h1>
               
                <div
                    className="text-lg border-t-2 font-light  border-primary-orange py-5 text-left"
                >

<b>Cerita rakyat </b>adalah warisan lisan yang telah hidup dari generasi ke generasi—kisah yang mengandung nilai, harapan, dan identitas budaya bangsa. Di balik dongeng-dongeng sederhana, tersembunyi pesan tentang kebaikan, keberanian, dan kebijaksanaan yang membentuk cara kita melihat dunia.
<br></br><br></br>
Melalui galeri ini, kami menghidupkan kembali cerita-cerita tersebut dengan pendekatan visual dan interaktif. Pengunjung diajak masuk ke dalam dunia Lutung Kasarung dan Raja Ampat, tidak hanya untuk membaca, tetapi juga merasakan dan menjelajahinya secara langsung.

   </div>

            </div>
            
        </div>
    );
};

export default Aboutcerita;

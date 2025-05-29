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

  

    const paragraphs = {
        1: 'Tekan tombol “Mulai Jelajah Cerita” untuk mengaktifkan kamera. Arahkan ke gambar untuk mulai eksplorasi cerita interaktif!',
        2: 'Temukan 2 QR code di awal cerita Lutung Kasarung dan Raja Ampat. Pindai untuk membaca cerita lengkap dan mulai petualanganmu!',
        3: 'Tekan tombol “Kuis” untuk menjawab kuisnya. Dapatkan nilai lebih dari 300 untuk ditukar dengan hadiah dari Indonesia Kaya. Semakin besar nilaimu, semakin menarik hadiahnya!',
        4: 'Cari item-item tersembunyi di setiap panel. Saat Anda menemukannya, item akan otomatis tersimpan dalam koleksi Anda.',
        5: 'Sekarang saatnya kamu menjelajahi cerita. Selamat menikmati pengalaman di dunia Cerita Rakyat Indonesia!'
       
    };

    return (
        <div className="w-full max-h-screen relative">
                      <button 
                onClick={() => navigate(-1)} 
                className="absolute left-0 top-4 z-10 w-20 h-20"
            >
                <img 
                    src="/images/back.png" 
                    alt="Back" 
                    className="w-full h-full object-contain"
                />
            </button>
            <Carousel
                loop={false}
                positionNavigation="flex justify-between items-center top-1/3"
                positionPagination="bottom-[5rem] left-1/2 -translate-x-1/2"
                handleActiveIndex={handleActiveIndex}
            >
                {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="w-full flex-shrink-0 h-screen object-cover text-gray-black bg-primary-orange">
                          <div className="bg-gray w-full h-1/2 relative pt-18">
                            <img 
                                id="carouselimage" 
                                src={`/images/carq${index}.png`} 
                                alt={`Guide ${index}`} 
                                className="w-full h-full object-cover mt-6" 
                            />
                        </div>
                        <div className="bg-guide flex justify-start items-center flex-col gap-2 px-16 py-5 h-1/2">
                            <h1 id="carouseljudul" className="text-2xl font-bold">
                                {index === 1 ? "Selamat Datang" : 
                                 index === 2 ? "Petunjuk 1" : 
                                  index === 3 ? "Petunjuk 2" : 
                                  index === 4 ? "Petunjuk 3" : 
                                  index === 5 ? "Ayo Jelajah" : 
                                 `Petunjuk ${index}`}
                                
                            </h1>
                            <hr className="border-t-4 border-gray-black w-full h-1" />
                            <div id="carouselparagraf" className="text-sm font-light text-center tracking-wide unreset max-w-md mx-auto">
                                <p>{paragraphs[index]}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
            <button id="skipbutton" onClick={handleNavigate} className="absolute bottom-[1rem] left-1/2 -translate-x-1/2 text-white bg-gray-black px-10 py-2 rounded-full">
                {activeIndex === 4 ? "Selesai" : "Lewati"}
            </button>
        </div>
    );
};

export default Guide;

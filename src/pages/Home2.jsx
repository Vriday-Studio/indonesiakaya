import React, { useEffect } from "react";
import Carousel from "../components/Carousel";
import { Link, useNavigate } from "react-router-dom";
import { getContentSettingByTag } from "../lib/firebase/contentSetting";
import { useAuth } from "../context/AuthProvider";
import logoGaleri from "/images/logo-galeri-indonesia-kaya.png";
import { getCountFromTotal } from "../lib/firebase/scannedImageServices";
import { getSelectedUserPoints } from "../lib/firebase/users";
import LoadingScreen from "../components/LoadingScreen";
import { getCanClaim } from "../lib/firebase/quiz";
import { initializeApp } from "firebase/app";
import {firebaseConfig} from "../lib/firebase/firebase";
const Home2 = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedContent, setSelectedContent] = React.useState(null);
    const [countFromTotal, setCountFromTotal] = React.useState("");
    const [userPoint, setUserPoint] = React.useState("");
    const [canClaim, setCanClaim] = React.useState(false);
    const [showStory, setShowStory] = React.useState(false);
    initializeApp(firebaseConfig);
    const hasCompletedTutorial = sessionStorage.getItem("hasCompletedTutorial");
    const redirectUserUrl = hasCompletedTutorial ? "/start" : "/guide";
    const getUserPoint = async () => {
        const point = await getSelectedUserPoints(user.id);
        setUserPoint(point);
    };

    useEffect(() => {
        // Cek jika user adalah null
        if (user === null) {
            navigate('/login'); // Arahkan ke halaman login
        }
    }, [user, navigate]); // Tambahkan user dan navigate sebagai dependensi

    useEffect(() => {
        const fetchContent = async () => {
            const contents = await getContentSettingByTag("content");
            const contentByTag = contents.find((item) => item.tag === "home");
            setSelectedContent(contentByTag);
            setIsLoading(false);
        };

        fetchContent();
    }, []);

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const res = await getCountFromTotal(user.id);
                const claim = await getCanClaim();
                setCountFromTotal(res);
                setCanClaim(claim);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
        getUserPoint();
    }, [user]);

    useEffect(() => {
        // Mengubah judul tab browser
        document.title = "Empat Raja";
        setIsLoading(false);
    }, []);

    const handleStartClick = () => {
        setShowStory(true);
    };

    const handleContinueToGame = () => {
        navigate('/joystix');
    };
    const handleHome = () => {
        navigate('/story-detail/empat-raja');
    };
    if (isLoading) {
        return <LoadingScreen />;
    }

    if (showStory) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-primary-darker p-8">
               
               <div className="max-w-2xl text-white text-lg leading-relaxed mb-8 text-center">
                <h1>Arungi</h1>
               </div>
                <div className="max-w-2xl text-white text-base leading-relaxed mb-8 text-center">
                    
                    <p className="mb-8">
                    Di sebuah desa yang damai, hiduplah sepasang suami istri yang sangat menginginkan seorang anak. Setiap hari mereka berdoa dengan tulus, berharap keajaiban datang ke dalam hidup mereka.
Suatu pagi, mereka memutuskan pergi ke hutan untuk mencari kayu bakar…<br></br> <b>Tanpa mereka tahu, hari itu akan mengubah segalanya.</b>
</p>
                   
                    <button
                        onClick={handleContinueToGame}
                        className="bg-primary-orange text-white text-xl font-bold rounded-xl px-10 py-6 hover:bg-primary-orange/90 transition-colors"
                    >
                        Mulai Petualangan
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col items-center bg-primary-darker">
            <button id="homebutton"
                        onClick={() => handleHome()}
                        className="absolute top-4 left-4 z-30 w-10 h-10"
                    >
                         <img src="/images/back.png" alt="Back" className="w-full h-full object-contain" />
                    </button>
            <img 
                src="/images/banner4.png" 
                alt="Banner" 
                className="w-full max-h-[25%] object-contain fixed top-0 relative"
            />
            <div className="absolute top-0 left-0 w-full h-[25%] flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-white mb-2">Jejak Telur Ajaib</h1>
                <p className="text-xl text-white">Cara Main</p>
            </div>
            <br></br><br></br>
            <div className="flex flex-col items-center h-full">
                <p id="caramain" className="text-sm text-white mb-8 justify-center mr-8 ml-8">Ini adalah petualangan budaya di tanah Raja Ampat!
<br></br><br></br>
Tujuanmu:
Temukan 7 item tersembunyi yang tersebar di seluruh peta.
<br></br><br></br>
Kontrol:
Gunakan thumbstick untuk menggerakkan karaktermu.
<br></br><br></br>
Setiap item yang bisa dikumpulkan akan diberi tanda:</p>

                <img 
                    src="/images/arrowglow.png" 
                    alt="Arrow Glow" 
                    className="w-32 h-32 mb-4 object-contain"
                />

                <button id="ok"
                    onClick={handleContinueToGame}
                    className="bg-primary-orange text-white text-base font-bold rounded-xl px-8 py-3 hover:bg-primary-orange/90 transition-colors"
                >
                    OK! Mengerti
                </button>
            </div>
        </div>
    );
};

export default Home2;

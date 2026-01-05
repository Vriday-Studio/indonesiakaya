import React, { useEffect } from "react";
import Carousel from "../components/Carousel";
import { Link } from "react-router-dom";
import { getContentSettingByTag } from "../lib/firebase/contentSetting";
import { useAuth } from "../context/AuthProvider";
import logoGaleri from "/images/logo-galeri-indonesia-kaya.png";
import { getCountFromTotal } from "../lib/firebase/scannedImageServices";
import { getSelectedUserPoints } from "../lib/firebase/users";
import LoadingScreen from "../components/LoadingScreen";
import { getCanClaim } from "../lib/firebase/quiz";
const Home = () => {
    const { user, logoutUser } = useAuth();
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedContent, setSelectedContent] = React.useState(null);
    const [countFromTotal, setCountFromTotal] = React.useState("");
    const [userPoint, setUserPoint] = React.useState("");
    const [canClaim, setCanClaim] = React.useState(false);

    const hasCompletedTutorial = sessionStorage.getItem("hasCompletedTutorial");
    // redirectUserUrl = hasCompletedTutorial ? "/start" : "/guide";
 const redirectUserUrl = "/control-arundaya";
    const getUserPoint = async () => {
        const point = await getSelectedUserPoints(user.id);
        setUserPoint(point);
    };

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

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div>
            <div className="relative">
                <img src={logoGaleri} alt="Galeri Indonesia Kaya" className="w-1/2 absolute top-5 left-1/2 -translate-x-1/2 z-20" />
                <Link to="/guide" className="absolute top-3 right-3 z-20 bg-primary-darker opacity-60 rounded-xl px-6 py-4">
                    <svg width="10" height="23" viewBox="0 0 10 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3.87402 10.4642L3.87832 10.4631L3.92963 10.3103C4.07279 9.88409 4.14539 9.50422 4.084 9.21155C4.05114 9.05489 3.97622 8.90654 3.83895 8.80105C3.70398 8.69731 3.54224 8.66084 3.38378 8.66084C2.98501 8.66084 2.64499 8.87146 2.36318 9.20312L2.3627 9.20369C2.32418 9.24926 2.28565 9.29878 2.2471 9.35217C2.5115 8.92425 2.82045 8.60628 3.16938 8.3879C3.78933 7.9999 4.49371 7.80422 5.28824 7.80422C6.09809 7.80422 6.64635 7.9974 6.95488 8.31603C7.29199 8.6642 7.48175 9.09049 7.52128 9.60937L7.52128 9.60943C7.56261 10.1506 7.49233 10.6955 7.31011 11.2434L7.30999 11.2438L4.52943 19.6394L4.52931 19.6394L4.52686 19.6476C4.4526 19.8954 4.40398 20.1165 4.38605 20.307C4.36862 20.4923 4.37716 20.678 4.44546 20.8357C4.50524 20.9738 4.59823 21.0928 4.7297 21.1747C4.8597 21.2557 5.00662 21.2877 5.15466 21.2877C5.46213 21.2877 5.76252 21.1058 6.0411 20.8557C6.12012 20.7847 6.19624 20.6977 6.26999 20.5969C5.97993 21.083 5.64584 21.4175 5.27591 21.618L5.27568 21.6182C4.62527 21.9716 3.98422 22.1428 3.35218 22.1428C2.61658 22.1428 2.08039 21.9784 1.70853 21.6869C1.34378 21.401 1.11621 20.9703 1.05233 20.3591C0.987905 19.7412 1.09936 18.9566 1.40994 17.9927C1.41001 17.9925 1.41009 17.9922 1.41017 17.992L3.87402 10.4642ZM5.42886 4.56161C5.15879 4.32918 5.0099 4.01184 5.00139 3.57573L5.00354 3.4665C5.0194 2.6612 5.28716 2.08778 5.77895 1.69664C6.29377 1.28754 6.92038 1.07731 7.6724 1.07731C8.35875 1.07731 8.81843 1.22999 9.10472 1.48225C9.38438 1.72868 9.53647 2.09384 9.5198 2.63117L9.51974 2.63368C9.50438 3.31586 9.24537 3.86483 8.73579 4.30165C8.22039 4.74345 7.59007 4.96883 6.82358 4.96883C6.1776 4.96883 5.72726 4.81963 5.42938 4.56206L5.42886 4.56161Z"
                            fill="white"
                            stroke="white"
                            strokeWidth="0.594077"
                        />
                    </svg>
                </Link>
            </div>
            <div className="relative w-full h-2/5">
                <Carousel autoSlide animationType="fade" hideNavigation hidePagination>
                    {[...selectedContent.images.map((s) => <img key={s} src={s} className="w-full flex-shrink-0 h-full object-cover" />)]}
                </Carousel>
                <div className="absolute top-0 bg-gradient-to-t from-primary-darker w-full h-full z-10"></div>
            </div>
            <div className="relative h-full text-primary-brass flex flex-col items-center gap-2 -mt-10 z-50">
                <p className="text-xs tracking-widest">
                    JELAJAH K<span className="text-sm">AR</span>YA
                </p>
                <h1 className="text-3xl font-bold">Arundaya</h1>
                <div className="grid grid-cols-1 gap-2 mx-10 mt-3">
                    
                    <Link
                        to="/about/galeri-indonesia-kaya"
                        className="border border-soft-cream bg-primary-darker text-soft-cream rounded-xl text-center content-center px-5 py-2 text-xs"
                    >
                        Tentang <br /> Galeri Indonesia Kaya
                    </Link>
                    <Link
                        to={user ? redirectUserUrl : "/login"}
                        className="bg-primary-orange text-white rounded-xl text-center px-5 py-6 col-span-2 flex items-center justify-evenly"
                    >
                        <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.6399 7.71892C16.4125 7.37623 16.1185 7.08152 15.7746 6.85313C16.1256 6.63061 16.424 6.34153 16.6564 6.00737C16.8838 6.35005 17.1778 6.64477 17.5217 6.87316C17.1707 7.09568 16.8723 7.38476 16.6399 7.71892Z"
                                fill="white"
                                stroke="white"
                                strokeWidth="5"
                            />
                            <path
                                d="M6.31254 16.895C6.32894 16.8795 6.34516 16.8638 6.36118 16.848C6.37737 16.8647 6.39375 16.8812 6.41032 16.8975C6.39392 16.913 6.37771 16.9286 6.36168 16.9445C6.3455 16.9278 6.32912 16.9113 6.31254 16.895Z"
                                fill="white"
                                stroke="white"
                                strokeWidth="5"
                            />
                            <path
                                d="M18.3619 24.1455C18.3783 24.13 18.3945 24.1143 18.4105 24.0985C18.4267 24.1152 18.4431 24.1317 18.4596 24.148C18.4432 24.1635 18.427 24.1791 18.411 24.195C18.3948 24.1783 18.3784 24.1618 18.3619 24.1455Z"
                                fill="white"
                                stroke="white"
                                strokeWidth="5"
                            />
                        </svg>

                        <p className="text-xl">Mulai Permainan</p>
                    </Link>
                    <div className="col-span-2 border border-soft-cream bg-primary-darker text-soft-cream rounded-xl text-center p-4 text-xs flex flex-col items-center">
                        {user ? (
                            <>
                                <p className="text-nowrap">Halo, {user.Nama}</p>
                                <div className="flex gap-5">
                                    <button onClick={logoutUser} className="w-full my-2 underline underline-offset-4 text-nowrap w-webkit-max-content">
                                        Logout
                                    </button>
                                </div>

                                <Link to="/collection" className="text-xs pb-2 mt-2 w-3/4 text-center">
                                    Galeri: {countFromTotal} | Poin: {userPoint || 0}
                                </Link>
                                <Link to="/profile" className="bg-primary-orange text-white rounded-xl mt-4 p-2 w-3/4">
                                    {!user.Gender ? "Lengkapi Profile +80 poin" : "Lihat Profil"}
                                </Link>
                                {canClaim && (
                                    <Link to="/claim" className="bg-primary-orange text-white rounded-xl mt-4 p-2 w-3/4">
                                        Klaim Hadiah
                                    </Link>
                                )}
                            </>
                        ) : (
                            <Link to="/login" className="w-full text-lg underline underline-offset-4">
                                Masuk / Daftar
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

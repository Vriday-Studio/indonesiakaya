import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { getTargetUrl } from "./lib/firebase/target";

import DashboardLayout from "./components/layout/DashboardLayout";
import RootLayout from "./components/layout/RootLayout";
import AuthLayout from "./components/layout/AuthLayout";

import AuthForm from "./pages/auth/AuthForm";
import Dashboard from "./pages/dashboard/Dashboard";
import Artwork from "./pages/dashboard/Artwork";
import ArtworkForm from "./pages/dashboard/ArtworkForm";
import QuizForm from "./pages/dashboard/QuizForm";
import ContentSettingForm from "./pages/dashboard/ContentSettingForm";
import ContentSetting from "./pages/dashboard/ContentSetting";
import Users from "./pages/dashboard/Users";
import UsersForm from "./pages/dashboard/UsersForm";
import Home from "./pages/Home";
import Home2 from "./pages/Home2";
import DetailImage from "./pages/DetailImage";
import Quiz from "./pages/dashboard/Quiz";
import Collection from "./pages/Collection";
import StartAR from "./pages/StartAR";
import About from "./pages/About";
import Guide from "./pages/Guide";
import ArtworkListUser from "./pages/dashboard/ArtworkListUser";
import QuizCarousel from "./pages/QuizCarousel";
import QuizListUser from "./pages/dashboard/QuizListUser";
import RedeemCode from "./pages/dashboard/ReedemCode";
import CompiledImages from "./pages/dashboard/CompiledImages";
import { getAllCompiledImages } from "./lib/firebase/compiledImages";
import ProfileForm from "./pages/ProfileForm";
import Merchandise from "./pages/dashboard/Merchandise";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Claim from "./pages/Claim";
import LoadingScreen from "./components/LoadingScreen";
import Report from "./pages/dashboard/Report";
import Joystix from "./pages/Joystix";
import Aboutcerita from "./pages/Aboutcerita";
import StoryDetail from "./pages/StoryDetail";
import MiniQuiz from "./pages/MiniQuiz";
import QRScanner from "./pages/QRScanner";
import Arundaya from "./pages/arundaya";
import ControlArundaya from "./pages/ControlArundaya";

function App() {
    const [isLandscape, setIsLandscape] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const chekAuthExpired = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const currentTime = new Date().getTime();
        if (user && (!user.expiredAt || currentTime > user.expiredAt)) {
            localStorage.removeItem("user");
        }
    };
    
    useEffect(() => {
        const fetchTargetUrl = async () => {
            try {
                const url = await getTargetUrl();
                const listAssets = await getAllCompiledImages();
                localStorage.setItem("targetUrl", url);
                localStorage.setItem("listAssets", JSON.stringify(listAssets));
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching target URL:", error);
                setIsLoading(false);
            }
        };

        const handleOrientationChange = () => {
            const userAgent = navigator.userAgent;
            if (window.innerWidth > window.innerHeight && (userAgent.match(/iPhone/i) || userAgent.match(/Android/i))) {
                setIsLandscape(true);
            } else {
                setIsLandscape(false);
            }
        };

        handleOrientationChange();
        fetchTargetUrl();
        chekAuthExpired();

        window.addEventListener("resize", handleOrientationChange);

        return () => {
            window.removeEventListener("resize", handleOrientationChange);
        };
        // The reason why we need to fetch the target URL and the list assets here is because there is a bug when fetching the target URL in the MindARViewer component
        // The bug is that the target URL is fetched and also successfully injected into the scanner
        // But, the scanner won't showed up, it is maybe due to the fact that the scanner is not yet mounted when the target URL is fetched
        // So, we fetch the target URL here and store it in the localStorage
    }, []);

    if (isLandscape) {
        return (
            <div className="h-screen flex justify-center items-center z-50 bg-primary-darker">
                <h1 className="text-3xl font-bold text-primary-orange">Please rotate your device to portrait mode</h1>
            </div>
        );
    }

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<AuthForm type="login" />} />
                <Route path="/register" element={<AuthForm type="register" />} />
                <Route path="/reset-password" element={<AuthForm type="reset" />} />
                <Route path="/new-password" element={<AuthForm type="new" />} />
            </Route>
            <Route element={<RootLayout />}>
                <Route index element={<Home />} />
                <Route path="/about/:tag" element={<About />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/claim" element={<Claim />} />
                <Route path="/collection" element={<Collection />} />
                <Route path="/detail" element={<DetailImage />} />
                <Route path="/collection/:id/quiz" element={<QuizCarousel />} />
                <Route path="/profile" element={<ProfileForm />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/joystix" element={<Joystix />} />
                <Route path="/Home2" element={<Home2 />} />
                <Route path="/Aboutcerita" element={<Aboutcerita />} />
                <Route path="/story-detail/:cerita" element={<StoryDetail />} />
                <Route path="/mini-quiz" element={<MiniQuiz />} />
                <Route path="/mini-quiz/:quizType" element={<MiniQuiz />} />
                <Route path="/control-arundaya" element={<ControlArundaya />} />
            </Route>
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/artwork" element={<Artwork />} />
                <Route path="/dashboard/artwork/:id" element={<ArtworkForm />} />
                <Route path="/dashboard/artwork/:id/users" element={<ArtworkListUser />} />
                <Route path="/dashboard/compiler" element={<CompiledImages />} />
                <Route path="/dashboard/quiz" element={<Quiz />} />
                <Route path="/dashboard/quiz/:id/" element={<QuizForm />} />
                <Route path="/dashboard/quiz/:id/users" element={<QuizListUser />} />
                <Route path="/dashboard/:tag" element={<ContentSetting />} />
                <Route path="/dashboard/:tag/:id" element={<ContentSettingForm />} />
                <Route path="/dashboard/users" element={<Users />} />
                <Route path="/dashboard/users/:id" element={<UsersForm />} />
                <Route path="/dashboard/redeem/" element={<RedeemCode />} />
                <Route path="/dashboard/merchandise/" element={<Merchandise />} />
                <Route path="/dashboard/report/" element={<Report />} />

            </Route>
            <Route path="/start" element={<QRScanner />} />
            <Route path="/arundaya" element={<Arundaya />} />
        </Routes>
    );
}

export default App;

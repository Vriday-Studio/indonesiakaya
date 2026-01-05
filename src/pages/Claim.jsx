import React, { useEffect, useState } from "react";
import BackIcon from "../components/BackIcon";
import bgAuth from "/images/bg-auth.png";
import { useAuth } from "../context/AuthProvider";
import { getSelectedUserPoints } from "../lib/firebase/users";
import { getMinimalPointQuiz } from "../lib/firebase/quiz";
import { Link } from "react-router-dom";
import { checkRedeemCodeById, createRedeemCode, getRedeemCodeByUser } from "../lib/firebase/redeemCode";
import LoadingScreen from "../components/LoadingScreen";

const Claim = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [userPoint, setUserPoint] = useState(0);
    const [minimalPoint, setMinimalPoint] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [userRedeemCode, setUserRedeemCode] = useState("");
    const [userRedeemStatus, setUserRedeemStatus] = useState(false);
    const [userRedeemType, setUserRedeemType] = useState("");

    const { user } = useAuth();
    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const [point, minimal, userRedeem] = await Promise.all([
                    getSelectedUserPoints(user.id, false),
                    getMinimalPointQuiz(),
                    getRedeemCodeByUser(user.id),
                ]);
                const redeemStatus = await checkRedeemCodeById(userRedeem);

                setUserPoint(point);
                setMinimalPoint(minimal);
                setUserRedeemStatus(redeemStatus && redeemStatus.status);
                setUserRedeemType(redeemStatus && redeemStatus.type);
                setUserRedeemCode(userRedeem && userRedeem);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleCreateRedeem = async (isFree) => {
        try {
            const merchType = isFree ? "free" : selectedOption;
            const res = await createRedeemCode(user, merchType);
            setUserRedeemCode(res);
            setUserPoint(0);
            return;
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return <LoadingScreen />;
    }

    const isFree = minimalPoint.regular == 0 && minimalPoint.exclusive == 0;

    return (
        <div className="h-screen flex flex-col items-center gap-10 relative z-20 bg-primary-dark">
            <BackIcon className="absolute left-2 top-2 z-10" iconColor="white" />
            <div className="relative flex flex-col justify-center items-center gap-1 px-5 w-full bg-primary-orange/80 h-1/5">
                <h1 className="text-xl font-bold text-white">Penukaran Poin</h1>
                {!userRedeemCode && <div className="bg-cream text-primary-brass rounded-2xl py-1 px-10 mt-2 font-bold pb-2">{userPoint}</div>}
                <img src={bgAuth} alt="bg-auth" className="absolute w-4/5 h-full py-2" />
            </div>
            {/* Screen if regular point === 0 && exclusive === 0 */}
            {isFree && !userRedeemCode && (
                <div className="flex flex-col gap-10 justify-center items-center">
                    <div className="space-y-8 px-20">
                        <p className="text-lg font-bold text-center text-white">Apakah kamu yakin ingin menukarkan poin dengan merchandise kami ?</p>
                    </div>

                    <button
                        onClick={() => handleCreateRedeem(true)}
                        className="border border-primary-brass rounded-xl px-12 py-3 text-white disabled:bg-slate-600 disabled:border-slate-600"
                    >
                        Tukarkan Poin
                    </button>
                </div>
            )}
            {!isFree && userPoint >= minimalPoint.regular && !userRedeemCode && (
                <div className="space-y-4 flex flex-col items-center w-full">
                    {minimalPoint.regular > 0 && (
                        <button
                            type="button"
                            disabled={userPoint < minimalPoint.regular}
                            className={`w-3/4 space-y-2 p-4 rounded-lg ${
                                selectedOption === "regular" ? "bg-primary-brass" : "bg-slate-300"
                            } disabled:bg-slate-700`}
                            onClick={() => handleOptionSelect("regular")}
                        >
                            <p className="border-b border-primary-darker pb-2">Merchandise Reguler</p>
                            <p>{minimalPoint.regular} Point</p>
                        </button>
                    )}
                    {minimalPoint.exclusive > 0 && (
                        <button
                            type="button"
                            disabled={userPoint < minimalPoint.exclusive}
                            className={`w-3/4 space-y-2 p-4 rounded-lg ${
                                selectedOption === "exclusive" ? "bg-primary-brass" : "bg-slate-300"
                            } disabled:bg-slate-700`}
                            onClick={() => handleOptionSelect("exclusive")}
                        >
                            <p className="border-b border-primary-darker pb-2">Merchandise Exclusive</p>
                            <p>{minimalPoint.exclusive} Point</p>
                        </button>
                    )}

                    <button
                        disabled={!selectedOption}
                        onClick={() => handleCreateRedeem(false)}
                        className="border border-primary-brass rounded-xl px-12 py-3 text-white disabled:bg-slate-600 disabled:border-slate-600"
                    >
                        Tukarkan Poin
                    </button>
                </div>
            )}
            {!isFree && userPoint < minimalPoint.regular && !userRedeemCode && (
                <div className="flex flex-col gap-10 justify-center items-center">
                    <div className="space-y-8 px-20">
                        <p className="text-lg font-bold text-center text-white">
                            Kumpulkan koleksi lainnya untuk melihat informasi dan mainkan kuisnya untuk mendapatkan merchandise ekslusif Galeri Indonesia Kaya.
                        </p>
                    </div>

                    <Link to="/" className="border border-primary-brass rounded-xl px-12 py-3 text-white">
                        OK, Mengerti
                    </Link>
                </div>
            )}
            {/* Screen if the merch has been claimed */}
            {userRedeemCode && userRedeemStatus && (
                <div className="flex flex-col gap-10 justify-center items-center">
                    <div className="space-y-8 px-20">
                        <p className="text-lg font-bold text-center text-white">Hadiah merchandise sudah diklaim.</p>
                    </div>

                    <div>
                        <Link to="/" className="border border-primary-brass rounded-xl px-12 py-3 text-white" onClick={() => {}}>
                            OK, Mengerti
                        </Link>
                    </div>
                </div>
            )}
            {userRedeemCode && !userRedeemStatus && (
                <div className="flex flex-col gap-10 justify-center items-center">
                    <div className="space-y-8 px-20">
                        <p className="text-lg font-bold text-center text-white">
                            Selamat kamu mendapatkan merchandise {userRedeemType} dari Galeri Indonesia kaya.
                        </p>
                        <p className="text-xs text-center text-white">hubungi GRO kami untuk mendapatkan bantuan dan pengambilan merchandise</p>
                        <p className="text-lg text-center text-white">Kode Redeem: {userRedeemCode}</p>
                    </div>

                    <div>
                        <Link to="/" className="border border-primary-brass rounded-xl px-12 py-3 text-white" onClick={() => {}}>
                            OK, Mengerti
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Claim;

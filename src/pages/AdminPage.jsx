import React, { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import { useParams } from "react-router-dom";
import { getContentSettingByTag } from "../lib/firebase/contentSetting";
import BackIcon from "../components/BackIcon";
import { sanitizeDOM } from "../lib/sanitizeDOM";
import LoadingScreen from "../components/LoadingScreen";
import { initializeApp } from "firebase/app";
import { ref, get, set, update  } from "firebase/database";
import { database } from "../lib/firebase/firebase";
import {firebaseConfig} from "../lib/firebase/firebase";
import { useAuth } from "../context/AuthProvider";
import { TamuTrue,Raja4True} from "../lib/firebase/movexy";
const AdminPage = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [userId, setUserId] = useState("");
    const [userData, setUserData] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const params = useParams();
    const [isButtonPressed, setIsButtonPressed] = useState(false);
    const [isButtonPressed2, setIsButtonPressed2] = useState(false);
    const [isButtonPressed3, setIsButtonPressed3] = useState(false);
    const tag = params.tag;

    const fetchUserData = async (id) => {
        setIsSearching(true);
        const userRef = ref(database, `Users/${id}`);
        const snapshot = await get(userRef);
        const user = snapshot.val();
        
        if (user) {
            setUserData(user);
        } else {
            setUserData(null);
        }
        setIsSearching(false);
    };

    const handleSearch = () => {
        fetchUserData(userId);
    };
    const handleReset = (resetType) => {
       // console.log(`${resetType} button clicked!`);
        // Tambahkan logika reset di sini jika diperlukan
        switch (resetType) {
            case "Reset Arungi":
                console.log("Reset Arundaya All");
               Raja4True("reset");
                break;
            case "Reset Arundaya All":
                console.log("Reset Arundaya All");
                TamuTrue("false_boy_1_ResetAll_1");
                break;
            case "Reset Arundaya":
                console.log("Reset Arundaya"); 
                TamuTrue("false_boy_1_ResetOnly_1");
                break;
        }
    };
    // Fungsi untuk mengganti nilai null atau NaN dengan 0
    const getValueOrDefault = (value) => {
        return value === null || isNaN(value) ? 0 : value;
    };

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
                <BackIcon className="absolute top-4 left-4 z-20" />
                <div className="absolute top-1 bg-gradient-to-t from-primary-darker w-full h-full z-10"></div>
            </div>

            <div id="isi" className="text-primary-orange flex justify-center items-left text-left flex-col gap-2 px-10 py-5 -mt-14 relative z-20">
                <h1 className="text-xl font-bold pb-3">Page Admin</h1>
                <div className="flex space-x-4 mt-4">
                <button 
                    className={`bg-blue-500 text-white px-4 py-2 rounded ${isButtonPressed3 ? 'bg-yellow-500' : ''}`} 
                    onMouseDown={() => setIsButtonPressed3(true)}
                    onMouseUp={() => setIsButtonPressed3(false)}
                    onMouseLeave={() => setIsButtonPressed3(false)}
                    onClick={() => handleReset("Reset Arundaya All")} // Untuk mengembalikan warna jika mouse keluar
                >
                    Reset Arundaya All
                </button>
                <button 
                    className={`bg-blue-500 text-white px-4 py-2 rounded ${isButtonPressed ? 'bg-yellow-500' : ''}`} 
                    onMouseDown={() => setIsButtonPressed(true)}
                    onMouseUp={() => setIsButtonPressed(false)}
                    onMouseLeave={() => setIsButtonPressed(false)}
                    onClick={() => handleReset("Reset Arundaya")} // Untuk mengembalikan warna jika mouse keluar
                >
                    Reset Arundaya
                </button>
                <button 
                    className={`bg-blue-500 text-white px-4 py-2 rounded ${isButtonPressed2 ? 'bg-yellow-500' : ''}`} 
                    onMouseDown={() => setIsButtonPressed2(true)}
                    onMouseUp={() => setIsButtonPressed2(false)}
                    onMouseLeave={() => setIsButtonPressed2(false)}
                    onClick={() => handleReset("Reset Arungi")} // Untuk mengembalikan warna jika mouse keluar
                >
                    Reset Arungi
                </button>
            </div>
                <div className="text-lg border-t-2 font-light border-primary-orange py-5 text-left">
                    Cari data Pengunjung berdasarkan ID:
                </div>
                <input 
                    type="text" 
                    value={userId} 
                    onChange={(e) => setUserId(e.target.value)} 
                    placeholder="Masukkan ID pengguna" 
                    className="border border-primary-orange p-2 rounded"
                />
                <button 
                    onClick={handleSearch} 
                    className="bg-primary-orange text-white px-4 py-2 rounded mt-2"
                >
                    Cari
                </button>

                {isSearching && <div className="mt-4 text-white">Mencari data...</div>}

                {userData && (
                    <div className="mt-4">
                        <h2 className="text-lg font-bold">Hasil Pencarian:</h2>
                        <div className="text-lg">
                            <div>Nama: {userData.Nama}</div>
                            <div>Email: {userData.Email}</div>
                            <div>-Lengkapi Profile Points: {getValueOrDefault(userData.profilePoints)}</div>
                            <div>-Kuis Lutung Kasarung: {getValueOrDefault(userData.kuisLutungPoints)}</div>
                            <div>-Kuis Raja Ampat: {getValueOrDefault(userData.kuisRaja4Points)}</div>
                            <div>-Game Tamu Istana: {getValueOrDefault(userData.gameLutungPoints)}</div>
                            <div>-Game Raja Ampat: {getValueOrDefault(userData.gameRaja4Points)}</div>
                            <div>-Total Point: {getValueOrDefault(userData.profilePoints) + 
                                getValueOrDefault(userData.kuisLutungPoints) + 
                                getValueOrDefault(userData.kuisRaja4Points) + 
                                getValueOrDefault(userData.gameLutungPoints) + 
                                getValueOrDefault(userData.gameRaja4Points)}</div>
                            <div>Last Logged In: {userData.lastLoggedIn}</div> 
                        </div>
                    </div>
                )}
                {userData === null && !isSearching && (
                    <div className="mt-4 text-red-500">Pengguna tidak ditemukan.</div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;

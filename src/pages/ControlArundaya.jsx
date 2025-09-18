import React, { useEffect, useState, useCallback, useRef } from "react";
import { Joystick } from 'react-joystick-component';
import { useAuth } from "../context/AuthProvider";
import { ref, set, get } from "firebase/database";
import { database } from "../lib/firebase/firebase";
import { useNavigate } from 'react-router-dom';
import { getJumlahUserTamu, setJumlahUserTamu } from "../lib/firebase/movexy";
import { setFinishArundaya, getFinishArundaya, getgameLutungPoint, setgameLutungPoint, setSkorLutungPoint } from "../lib/firebase/users";

const ControlArundaya = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showoffline, setShowoffline] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs untuk menghindari re-render yang tidak perlu
  const hasShownPopupRef = useRef(false);
  const intervalRef = useRef(null);
  // Fungsi untuk memeriksa status finish arundaya
  const checkFinishArundaya = useCallback(async () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }
    
    try {
      const hasFinished = await getFinishArundaya(user.id);
      hasShownPopupRef.current = hasFinished;
      setHasShownPopup(hasFinished);
    } catch (error) {
      console.error('Error checking finish arundaya:', error);
    }
  }, [user?.id, navigate]);

  // Fungsi untuk reset skor game
  const resetGameScore = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      await setSkorLutungPoint(user.id, 0);
      await setgameLutungPoint(user.id, 0);
      setScore(0);
    } catch (error) {
      console.error('Error resetting game score:', error);
    }
  }, [user?.id]);
  // Fungsi untuk mendapatkan dan memproses skor dari database
  const getScore = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Cek skor dari gameLutungPoints terlebih dahulu
      const scoreRefG = ref(database, `Users/${user.id}/gameLutungPoints`);
      const snapshotG = await get(scoreRefG);
      const gameLutungPoints = snapshotG.val();
      
      let currentScore = 0;
      
      if (gameLutungPoints === null) {
        // Inisialisasi skor jika belum ada
        await setSkorLutungPoint(user.id, 0);
        await setgameLutungPoint(user.id, 0);
        setScore(0);
        return;
      }
      
      if (gameLutungPoints >= 60) {
        // Skor sudah mencapai maksimal
        currentScore = 60;
        await setSkorLutungPoint(user.id, 60);
        await setgameLutungPoint(user.id, 60);
        
        // Tampilkan popup jika belum pernah ditampilkan
        if (!hasShownPopupRef.current) {
          await setFinishArundaya(user.id, true);
          hasShownPopupRef.current = true;
          setHasShownPopup(true);
          setShowPopup(true);
        }
      } else {
        // Cek skor dari field 'skor' untuk update real-time
        const scoreRef = ref(database, `Users/${user.id}/skor`);
        const snapshot = await get(scoreRef);
        const skorValue = snapshot.val();
        
        if (skorValue !== null) {
          currentScore = Math.min(skorValue, 60); // Batasi maksimal 60
          
          if (skorValue >= 60 && !hasShownPopupRef.current) {
            await setFinishArundaya(user.id, true);
            hasShownPopupRef.current = true;
            setHasShownPopup(true);
            setShowPopup(true);
          }
          
          // Update gameLutungPoints dengan skor terbaru
          await setgameLutungPoint(user.id, currentScore);
        } else {
          currentScore = gameLutungPoints;
        }
      }
      
      setScore(currentScore);
    } catch (error) {
      console.error('Error getting score:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);
  // Effect untuk menjalankan interval getScore
  useEffect(() => {
    if (!user?.id) return;
    
    // Jalankan getScore sekali saat pertama kali
    getScore();
    
    // Set interval untuk update skor setiap 2 detik (lebih efisien)
    intervalRef.current = setInterval(() => {
      getScore();
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user?.id, getScore]);

  // Fungsi untuk update posisi user
  const updateMoveUser = useCallback(async (x, y) => {
    if (!user?.id) return;
    
    try {
      await Promise.all([
        set(ref(database, `Users/${user.id}/moveX`), x),
        set(ref(database, `Users/${user.id}/moveY`), y)
      ]);
    } catch (error) {
      console.error('Error updating user position:', error);
    }
  }, [user?.id]);

  // Fungsi untuk handle offline user
  const handleOfflineUser = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const jumlahTamu = await getJumlahUserTamu();
      await setJumlahUserTamu(jumlahTamu - 1);
      await set(ref(database, `Users/${user.id}/ismove`), "offline");
      setShowoffline(true);
    } catch (error) {
      console.error('Error handling offline user:', error);
    }
  }, [user?.id]);

  // Fungsi untuk update status ismove user
  const updateIsMoveUser = useCallback(async (isOnline) => {
    if (!user?.id) return;
    
    try {
      if (isOnline === "offline") {
        const jumlahTamu = await getJumlahUserTamu();
        if (!showoffline) {
          await setJumlahUserTamu(jumlahTamu - 1);
        }
      }
      await set(ref(database, `Users/${user.id}/ismove`), isOnline);
    } catch (error) {
      console.error('Error updating user move status:', error);
    }
  }, [user?.id, showoffline]);
  // Event handlers untuk joystick
  const handleMove = useCallback((event) => {
    updateMoveUser(event.x, event.y);
  }, [updateMoveUser]);

  const handleStop = useCallback(() => {
    updateMoveUser(0, 0);
  }, [updateMoveUser]);

  // Handler untuk kembali ke home
  const handleHome = useCallback(() => {
    updateMoveUser(0, 0);
    updateIsMoveUser("offline");
    navigate('/arundaya');
  }, [updateMoveUser, updateIsMoveUser, navigate]);

  // Handler untuk melanjutkan permainan
  const handleContinuePlaying = useCallback(() => {
    setShowPopup(false);
    resetGameScore();
  }, [resetGameScore]);

  // Fungsi untuk mengirim pesan chat
  const sendMessage = useCallback(async (message) => {
    if (!user?.id) return;
    
    try {
      await Promise.all([
        set(ref(database, `Users/${user.id}/message`), message),
        set(ref(database, `Users/${user.id}/ismessage`), true)
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [user?.id]);

  // Effect untuk handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleOfflineUser();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleOfflineUser]);

  // Effect untuk inisialisasi komponen
  useEffect(() => {
    checkFinishArundaya();
  }, [checkFinishArundaya]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-between bg-primary-darker p-0">
        {showoffline ? (
            <div className="h-full w-full flex flex-col items-center justify-center bg-primary-darker">
                <h1 className="text-2xl font-bold text-white mb-4 text-center">Anda telah <br></br> meninggalkan permainan</h1>
               <br></br>
                <button 
                    onClick={handleHome} 
                    className="bg-red-500 text-white px-6 py-3 rounded"
                >
                    Keluar
                </button>
            </div>
        ) : (
            <>
                <div className="flex flex-col items-center w-full">
                    <button id="homebutton"
                        onClick={() => handleHome()}
                        className="absolute top-4 left-4 z-30 w-15 h-15 bg-transparent border-none"
                    >
                        <img src="/images/back.png" alt="Back" className="w-full h-full object-contain" />
                    </button>
                    <div className="relative w-full">
                        <img 
                            src="/images/banner4.png" 
                            alt="Banner" 
                            className="w-full h-auto object-cover"
                        />
                    </div>
                    <div className="absolute -top-5 left-0 w-full h-[25%] flex flex-col items-center justify-center text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">Tamu Istana</h1>
                        <h3 className="text-white text-xl mb-2">Skor: </h3>
                        <h3 id="score" className="text-white text-xl">
                          { `${score}/60`}
                        </h3>
                    </div>
                </div>
                <h3 className="text-white text-xl mb-2">Chat: </h3>
                <div className="flex flex-wrap justify-center text-center w-full mb-8 scrollable" style={{ maxHeight: '200px', padding: '0 10px', display: 'block' }}>
                    {[
                        "Hai!",
                        "Kesana yuk!",
                        "Terima kasih!",
                        "Aku dapat!",
                        "Ayo cari bersama!",
                        "Mana lagi ya?",
                        "Selamat datang!",
                        "Semangat terus!",
                        "Aku duluan!",
                        "Sampai jumpa!"
                    ].map((message, index) => (
                        <button 
                            key={index} 
                            className="chat-button bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded m-2 w-1/2 transition-colors duration-200" 
                            onClick={() => sendMessage(message)}
                        >
                            {message}
                        </button>
                    ))}
                </div>

                <div className="flex justify-center w-full mb-8">
                    <Joystick
                        size={200}
                        sticky={false}
                        baseColor="white"
                        stickColor="grey"
                        move={handleMove}
                        stop={handleStop}
                    />
                </div>

                {/* Pop-up untuk konfirmasi */}
                {showPopup && (
                    <div className="fixed inset-0 flex justify-center bg-black bg-opacity-90 z-50">
                        <div className="bg-black p-5 rounded-lg text-center w-full h-full flex flex-col justify-center">
                            <div className="relative w-full">
                                <img 
                                    src="/images/banner4.png" 
                                    alt="Banner" 
                                    className="w-full h-auto object-cover"
                                />
                                <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-white drop-shadow-lg">Selesai!</h2>
                            </div>
                            <p className="text-white mt-6">Anda sudah mendapatkan cukup item.</p>
                            <p className="text-white">Apakah Anda masih ingin bermain lagi?</p>
                            <div className="mt-4 flex flex-col space-y-5">
                                <button onClick={handleContinuePlaying} className="bg-green-500 text-white px-6 py-3 rounded w-full">Ya</button>
                                <button onClick={handleHome} className="bg-red-500 text-white px-6 py-3 rounded w-full">Tidak</button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )}
    </div>
  );
};

export default ControlArundaya;

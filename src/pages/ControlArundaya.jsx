import React, { useEffect, useState, useCallback, useRef } from "react";
import { Joystick } from 'react-joystick-component';
import { useAuth } from "../context/AuthProvider";
import { ref, set, get } from "firebase/database";
import { database } from "../lib/firebase/firebase";
import { useNavigate } from 'react-router-dom';
import { getJumlahUserTamu, setJumlahUserTamu, TamuTrue } from "../lib/firebase/movexy";
import { setFinishArundaya, getFinishArundaya, getgameLutungPoint, setgameLutungPoint, setSkorLutungPoint, setOnlineArundaya } from "../lib/firebase/users";

const ControlArundaya = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showoffline, setShowoffline] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingCharacter, setIsResettingCharacter] = useState(false);
  
  // Refs untuk menghindari re-render yang tidak perlu
  const hasShownPopupRef = useRef(false);
  const intervalRef = useRef(null);
  const offlineTimeoutRef = useRef(null);
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
          
          // Pastikan field 'skor' juga di-update untuk konsistensi
          // Jika skorValue >= 60, pastikan field 'skor' juga 60 (untuk memastikan konsistensi)
          if (skorValue >= 60) {
            await setSkorLutungPoint(user.id, 60);
          }
        } else {
          // Jika skorValue null, gunakan gameLutungPoints dan update field 'skor' juga
          currentScore = gameLutungPoints;
          // Update field 'skor' dengan gameLutungPoints untuk sinkronisasi
          await setSkorLutungPoint(user.id, gameLutungPoints);
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
    
    // Cek status ismove sebelum update posisi
    try {
      const ismoveRef = ref(database, `Users/${user.id}/ismove`);
      const ismoveSnapshot = await get(ismoveRef);
      const ismoveValue = ismoveSnapshot.val();
      
      // Hanya update posisi jika user masih online (bukan offline)
      if (ismoveValue !== "offline" && !showoffline) {
        await Promise.all([
          set(ref(database, `Users/${user.id}/moveX`), x),
          set(ref(database, `Users/${user.id}/moveY`), y)
        ]);
      }
    } catch (error) {
      console.error('Error updating user position:', error);
    }
  }, [user?.id, showoffline]);

  // Fungsi untuk cancel timeout offline
  const cancelOfflineTimeout = useCallback(() => {
    if (offlineTimeoutRef.current) {
      clearTimeout(offlineTimeoutRef.current);
      offlineTimeoutRef.current = null;
    }
  }, []);

  // Fungsi untuk handle offline user
  const handleOfflineUser = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const jumlahTamu = await getJumlahUserTamu();
      await setJumlahUserTamu(jumlahTamu - 1);
      // Reset posisi ke 0 dan set status offline
      await Promise.all([
        set(ref(database, `Users/${user.id}/ismove`), "offline"),
        set(ref(database, `Users/${user.id}/moveX`), 0),
        set(ref(database, `Users/${user.id}/moveY`), 0)
      ]);
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
        // Reset posisi ke 0 saat menjadi offline
        await Promise.all([
          set(ref(database, `Users/${user.id}/ismove`), isOnline),
          set(ref(database, `Users/${user.id}/moveX`), 0),
          set(ref(database, `Users/${user.id}/moveY`), 0)
        ]);
      } else {
        await set(ref(database, `Users/${user.id}/ismove`), isOnline);
      }
    } catch (error) {
      console.error('Error updating user move status:', error);
    }
  }, [user?.id, showoffline]);
  // Event handlers untuk joystick
  const handleMove = useCallback((event) => {
    cancelOfflineTimeout();
    updateMoveUser(event.x, event.y);
  }, [updateMoveUser, cancelOfflineTimeout]);

  const handleStop = useCallback(() => {
    cancelOfflineTimeout();
    updateMoveUser(0, 0);
  }, [updateMoveUser, cancelOfflineTimeout]);

  // Handler untuk kembali ke home
  const handleHome = useCallback(() => {
    cancelOfflineTimeout();
    updateMoveUser(0, 0);
    updateIsMoveUser("offline");
    navigate('/arundaya');
  }, [updateMoveUser, updateIsMoveUser, navigate, cancelOfflineTimeout]);

  // Handler untuk melanjutkan permainan
  const handleContinuePlaying = useCallback(() => {
    setShowPopup(false);
    resetGameScore();
  }, [resetGameScore]);

  const handleResetCharacter = useCallback(async () => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    cancelOfflineTimeout();
    const cachedDataString = sessionStorage.getItem("arundayaDataString");

    if (!cachedDataString) {
      console.warn("Tidak ada data karakter tersimpan untuk direset.");
      return;
    }

    setIsResettingCharacter(true);
    try {
      await TamuTrue(cachedDataString);
      await setOnlineArundaya(user.id, true);
      console.log("Karakter berhasil direset:", cachedDataString);
    } catch (error) {
      console.error("Error resetting character:", error);
    } finally {
      setIsResettingCharacter(false);
    }
  }, [user?.id, navigate, cancelOfflineTimeout]);

  // Fungsi untuk mengirim pesan chat
  const sendMessage = useCallback(async (message) => {
    if (!user?.id) return;
    
    cancelOfflineTimeout();
    
    try {
      await Promise.all([
        set(ref(database, `Users/${user.id}/message`), message),
        set(ref(database, `Users/${user.id}/ismessage`), true)
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [user?.id, cancelOfflineTimeout]);

  // Effect untuk menangani error eksternal (misalnya ekstensi browser)
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      const message = event?.reason?.message;
      if (typeof message === "string" && message.includes("Receiving end does not exist")) {
        console.warn("Chrome runtime messaging is unavailable. Ignoring extension error.", event.reason);
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  }, []);

  // Effect untuk handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Cancel timeout yang sudah ada jika ada
        cancelOfflineTimeout();
        
        // Set timeout 5 detik sebelum eksekusi handleOfflineUser
        offlineTimeoutRef.current = setTimeout(() => {
          handleOfflineUser();
          offlineTimeoutRef.current = null;
        }, 5000);
      } else if (document.visibilityState === 'visible') {
        // Cancel timeout jika user kembali visible
        cancelOfflineTimeout();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Cleanup timeout saat komponen unmount
      cancelOfflineTimeout();
    };
  }, [handleOfflineUser, cancelOfflineTimeout]);

  // Effect untuk inisialisasi komponen
  useEffect(() => {
    checkFinishArundaya();
  }, [checkFinishArundaya]);

  // Effect untuk inisialisasi posisi dan status saat komponen mount
  useEffect(() => {
    const initializeUserStatus = async () => {
      if (!user?.id || showoffline) return;
      
      try {
        // Cek status ismove saat komponen mount
        const ismoveRef = ref(database, `Users/${user.id}/ismove`);
        const ismoveSnapshot = await get(ismoveRef);
        const ismoveValue = ismoveSnapshot.val();
        
        // Jika status offline, pastikan posisi di-reset ke 0
        if (ismoveValue === "offline") {
          await Promise.all([
            set(ref(database, `Users/${user.id}/moveX`), 0),
            set(ref(database, `Users/${user.id}/moveY`), 0)
          ]);
        } else if (ismoveValue === null || ismoveValue === undefined) {
          // Jika status belum ada, inisialisasi sebagai online dan reset posisi
          await Promise.all([
            set(ref(database, `Users/${user.id}/ismove`), "online"),
            set(ref(database, `Users/${user.id}/moveX`), 0),
            set(ref(database, `Users/${user.id}/moveY`), 0)
          ]);
        } else {
          // Jika status online, pastikan posisi tidak null
          const moveXRef = ref(database, `Users/${user.id}/moveX`);
          const moveYRef = ref(database, `Users/${user.id}/moveY`);
          const moveXSnapshot = await get(moveXRef);
          const moveYSnapshot = await get(moveYRef);
          
          if (moveXSnapshot.val() === null || moveYSnapshot.val() === null) {
            await Promise.all([
              set(ref(database, `Users/${user.id}/moveX`), 0),
              set(ref(database, `Users/${user.id}/moveY`), 0)
            ]);
          }
        }
      } catch (error) {
        console.error('Error initializing user status:', error);
      }
    };

    initializeUserStatus();
  }, [user?.id, showoffline]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-primary-darker p-4 pb-8 space-y-4">
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
                <div className="flex flex-col items-center w-full max-w-sm gap-4">
                    <div className="relative w-full">
                        <button
                            id="homebutton"
                            onClick={() => handleHome()}
                            className="absolute -top-3 -left-3 z-30 w-12 h-12 bg-transparent border-none"
                        >
                            <img src="/images/back.png" alt="Back" className="w-full h-full object-contain" />
                        </button>
                        <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
                        <img 
                            src="/images/banner4.png" 
                            alt="Banner" 
                                className="w-full h-32 object-cover"
                        />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/30">
                                <h1 className="text-2xl font-bold text-white mb-1 drop-shadow">Tamu Istana</h1>
                                <p className="text-white text-base drop-shadow">Skor</p>
                                <p id="score" className="text-white text-lg font-semibold drop-shadow">
                                    {`${score}/60`}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center w-full relative z-10">
                        <button
                            onClick={handleResetCharacter}
                            disabled={isResettingCharacter}
                            className="bg-blue-500 disabled:bg-blue-300 text-white px-4 py-2 rounded shadow w-full text-sm font-semibold"
                        >
                            {isResettingCharacter ? "Resetting..." : "Reset Character"}
                        </button>
                    </div>
                </div>
                <div className="w-full max-w-sm">
                    <h3 className="text-white text-lg mb-2">Chat:</h3>
                    <div className="relative w-full rounded-lg bg-black/30 p-2">
                        <div
                            className="max-h-32 overflow-y-auto space-y-3"
                            style={{
                                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
                                maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
                            }}
                        >
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
                                    className="w-full chat-button bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors duration-200 text-sm" 
                                    onClick={() => sendMessage(message)}
                                >
                                    {message}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center w-full mt-4">
                    <Joystick
                        size={160}
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

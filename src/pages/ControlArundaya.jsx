import React, { useEffect, useState } from "react";
import { Joystick } from 'react-joystick-component';
import { useAuth } from "../context/AuthProvider";
import { ref, set, get } from "firebase/database";
import { database } from "../lib/firebase/firebase";
import { useNavigate } from 'react-router-dom';
import {getJumlahUserTamu, setJumlahUserTamu} from "../lib/firebase/movexy";
import { setFinishArundaya,getFinishArundaya, getgameLutungPoint, setgameLutungPoint,setSkorLutungPoint } from "../lib/firebase/users";
const ControlArundaya = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
 // const [hasmaxscore, sethasmaxScore] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showoffline, setShowoffline] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  let hasShownPopupx = false;
  
 // const [begingame, setBegingame] = useState(false);
  let idleTimer; // Timer untuk idle
  const cekfinisharundaya = async () => {
    if (!user?.id) {
        navigate('/login'); // Arahkan ke halaman login jika user.id null
        return; // Keluar dari fungsi
    }else{
     // if(!begingame){
      //  console.log("begingame=" + begingame);
   //   await setSkorLutungPoint(user.id, 0);
      // await setSkorLutungPoint(user.id, 0);
    // setBegingame(true);
 //   }
    }
   
   //hasShownPopupx = await getFinishArundaya(user.id);
   // window.console.log("hasShownPopupx=" + hasShownPopupx);
  };
  const resetGameSkor = async () => {
   // await setSkorLutungPoint(user.id, 0);
  //  await setgameLutungPoint(user.id, 0);
  }
  cekfinisharundaya();
  // Fungsi untuk mendapatkan skor dari database
  const getScore = async () => {
    if (!user?.id) ;
    const scoreRefG = ref(database, `Users/${user.id}/gameLutungPoints`);
    const snapshotG = await get(scoreRefG); // Ambil snapshot dari database
    const valueG = snapshotG.val();
    if(valueG === null){
      setSkorLutungPoint(user.id,0);
      setgameLutungPoint(user.id,0);
      setScore(0);
    }else
      if(valueG >=60){
      setSkorLutungPoint(user.id,60);
      setgameLutungPoint(user.id,60);
      setScore(60); // Batasi skor maksimal menjadi 60
      //  console.log("skor is >=60, hasShownPopupx=" + hasShownPopupx);
   
       //   updateUserPoints(user.id, 60);
       if (!hasShownPopupx) {
          setFinishArundaya(user.id, true);
          setSkorLutungPoint(user.id,60);
          setgameLutungPoint(user.id,60);
          hasShownPopupx = true;
          setShowPopup(true);
        
       }
      }
      else
      {
    
    const scoreRef = ref(database, `Users/${user.id}/skor`);
    const snapshot = await get(scoreRef); // Ambil snapshot dari database
    const value = snapshot.val();
 //   console.log("value=" + value);
  //  setScore(value !== null ? value : 0); // Set skor menjadi 0 jika null
   
    // Tampilkan pop-up jika skor lebih dari 60 dan pop-up belum ditampilkan
    if (value >= 60) {
     // sethasmaxScore(true);
   // console.log("sethasmaxscore="+hasmaxscore);
     setSkorLutungPoint(user.id,60);
     setgameLutungPoint(user.id,60);
      setScore(60); // Batasi skor maksimal menjadi 60
    //  console.log("skor is >=60, hasShownPopupx=" + hasShownPopupx);
      if (!hasShownPopupx) {
     //   updateUserPoints(user.id, 60);
       
        setFinishArundaya(user.id, true);
      
       
        hasShownPopupx = true;
        setShowPopup(true);
      }
    }else if (!hasShownPopupx) {
      
      setScore(value);
    }
  //  console.log("hasShownPopupx="+hasShownPopupx);
    if(!hasShownPopupx){
    //  console.log("tulis game="+value);
      await setgameLutungPoint(user.id, value);
    }
  }
    
  };
hasShownPopupx = false;
  useEffect(() => {
    const interval = setInterval(() => {
    //  if(begingame){
        getScore(); // Panggil fungsi getScore setiap 1 detik
     // }
 
    }, 1000);

    return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
  }, [user]);

  // Fungsi untuk update moveX dan moveY ke Users/{user.id}/moveX dan moveY
  const updatemoveUser = async (x, y) => {
    if (!user?.id) return;
    await set(ref(database, `Users/${user.id}/moveX`), x);
    await set(ref(database, `Users/${user.id}/moveY`), y);
  };
  const OfflineJumlahTamu = async () => {
    if (!user?.id) return;
    const jumlahTamu = await getJumlahUserTamu();
    setJumlahUserTamu(jumlahTamu-1);
    await set(ref(database, `Users/${user.id}/ismove`), "offline");
    setShowoffline(true);

  };
  const updateismoveUser = async (isonline) => {
    if (!user?.id) return;
    if(isonline=="offline"){
    const jumlahTamu = await getJumlahUserTamu();
    if(showoffline==false){
      setJumlahUserTamu(jumlahTamu-1);
    }
    }
    await set(ref(database, `Users/${user.id}/ismove`), isonline);
  };
  const handleMove = (event) => {
    updatemoveUser(event.x, event.y);
//resetIdleTimer(); // Reset timer saat ada gerakan
  };

  const handleStop = () => {
    updatemoveUser(0, 0);
  };

  const handleHome  = () => {
    updatemoveUser(0, 0);
    
    
    updateismoveUser("offline");
    navigate('/arundaya');
  };

  const handleContinuePlaying = () => {
    setShowPopup(false); // Tutup pop-up
    resetGameSkor();
  };

 // const resetIdleTimer = () => {
 //   clearTimeout(idleTimer); // Hapus timer sebelumnya
  //  idleTimer = setTimeout(() => {
    //  handleHome(); // Panggil handleHome setelah 1 menit idle
   // }, 16000); // 160000 ms = 16 detik
  //};

 /* useEffect(() => {
    // Menambahkan event listeners untuk mendeteksi aktivitas pengguna
 window.addEventListener('mousemove', resetIdleTimer);
  //  window.addEventListener('keydown', resetIdleTimer);
  //  window.addEventListener('click', resetIdleTimer);

    // Bersihkan event listeners saat komponen unmount
    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
      clearTimeout(idleTimer); // Hapus timer saat unmount
    };
  }, []);
  */

  const sendMessage = async (message) => {
    if (!user?.id) return;
    
    // Kirim pesan ke Firebase
    await set(ref(database, `Users/${user.id}/message`), message);
    
    // Set ismessage menjadi true
    await set(ref(database, `Users/${user.id}/ismessage`), true);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
           OfflineJumlahTamu(); // Panggil fungsi ketika tab tidak aktif
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange); // Bersihkan event listener saat komponen unmount
    };
  }, []);

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
                        <h3 id="score" className="text-white text-xl">{score}/60</h3>
                    </div>
                </div>
                <h3 className="text-white text-xl mb-2">Chat: </h3>
                {/* Div untuk tombol chat custom dummy  <div className="text-white text-xl">Chat:</div>*/}
                <div className="flex flex-wrap justify-center text-center w-full mb-8 scrollable" style={{ maxHeight: '200px', padding: '0 10px', display: 'block' }}> {/* Menambahkan kelas scrollable */}
                    {/* Contoh tombol chat dummy */}
                    
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
                            className="chat-button bg-orange-500 text-white px-4 py-2 rounded m-2 w-1/2" 
                            onClick={() => sendMessage(message)} // Panggil sendMessage saat tombol diklik
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

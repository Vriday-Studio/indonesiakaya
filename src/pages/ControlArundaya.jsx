import React, { useEffect, useState } from "react";
import { Joystick } from 'react-joystick-component';
import { useAuth } from "../context/AuthProvider";
import { ref, set, get } from "firebase/database";
import { database } from "../lib/firebase/firebase";
import { useNavigate } from 'react-router-dom';

const ControlArundaya = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [score, setScore] = useState(0);

  // Fungsi untuk mendapatkan skor dari database
  const getScore = async () => {
    if (!user?.id) return;
    const scoreRef = ref(database, `Users/${user.id}/skor`);
    const snapshot = await get(scoreRef); // Ambil snapshot dari database
    const value = snapshot.val();
    setScore(value !== null ? value : "0"); // Set skor menjadi 0 jika null
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getScore(); // Panggil fungsi getScore setiap 1 detik
    }, 1000);

    return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
  }, [user]);

  // Fungsi untuk update moveX dan moveY ke Users/{user.id}/moveX dan moveY
  const updatemoveUser = async (x, y) => {
    if (!user?.id) return;
    await set(ref(database, `Users/${user.id}/moveX`), x);
    await set(ref(database, `Users/${user.id}/moveY`), y);
   
  };

  const handleMove = (event) => {
    updatemoveUser(event.x, event.y);
  };

  const handleStop = () => {
    updatemoveUser(0, 0);
  };
  const handleHome = () => {
    navigate('/arundaya');
};
  return (
    <div className="h-screen w-full flex flex-col items-center justify-between bg-primary-darker p-8">
     <button id="homebutton"
               onClick={() => handleHome()}
               className="absolute top-4 left-4 z-30 w-15 h-15 bg-transparent border-none" // Tambahkan border-none
           >
                <img src="/images/back.png" alt="Back" className="w-full h-full object-contain" />
           </button>
      <div className="flex flex-col items-center">
        <h1 className="text-white text-3xl mb-4 text-center">Cari Benda</h1>
        <p className="text-white mb-8 text-center">Kumpulkan item tersembunyi untuk mendapatkan skor!</p>
        <h1 className="text-white text-2xl mb-8 text-center">Skor: </h1>
        <h1 id="score" className="text-yellow-500 text-6xl mb-2 text-center">{score}/60</h1>
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
    </div>
  );
};

export default ControlArundaya;

// src/pages/arundaya.jsx
import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";
import { initializeApp } from "firebase/app";
import {firebaseConfig} from "../lib/firebase/firebase";
import { getContentSettingByTag } from "../lib/firebase/contentSetting";
import { useAuth } from "../context/AuthProvider";
import { getSelectedUserPoints, updateUserPoints,getSelectedUserFinishArundaya,setFinishArundaya } from "../lib/firebase/users";
import { TamuTrue} from "../lib/firebase/movexy";
const Arundaya = () => {
   const { user, logoutUser } = useAuth();
   const navigate = useNavigate();
   const [isLoading, setIsLoading] = React.useState(true);
   const [selectedContent, setSelectedContent] = React.useState(null);
   const [countFromTotal, setCountFromTotal] = React.useState("");
   const [userPoint, setUserPoint] = React.useState("");
   const [finishUnparse, setFinishUnparse] = React.useState("");
   const [canClaim, setCanClaim] = React.useState(false);
   const [showStory, setShowStory] = React.useState(false);
   const [endChar, setEndChar] = React.useState(false);
   const [selectedCharacter, setSelectedCharacter] = React.useState("images/arun/skin1/boy.png"); // State untuk karakter terpilih
   const [selectedOutfit, setSelectedOutfit] = React.useState(0); // State untuk menyimpan indeks baju terpilih
   const outfits = {
       "images/arun/skin1/boy.png": [
           "images/arun/skin1/boy.png",
           "images/arun/skin2/boy.png",
           "images/arun/skin3/boy.png",
           "images/arun/skin4/boy.png",
           "images/arun/skin5/boy.png",
       ],
       "images/arun/skin1/girl.png": [
           "images/arun/skin1/girl.png",
           "images/arun/skin2/girl.png",
           "images/arun/skin3/girl.png",
           "images/arun/skin4/girl.png",
           "images/arun/skin5/girl.png",
       ],
       "images/arun/skin1/man.png": [
           "images/arun/skin1/man.png",
           "images/arun/skin2/man.png",
           "images/arun/skin3/man.png",
           "images/arun/skin4/man.png",
           "images/arun/skin5/man.png",
       ],
       "images/arun/skin1/woman.png": [
           "images/arun/skin1/woman.png",
           "images/arun/skin2/woman.png",
           "images/arun/skin3/woman.png",
           "images/arun/skin4/woman.png",
           "images/arun/skin5/woman.png",
       ],
       "images/arun/skin1/kakek.png": [
           "images/arun/skin1/kakek.png",
           "images/arun/skin2/kakek.png",
           "images/arun/skin3/kakek.png",
           "images/arun/skin4/kakek.png",
           "images/arun/skin5/kakek.png",
       ],
       "images/arun/skin1/nenek.png": [
           "images/arun/skin1/nenek.png",
           "images/arun/skin2/nenek.png",
           "images/arun/skin3/nenek.png",
           "images/arun/skin4/nenek.png",
           "images/arun/skin5/nenek.png",
       ],
       "images/arun/skin1/petani.png": [
           "images/arun/skin1/petani.png",
           "images/arun/skin2/petani.png",
           "images/arun/skin3/petani.png",
           "images/arun/skin4/petani.png",
           "images/arun/skin5/petani.png",
       ],
       "images/arun/skin1/fruitseller.png": [
           "images/arun/skin1/fruitseller.png",
           "images/arun/skin2/fruitseller.png",
           "images/arun/skin3/fruitseller.png",
           "images/arun/skin4/fruitseller.png",
           "images/arun/skin5/fruitseller.png",
       ],
   };
   const characters = [
       "images/arun/skin1/boy.png",
       "images/arun/skin1/girl.png",
       "images/arun/skin1/man.png",
       "images/arun/skin1/woman.png",
       "images/arun/skin1/kakek.png",
       "images/arun/skin1/nenek.png",
       "images/arun/skin1/petani.png",
       "images/arun/skin1/fruitseller.png",
   ];
   initializeApp(firebaseConfig);
   const hasCompletedTutorial = sessionStorage.getItem("hasCompletedTutorial");
   const redirectUserUrl = hasCompletedTutorial ? "/start" : "/guide";
   
   const getUserPoint = async () => {
       const point = await getSelectedUserPoints(user.id);
       setUserPoint(point);
   };
   
   const getUserFinished = async () => {
    const pointx = await getSelectedUserFinishGame(user.id);
    setFinishUnparse(pointx);
};
   const handleCharacterChange = (direction) => {
       const currentIndex = characters.indexOf(selectedCharacter);
       let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

       if (newIndex < 0) newIndex = characters.length - 1; // Loop ke belakang
       if (newIndex >= characters.length) newIndex = 0; // Loop ke depan

       setSelectedCharacter(characters[newIndex]); // Update karakter terpilih
   };

   const handleOutfitChange = (direction) => {
       const currentOutfitIndex = selectedOutfit;
       let newOutfitIndex = direction === "next" ? currentOutfitIndex + 1 : currentOutfitIndex - 1;

       if (newOutfitIndex < 0) newOutfitIndex = outfits[selectedCharacter].length - 1; // Loop ke belakang
       if (newOutfitIndex >= outfits[selectedCharacter].length) newOutfitIndex = 0; // Loop ke depan

       setSelectedOutfit(newOutfitIndex); // Update baju terpilih
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
       // Mengubah judul tab browser
       document.title = "Arundaya";
       setIsLoading(false);
   }, []);

   useEffect(() => {
       // Cek jika user adalah null
       if (user === null) {
           navigate('/login'); // Arahkan ke halaman login
       }
   }, [user, navigate]); // Tambahkan user dan navigate sebagai dependensi

   const handleStartClick = () => {
       setShowStory(true);
       window.console.log("kliked "+ showStory);
   };
   const handleEndChar = async () => {
       let characterName =  getCharacterFbName(selectedCharacter).toLowerCase(); // Ambil nama karakter dalam huruf kecil
       
       // Cek apakah characterName mengandung spasi
     

       const outfitIndex = selectedOutfit + 1; // Indeks outfit dimulai dari 0, jadi tambahkan 1
       let userName="guest";
       // Cek apakah user.name ada, jika tidak, buat nama guest dengan angka acak
      if(user!=null) {
        userName = user.Nama;
      }
      
      if (userName.includes(" ")) {
        userName = userName.split(" ")[0]; // Ambil bagian pertama sebelum spasi
       }
       const dataString = `true_${characterName}_${outfitIndex}_${userName}_${user.id}`; // Format string
      
       // Kirim data ke Firebase
       try {
           TamuTrue(dataString);
           console.log("Data berhasil dikirim:", dataString);
       } catch (error) {
           console.error("Error mengirim data ke Firebase:", error);
       }

      // setEndChar(true); 
if(user!=null) {
   
    const userId = user.id;
    const isPernah= await getSelectedUserFinishArundaya(userId);  
    if(!isPernah){
        window.console.log("!ispernah");
        updateUserPoints(userId, 40);
          
       setFinishArundaya(userId,true);
    }
       
    }
    navigate('/control-arundaya');
   };
   const handleContinueToGame = () => {
       navigate('/joystix');
   };
   const handleHome = () => {
       navigate('/story-detail/lutung');
   };
   const getCharacterName = (character) => {
    const baseNames = {
        "images/arun/skin1/boy.png": "Anak Laki-Laki",
        "images/arun/skin1/girl.png": "Anak Perempuan",
        "images/arun/skin1/man.png": "Pria Dewasa",
        "images/arun/skin1/woman.png": "Wanita Dewasa",
        "images/arun/skin1/kakek.png": "Kakek",
        "images/arun/skin1/nenek.png": "Nenek",
        "images/arun/skin1/petani.png": "Petani",
        "images/arun/skin1/fruitseller.png": "Penjual Buah",
    };

    // Cek apakah karakter ada di baseNames
    if (baseNames[character]) {
        return baseNames[character];
    }

    // Cek untuk skin 2 sampai skin 5
    const characterBase = character.replace(/skin[2-5]/, 'skin1');
    return baseNames[characterBase] || "Unknown";
};
const getCharacterFbName = (character) => {
    const baseNames = {
        "images/arun/skin1/boy.png": "Boy",
        "images/arun/skin1/girl.png": "Girl",
        "images/arun/skin1/man.png": "Man",
        "images/arun/skin1/woman.png": "Woman",
        "images/arun/skin1/kakek.png": "Kakek",
        "images/arun/skin1/nenek.png": "Nenek",
        "images/arun/skin1/petani.png": "Petani",
        "images/arun/skin1/fruitseller.png": "Fruitseller",
    };

    // Cek apakah karakter ada di baseNames
    if (baseNames[character]) {
        return baseNames[character];
    }

    // Cek untuk skin 2 sampai skin 5
    const characterBase = character.replace(/skin[2-5]/, 'skin1');
    return baseNames[characterBase] || "Unknown";
};
const getbajuName = (outfit) => {
    const characterName = "Warna"; // Ambil nama karakter dan ubah menjadi huruf kecil
    return `${characterName}-${outfit + 1}`; // Mengembalikan nama karakter dan indeks outfit (indeks dimulai dari 0)
};
   if (isLoading) {
       return <LoadingScreen />;
   }
   if(endChar){
    return(
        <div className="h-screen w-full flex flex-col items-center bg-primary-darker">
        <button id="homebutton"
               onClick={() => handleHome()}
               className="absolute top-4 left-4 z-30 w-15 h-15 bg-transparent border-none" // Tambahkan border-none
           >
                <img src="/images/back.png" alt="Back" className="w-full h-full object-contain" />
           </button>
   <img 
       src="/images/banner4.png" 
       alt="Banner" 
       className="w-full max-h-[30%] object-contain fixed top-0 relative"
   />
   <div className="absolute -top-5 left-0 w-full h-[25%] flex flex-col items-center justify-center">
       <h1 className="text-3xl font-bold text-white mb-2">Tamu Istana</h1>
       <p className="text-xl text-white">Terima Kasih</p>
   </div>
  
   <div id="gambarintro" className="flex flex-col items-center h-full">
       <img 
           src="/images/introarun.png" 
           alt="Arrow Glow" 
           className="w-full h-[30vh] object-cover mb-4" // Set height menjadi 30vh dan gunakan object-cover
       />
       <p id="endmain" className="text-base text-white mb-8 justify-center mr-8 ml-8">
       Terima kasih telah menjadi bagian dari hari bahagia Ratu Purbasari dan Raja Guru Minda.<br></br><br></br>

Jejakmu kini ada di Arundaya—negeri yang tumbuh dari kebaikan, cinta, dan harapan.<br></br><br></br>

</p>

    

       <button id="okhome"
           onClick={handleHome}
           className="bg-primary-orange text-white text-base font-bold rounded-xl px-8 py-3  hover:bg-primary-orange/90 transition-colors"
       >
           OK! Mengerti
       </button>
   </div>
</div>
    );
   }
   if (showStory) {
       return (
           <div id="showUi" className="h-screen w-full flex flex-col items-center bg-primary-darker">
               <button id="homebutton"
                   onClick={() => handleHome()}
                   className="absolute top-4 left-4 z-30 w-15 h-15 bg-transparent border-none"
               >
                   <img src="/images/back.png" alt="Back" className="w-full h-full object-contain" />
               </button>
               <img 
                   src="/images/banner4.png" 
                   alt="Banner" 
                   className="w-full max-h-[30%] object-contain fixed top-0 relative"
               />
               <div className="absolute -top-5 left-0 w-full h-[25%] flex flex-col items-center justify-center">
                   <h1 className="text-3xl font-bold text-white mb-2">Tamu Istana</h1>
                   <p className="text-xl text-white">Pilih Karakter kamu</p>
               </div>

               <div id="gambarcharui" className="flex flex-col items-center h-full mt-8">
                       <img id="gambarchar"
                           src={outfits[selectedCharacter][selectedOutfit]} 
                           alt="char" 
                           className="w-full h-[30vh] object-contain mb-4"
                       />
                                                   <div id="charselectui" className="flex justify-between w-full px-8 items-center"> 
                           <button onClick={() => handleCharacterChange("prev")} className="bg-primary-orange text-white px-4 py-2 rounded">
                               &lt; {/* Tombol kiri */}
                           </button>
                               
                               {/* Label nama karakter */}
                               <span className="bg-orange-500 text-white px-6 py-2 rounded mx-2 text-base w-32 text-center"> {/* Lebar tetap */}
                                   {getCharacterName(selectedCharacter)} {/* Panggil fungsi untuk mendapatkan nama karakter */}
                               </span>

                               <button onClick={() => handleCharacterChange("next")} className="bg-primary-orange text-white px-4 py-2 rounded">
                                   &gt; {/* Tombol kanan */}
                               </button>
                           </div>

                           <div id="bajuselectui" className="flex justify-between w-full px-8 items-center mt-4">
                               <button onClick={() => handleOutfitChange("prev")} className="bg-primary-orange text-white px-4 py-2 rounded">
                                   &lt; {/* Tombol kiri */}
                               </button>
                               
                               {/* Label nama baju dengan warna berdasarkan indeks */}
                               <span className={`px-6 py-2 rounded mx-2 text-lg w-32 text-white text-center ${selectedOutfit === 0 ? 'bg-orange-500' : 
                                   selectedOutfit === 1 ? 'bg-red-500' : 
                                   selectedOutfit === 2 ? 'bg-purple-500' : 
                                   selectedOutfit === 3 ? 'bg-green-500' : 
                                   selectedOutfit === 4 ? 'bg-blue-500' : 'bg-gray-500'}`}>
                                   {getbajuName(selectedOutfit)} {/* Panggil fungsi untuk mendapatkan nama baju */}
                               </span>

                               <button onClick={() => handleOutfitChange("next")} className="bg-primary-orange text-white px-4 py-2 rounded">
                                   &gt; {/* Tombol kanan */}
                               </button>
                           </div>
                           <div id="okcharui" className="flex justify-center w-full px-8 items-center mt-4"> {/* Tambahkan justify-center untuk memusatkan tombol */}
                               <button id="ok"
                                   onClick={handleEndChar}
                                   className="bg-primary-orange text-white text-base font-bold rounded-xl px-8 py-3 hover:bg-primary-orange/90 transition-colors"
                               >
                                   OK
                               </button>
                           </div>
                       </div>
               </div>
           );
       }
   
       return (
           <div className="h-screen w-full flex flex-col items-center bg-primary-darker">
                    <button id="homebutton"
                           onClick={() => handleHome()}
                           className="absolute top-4 left-4 z-30 w-15 h-15 bg-transparent border-none" // Tambahkan border-none
                       >
                            <img src="/images/back.png" alt="Back" className="w-full h-full object-contain" />
                       </button>
               <img 
                   src="/images/banner4.png" 
                   alt="Banner" 
                   className="w-full max-h-[30%] object-contain fixed top-0 relative"
               />
               <div className="absolute -top-5 left-0 w-full h-[25%] flex flex-col items-center justify-center">
                   <h1 className="text-3xl font-bold text-white mb-2">Tamu Istana</h1>
                   <p className="text-xl text-white">Cara Main</p>
               </div>
              
               <div id="gambarintro" className="flex flex-col items-center h-full">
                   <img 
                       src="/images/introarundaya.png" 
                       alt="Arrow Glow" 
                       className="w-full h-[30vh] object-cover mb-4" // Set height menjadi 30vh dan gunakan object-cover
                   />
                   <p id="caramain" className="text-sm text-white mb-8 justify-center mr-8 ml-8">
                 
Pilih satu warga untuk mewakilimu.<br></br><br></br>

Kamu diundang ke pernikahan Ratu Purbasari dan Raja Guru Minda!<br></br><br></br>

Jelajahi istana dan jadilah bagian dari kisah mereka.<br></br><br></br>
Mainkan juga permainan mencari harta karun, temukan benda-benda tersembunyi di sekitar istana untuk mendapatkan poin tambahan!
   </p>
   
                
   
                   <button id="ok"
                       onClick={handleStartClick}
                       className="bg-primary-orange text-white text-base font-bold rounded-xl px-8 py-3  hover:bg-primary-orange/90 transition-colors"
                   >
                       OK! Mengerti
                   </button>
               </div>
           </div>
       );
};



export default Arundaya;
import React, { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getContentSettingByTag } from "../lib/firebase/contentSetting";
import BackIcon from "../components/BackIcon";
import { sanitizeDOM } from "../lib/sanitizeDOM";
import LoadingScreen from "../components/LoadingScreen";
import { Joystick } from 'react-joystick-component';
import { updatemove, getIsEvent, getNamaEvent,getKoleksi,KoleksitoFalse, updatepersecond ,getonlineGender
    ,onlineGender, KoleksiHitung, getJumlahkol,getLastItem,getGrupItem} from "../lib/firebase/movexy";
import { chat } from "../lib/firebase/movexy";
import { getSelectedUserPoints, updateUserPoints, setgameRaja4Point ,getSelectedUserFinishArungi,setFinishArungi} from "../lib/firebase/users";
import { useAuth } from "../context/AuthProvider";
const Joystix = () => {
    const { user, logoutUser } = useAuth();
    const [isLoading, setIsLoading] = React.useState(true);
    const [selectedContent, setSelectedContent] = React.useState(null);
    const [readygame, setReadyGame] = React.useState(null);
    const [showIntroStory, setShowIntroStory] = React.useState(false);
    const [gender, setGender] = React.useState(null);
    const [showChatGrid, setShowChatGrid] = React.useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [dialogText, setDialogText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isEventActive, setIsEventActive] = useState(false);
    const [currentEvent, setCurrentEvent] = useState("");
    const [isInactive, setIsInactive] = useState(false);
    const [Koleksi, setCurrentKoleksi] = useState("");
    const [dialogImage, setDialogImage] = useState("/images/Totem.png");
    const [collectionCount, setCollectionCount] = useState(0);
    const [showOkButton, setShowOkButton] = useState(false);
    const [showQuestInfo, setShowQuestInfo] = useState(false);
    const [lastItemGet, setLastItemGet] = useState("");
    const [grupItemGet, setGrupItem] = useState(1);
    const [showStory, setShowStory] = React.useState(false);
    const [isCompleteCollection, setIsCompleteCollection] = useState(false);

    const [isMaleOnline, setIsMaleOnline] = useState("false");
    const [isFemaleOnline, setIsFemaleOnline] = useState("false");
    const [lastItemArray,setLastArray] = useState(null);
    const params = useParams();
    const tag = params.tag;
    const chatTemplates = [
        "Halo", "Apa kabar?", "Mana itemnya ya?",
        "Permisi", "Ayo kesini", "Sampai jumpa",
        "Terima kasih", "Ayo Berpencar", "Lihat dengan teliti"
    ];
    const navigate = useNavigate();
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
   
    

    const handleChatTemplate = async (message) => {
        
        await chat(message, gender);
    };

    useEffect(() => {
        const fetchContent = async () => {
            const contents = await getContentSettingByTag("content");
            const contentByTag = contents.filter((item) => item.tag === tag);
            setSelectedContent(contentByTag[0]);
            setIsLoading(false);
        };
        fetchContent();
    }, [tag]);

   
        const checkOnlineStatus = async () => {
            const maleOnline = await getonlineGender("male");
            const femaleOnline = await getonlineGender("female");
          //  window.console.log("maleOnline="+maleOnline);
          //  window.console.log("femaleOnline="+femaleOnline);
            setIsMaleOnline(maleOnline);
            setIsFemaleOnline(femaleOnline);
        };

        // Check initially
        checkOnlineStatus();

        
     

    useEffect(() => {
        const interval = setInterval(async () => {
            await handleupdatepersecond();
        }, 200);

        return () => clearInterval(interval);
    }, [gender]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleBackChoice();
                setIsInactive(true);
               // window.console.log("document.hidden"+isInactive);
            } 
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);
    const handleStop = async (event) => {
        await updatemove(0, 0,gender);
    }
    const handleupdatepersecond = async () => {
        if (!gender) return;
        
        await updatepersecond(gender);
       
        setCurrentEvent(getNamaEvent());
        KoleksitoFalse(gender); 
        KoleksiHitung(gender);  
        setCollectionCount(getJumlahkol());
        setLastItemGet(getLastItem());
        
       // window.console.log('itemlastItemGet='+lastItemGet);
        setGrupItem(getGrupItem());
       // window.console.log('grupItemGet='+ grupItemGet); 
     //   const lastItemArrayx = lastItemGet.split("|");
     //   setLastArray(lastItemArrayx);
       // questItemsToRender[0].collected=true;
     //  window.console.log('itemke1='+ lastItemArray);
     
      //  renderQuestItems();
    }
    const handleMove = async (event) => {
      
        await updatemove(event.x, event.y, gender);
    }

    const typeWriter = (text) => {
        setIsTyping(true);
        let i = 0;
        setDialogText("");
        const speed =60;

        const typing = setInterval(() => {
            if (i < text.length) {
                setDialogText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(typing);
                setIsTyping(false);
            }
        }, speed);
    };

    const handleInteract = async (event) => {
       // console.log("neam even="+getNamaEvent());
        if(!isTyping){
            switch (getNamaEvent()) {
                case "Cendrawasih":
                 //   console.log("neam even egg");
                    npcDialog.text = " "+"This is Cendrawasih";
                    setDialogImage("/images/Cendrawasih.png");
                    break;
                case "Papeda":
                    npcDialog.text = " "+"This is Papeda";
                    setDialogImage("/images/Papeda.png");
                    break;
                case "Suling":
                    npcDialog.text = " "+"ini Suling";
                    setDialogImage("/images/Suling.png");
                    break;
               case "Parang":
                npcDialog.text = " "+"ini Parang";
                   setDialogImage("/images/Parang.png");
                    setShowOkButton(true);
                    break;
                case "Wor Wanita":
                        npcDialog.text = " "+"ini Wor Wanita";
                        setDialogImage("/images/Wor Wanita.png");
                        setShowOkButton(true);
                        break;
                case "Lukisan Kulit kayu":
                            npcDialog.text = " "+"Ini Lukisan Kulit kayu";
                            setDialogImage("/images/Lukisan Kulit kayu.png");
                            setShowOkButton(true);
                            break;
                default:
                    npcDialog.text = " "+"Nothing here";
                    setDialogImage("/images/Shield.png");
                    break;
            }
            setShowDialog(true);
            setDialogText(npcDialog.text);
        }  
    };

    const handleGenderSelect = (selectedGender) => {
        setGender(selectedGender);
        setShowIntroStory(true);
        setIsCompleteCollection(false);

    };
    const handleReadyGame= () => {
        updatemove(0.0001, 0, gender);
        setIsCompleteCollection(false);
        setReadyGame(true);
        onlineGender(gender, true);
        setIsEventActive(true);
        updatemove(0, 0, gender);
    };

    const npcDialog = {
        text: "",
        image: "/images/Totem.png"
    };

    const handleBackChoice = async() => {
        await onlineGender(gender,false);
    };

    const handleLogout = async() => {
        console.log("log klik");    
       await onlineGender(gender,false);
       
            navigate('/story-detail/empat-raja');
    };

    const questItems1 = [
        { name: "Papeda", collected: false },
        { name: "Parang", collected: false },
        { name: "Suling", collected: false },
        { name: "Cendrawasih", collected: false },
        { name: "Lukisan Kulit Kayu", collected: false },
        { name: "Wor Wanita", collected: false }, 
        { name: "Telur Emas", collected: false }
    ];
    const questItems2 = [
        { name: "Udang Selingkuh", collected: false },
        { name: "Tenun", collected: false },
        { name: "Kuskus", collected: false },
        { name: "Maleo", collected: false },
        { name: "Batik Kamoro", collected: false },
        { name: "Pikon", collected: false }, 
        { name: "Telur Emas", collected: false }
    ];
    const questItems3 = [
        { name: "Kole Kole", collected: false },
        { name: "Burung Kofiau", collected: false },
        { name: "Honai", collected: false },
        { name: "Arborek", collected: false },
        { name: "Wor Pria", collected: false },
        { name: "Mantel Emas", collected: false },
        { name: "Telur Emas", collected: false }
    ];
    const handleBackmenu = () => {

        window.console.log("backmenu");
        navigate('/Home2');
    };
    const renderQuestItems = () => {
        let questItemsToRender = [];
        
        switch (grupItemGet) {
            case 1:
                questItemsToRender = questItems1;
                break;
            case 2:
                questItemsToRender = questItems2;
                break;
            case 3:
                questItemsToRender = questItems3;
                break;
            default:
                questItemsToRender = [];
                break;
        }

        const lastItemArrayx = lastItemGet.split("|");
        
        // Periksa setiap item dalam questItemsToRender
        questItemsToRender.forEach((item, index) => {
            // Periksa apakah nama item ada dalam lastItemArrayx
            if (lastItemArrayx.includes(item.name)) {
                questItemsToRender[index].collected = true;
            }
        });

        return (
            <ul>
                {questItemsToRender.map((item, index) => (
                    <li key={index} className="flex items-center">
                        <span className="mr-2">{item.collected ? "✔️" : "❌"}</span>
                        {item.name}
                    </li>
                ))}
            </ul>
        );
    };

   

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }

    if (showIntroStory) {
        return (
            <div className="min-h-screen bg-primary-darker">
                <div id="bannertop" className="fixed top-0 left-0 w-full z-10">
                    <div className="relative">
                        <button 
                            onClick={() => setShowIntroStory(false)}
                            className="absolute top-4 left-4 z-20 w-10 h-10"
                        >
                            <img 
                                src="/images/back.png" 
                                alt="Back" 
                                className="w-full h-full object-contain"
                            />
                        </button>
                        <img 
                            src="/images/banner4.png" 
                            alt="Banner" 
                            className="w-full h-[25vh] object-cover"
                        />
                        <div id="isibaner" className="absolute inset-0 flex flex-col items-center justify-center">
                            <h1 className="text-3xl font-bold text-white mb-2">Jejak Telur Ajaib</h1>
                            <p className="text-xl text-white">Petualangan Dimulai</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col items-center pt-[30vh] px-6">
                    <div className="w-full max-w-md mb-6">
                        <img 
                            src="/images/arungiIntro.png" 
                            alt="Story" 
                            className="w-full object-contain rounded-lg"
                        />
                    </div>
                    
                    <div className="bg-primary-darker/80 text-white p-6 rounded-lg max-w-md text-center">
                        <p className="text-lg mb-8">
                            Di sebuah desa yang damai, hiduplah sepasang suami istri yang sangat menginginkan seorang anak. 
                            Setiap hari mereka berdoa dengan tulus, berharap keajaiban datang ke dalam hidup mereka.
                            Suatu pagi, mereka memutuskan pergi ke hutan untuk mencari kayu bakar... 
                            <br/><br/>
                            <b>Tanpa mereka tahu, hari itu akan mengubah segalanya.</b>
                        </p>
                        
                        <button 
                            onClick={() => {
                                setShowIntroStory(false);
                                handleReadyGame();
                            }}
                            className="bg-primary-orange text-white text-xl font-bold rounded-xl px-10 py-4 hover:bg-primary-orange/90 transition-colors w-full"
                        >
                            Mulai
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (readygame === null) {
        if ((isMaleOnline==="true") && (isFemaleOnline==="true" )) {
            return (
                <div className="h-screen w-full flex flex-col items-center justify-center bg-primary-darker text-white">
                    <div className="text-2xl mb-8 text-center px-4">
                        Maaf, Permainan ini sedang penuh, silahkan coba beberapa saat lagi
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/Home2')}
                            className="bg-primary-orange text-white px-8 py-3 rounded-xl text-lg font-bold hover:bg-primary-orange/90 transition-colors"
                        >
                            Keluar
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-primary-orange text-white px-8 py-3 rounded-xl text-lg font-bold hover:bg-primary-orange/90 transition-colors"
                        >
                            Coba lagi
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div id="menugender" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <div id="bannertop" className="fixed top-0 left-0 w-full z-10">
                    <div className="relative">
                        <button 
                            onClick={() => handleBackmenu()}
                            className="absolute top-4 left-4 z-20 w-10 h-10"
                        >
                            <img 
                                src="/images/back.png" 
                                alt="Back" 
                                className="w-full h-full object-contain"
                            />
                        </button>
                        <img 
                            src="/images/banner4.png" 
                            alt="Banner" 
                            className="w-full h-[25vh] object-cover"
                        />
                        <div id="isibaner" className="absolute inset-0 flex flex-col items-center justify-center">
                            <h1 className="text-3xl font-bold text-white mb-2">Jejak Telur Ajaib</h1>
                            <p className="text-xl text-white">Pilih Karakter Kamu</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 mt-[30vh]">
                    <div className="flex flex-col items-center">
                        <img 
                            src="/images/rajax.png" 
                            alt="Raja" 
                            className={`w-64 h-64 object-contain mb-4 ${isMaleOnline ? 'opacity-50' : ''}`}
                        />
                        <button 
                            className={`bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full transform transition-all duration-200 active:scale-95 w-40 text-2xl shadow-lg ${isMaleOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => handleGenderSelect('male')}
                            disabled={isMaleOnline === "true"}
                        >
                            Raja
                        </button>
                    </div>

                    <div className="flex flex-col items-center">
                        <img 
                            src="/images/ratux.png" 
                            alt="Ratu" 
                            className={`w-64 h-64 object-contain mb-4 ${isFemaleOnline ? 'opacity-50' : ''}`}
                        />
                        <button 
                            className={`bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full transform transition-all duration-200 active:scale-95 w-40 text-2xl shadow-lg ${isFemaleOnline ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => handleGenderSelect('female')}
                            disabled={isFemaleOnline === "true"}
                        >
                            Ratu
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    //const [iscompleted, setCompletefin] = React.useState(false);
    const handleFinishSkor = async () => {
       

       // if (!hasEarnedPoints) {
            const userId = user.id; // Ganti dengan ID pengguna yang sesuai
            let isDapatPoin=false;
           
                const isPernah= await getSelectedUserFinishArungi(userId);  
                window.console.log("isPernah="+ isPernah);
                //isDapatPoin=isPernah;
                setFinishArungi(userId,true);
         
                setgameRaja4Point(userId, 60); // Panggil fungsi untuk memperbarui poin
       
    };
    if (collectionCount >= 7 && !isCompleteCollection){
       
        handleFinishSkor();
        updatemove(0, 0, gender);
        setIsCompleteCollection(true);
   
    }
    if (isCompleteCollection){
        //setIsCompleteCollection(true);
        
      
        
        return (
            <div id="selamatx" className="flex flex-col items-center h-screen bg-primary-darker text-white">
                <div id="bannertop" className="fixed top-0 left-0 w-full z-10">
                    <div className="relative">
                        <button 
                            onClick={() => handleBackmenu()}
                            className="absolute top-4 left-4 z-20 w-10 h-10"
                        >
                            <img 
                                src="/images/back.png" 
                                alt="Back" 
                                className="w-full h-full object-contain"
                            />
                        </button>
                        <img 
                            src="/images/banner4.png" 
                            alt="Banner" 
                            className="w-full h-[25vh] object-cover"
                        />
                        <div id="isibaner" className="absolute inset-0 flex flex-col items-center justify-center">
                            <h1 className="text-3xl font-bold text-white mb-2">Jejak Telur Ajaib</h1>
                            <p className="text-xl text-white">Cerita Penutup</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col items-center justify-center mt-[30vh]">
                    <div className="flex justify-center">
                        <img src="/images/arungioutro.png" alt="Congratulations" className="w-full justify-center" />
                    </div>
                <p id="selamat" className="mt-4 text-base text-center">
                    Pasangan itu membawa pulang keenam telur dengan penuh rasa ingin tahu dan harapan. <br></br>
                    Mereka tak tahu dari mana asalnya,tapi mereka yakin..<br></br>
                    <b>—ini adalah jawaban dari doa mereka.</b>
                </p>
                <button id="finishedgamebutton"
                    onClick={() => {
                        handleBackChoice();
                        navigate('/story-detail/empat-raja');
                    }}
                    className="mt-6 bg-primary-orange text-white px-4 py-2 rounded-lg justify-center"
                >
                    Kembali
                </button>
            </div>
            </div>
        );
    }
  
   
   if (isInactive) {
        return (
            <div id="menulefttab" className="h-screen w-full flex flex-col items-center justify-center bg-primary-darker">
                <div className="text-2xl font-bold text-white mb-4 text-center">Anda telah meninggalkan permainan</div>
                <button
                    onClick={() => handleLogout()}
                    className="bg-primary-orange text-white px-8 py-3 rounded-xl text-lg font-bold hover:bg-primary-orange/90 transition-colors"
                >
                    Keluar
                </button>
            </div>
        );
    }
    return (
        <div>
                       <div id="bannertop" className="fixed top-0 left-0 w-full z-10">
                <div className="relative">
                    <button 
                        onClick={() => handleLogout()}
                        className="absolute top-4 left-4 z-20 w-10 h-10"
                    >
                        <img 
                            src="/images/back.png" 
                            alt="Back" 
                            className="w-full h-full object-contain"
                        />
                    </button>
                    <img 
                        src="/images/banner4.png" 
                        alt="Banner" 
                        className="w-full h-[25vh] object-cover"
                    />
                    <div id="isibaner" className="absolute inset-0 flex flex-col items-center justify-center">
                        <h1 className="text-3xl font-bold text-white mb-2">Jejak Telur Ajaib</h1>
                        <div id="ketkoleksi" className="px-4 py-2 rounded-lg text-xl font-bold text-white">
                           Koleksi: {collectionCount}/7
                         </div>
                    </div>
                   
                </div>
            </div>
           
            
    
            {showDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-primary-darker w-full h-full flex flex-col">
                        <div className="w-full h-1/2 p-4">
                            <img 
                                id="gambarEvent"
                                src={dialogImage} 
                                alt="NPC"
                                className="w-full h-full object-contain rounded-lg"
                            />
                            <p className="absolute top-2 right-2 text-white bg-black bg-opacity-50 px-2 rounded">Koleksi: {collectionCount}/6</p>
                        </div>

                        <div className="w-full h-1/2 bg-white p-6 rounded-t-3xl flex flex-col">
                            <div className="flex-1 overflow-y-auto">
                                <p className="text-2xl text-center">
                                    {dialogText}
                                    {isTyping && <span className="animate-pulse">|</span>}
                                </p>
                            </div>
                            {!isTyping && (
                                <div className="flex justify-center pb-4">
                                    {showOkButton ? (
                                        <>
                                            <button 
                                                onClick={() => {
                                                    setShowDialog(false);
                                                }}
                                                className="bg-primary-orange text-white px-8 py-3 rounded-xl text-lg font-bold hover:bg-primary-orange/90 transition-colors"
                                            >
                                                OK
                                            </button>
                                            <button 
                                                onClick={() => setShowDialog(false)}
                                                className="bg-primary-orange text-white px-8 py-3 rounded-xl text-lg font-bold hover:bg-primary-orange/90 transition-colors"
                                              >
                                                Batal
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => setShowDialog(false)}
                                            className="bg-primary-orange text-white px-8 py-3 rounded-xl text-lg font-bold hover:bg-primary-orange/90 transition-colors"
                                        >
                                            Tutup
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
                       <div id="questdesc" style={{ position: 'absolute', top: '37%', left: '50%', transform: 'translateX(-50%)', color: 'yellow', fontSize: '24px' }}>
                <h1 className="text-3xl font-bold mb-4 justify-center text-white">Quest Items:</h1>
                <div id="isiItem" style={{ width: '100%', textAlign: 'left', fontSize:'14px' }}>
                    {renderQuestItems()}
                </div>
            </div>
            <div id="chatzone" style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '200px' }}>
                <button 
                    onClick={() => setShowChatGrid(!showChatGrid)}
                    className="bg-primary-orange text-white px-4 py-2 rounded font-bold w-full text-sm"
                >
                    {showChatGrid ? "Tutup Chat" : "Buka Chat"}
                </button>
                
                {showChatGrid && (
                    <div className="bg-primary-darker p-4 rounded-b-lg rounded-tr-lg w-full">
                        <div className="grid grid-cols-1 gap-2 w-full max-h-[200px] overflow-y-auto scrollbar-thick scrollbar-thumb-primary-orange scrollbar-track-white pr-4">
                            {chatTemplates.map((template, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleChatTemplate(template)}
                                    className="bg-white text-primary-darker px-2 py-2 rounded-lg text-sm hover:bg-primary-orange hover:text-white transition-colors w-full break-words"
                                >
                                    {template}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
           

                
            
            <div id="joysticon" style={{ position: 'absolute', bottom: 15, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              
              
               
            
             
                <Joystick size={200} sticky={false} baseColor="white" stickColor="grey" move={handleMove} stop={handleStop}></Joystick>
            </div>

        </div>

        
    );
    
};


export default Joystix;

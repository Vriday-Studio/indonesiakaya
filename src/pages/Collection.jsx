import React, { useEffect, useState } from "react";
import { getCountFromTotal } from "../lib/firebase/scannedImageServices";
import { useAuth } from "../context/AuthProvider";
import { getAllArtworks } from "../lib/firebase/artwork";
import BackIcon from "../components/BackIcon";
import bgAuth from "/images/bg-auth.png";
import FramedImage from "../components/FramedImage";
import ActiveFrame from "/images/frame-active.png";
import LoadingScreen from "../components/LoadingScreen";

const Collection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [countFromTotal, setCountFromTotal] = useState("");

    const { user } = useAuth();

    // Dummy data untuk testing
    const collectionx = [
        {
            id: "1",
            isCollected: true,
            url: "/story-detail",
            frameSrc: ActiveFrame,
            imageSrc: "/images/car1.png",
            imageTitle: "Karya Seni 1"
        },
        {
            id: "2",
            isCollected: true,
            url: "/Home2",
            frameSrc: ActiveFrame,
            imageSrc: "/images/car2.png",
            imageTitle: "Karya Seni 2"
        },
        {
            id: "3",
            isCollected: true,
            url: "/Home2",
            frameSrc: ActiveFrame,
            imageSrc: "/images/car3.png",
            imageTitle: "Karya Seni 3"
        },
        {
            id: "4",
            isCollected: true,
            url: "/Home2",
            frameSrc: ActiveFrame,
            imageSrc: "/images/car4.png",
            imageTitle: "Karya Seni 4"
        },
        {
            id: "5",
            isCollected: true,
            url: "/Home2",
            frameSrc: ActiveFrame,
            imageSrc: "/images/car5.png",
            imageTitle: "Karya Seni 5"
        }
    ];

    // useEffect(() => {
      //  if (!user) return;

       // const fetchData = async () => {
           // try {
               // const [artworkData, countData] = await Promise.all([getAllArtworks(), getCountFromTotal(user.id)]);
           //     setCollections(artworkData);
               // setCountFromTotal(countData);
               // setIsLoading(false);
           // } catch (error) {
           //     console.error(error);
           // }
       // };
      //  fetchData();
   // }, [user]);

    //if (isLoading) {
       // return (
       //     <LoadingScreen />
       // );
  //  }

    return (
        <div className="flex flex-col items-center gap-5 relative z-20 bg-primary-dark">
            <BackIcon className="absolute left-2 top-2 z-10" iconColor="white" />
            <div className="relative flex flex-col justify-center items-center gap-1 px-5 w-full bg-primary-orange/80 h-48">
                <h1 className="text-3xl font-bold text-white">Halaman Koleksi</h1>
                <div className="bg-cream text-primary-brass rounded-2xl py-1 px-10 mt-2 font-bold">{countFromTotal}</div>
                <img src={bgAuth} alt="bg-auth" className="absolute w-4/5 h-full py-2" />
            </div>
            <div className="grid grid-cols-2 gap-7 py-5">
                {collectionx.map((collection) => (
                    <FramedImage
                        key={collection.id}
                        isCollected={collection.isCollected}
                        url={collection.url}
                        frameSrc={collection.frameSrc}
                        imageSrc={collection.imageSrc}
                        imageTitle={collection.imageTitle}
                    />
                ))}
            </div>
        </div>
    );
};

export default Collection;

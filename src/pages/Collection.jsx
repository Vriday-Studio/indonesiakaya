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
    const [collections, setCollections] = useState([]);
    const [countFromTotal, setCountFromTotal] = useState("");

    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const [artworkData, countData] = await Promise.all([getAllArtworks(), getCountFromTotal(user.id)]);
                setCollections(artworkData);
                setCountFromTotal(countData);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [user]);

    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }

    return (
        <div className="flex flex-col items-center gap-5 relative z-20 bg-primary-dark">
            <BackIcon className="absolute left-2 top-2 z-10" iconColor="white" />
            <div className="relative flex flex-col justify-center items-center gap-1 px-5 w-full bg-primary-orange/80 h-48">
                <h1 className="text-3xl font-bold text-white">Galeri</h1>
                <div className="bg-cream text-primary-brass rounded-2xl py-1 px-10 mt-2 font-bold">{countFromTotal}</div>
                <img src={bgAuth} alt="bg-auth" className="absolute w-4/5 h-full py-2" />
            </div>
            <div className="grid grid-cols-2 gap-7 py-5">
                {collections.map((collection) => (
                    <FramedImage
                        key={collection.id}
                        isCollected={collection.users && collection.users[user.id]}
                        url={`/collection/${collection.targetIndex[0]}?from=collection`}
                        frameSrc={ActiveFrame}
                        imageSrc={collection.image}
                        imageTitle={collection.title}
                    />
                ))}
            </div>
        </div>
    );
};

export default Collection;

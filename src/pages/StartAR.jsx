import React, { useEffect, useState } from "react";
import MindARViewer from "../mindar-viewer";
import { useAuth } from "../context/AuthProvider";
import { getCountFromTotal } from "../lib/firebase/scannedImageServices";
import { Navigate } from "react-router-dom";

const StartAR = () => {
    const { user } = useAuth();
    const [countFromTotal, setCountFromTotal] = useState("");
    const hasCompletedTutorial = sessionStorage.getItem("hasCompletedTutorial");

    useEffect(() => {
        if (!user) return;
        const fetchData = async () => {
            try {
                const res = await getCountFromTotal(user.id);
                setCountFromTotal(res);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    if (!hasCompletedTutorial) {
        return <Navigate to="/" />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <MindARViewer collectionCount={countFromTotal} />
            <video></video>
        </div>
    );
};

export default StartAR;

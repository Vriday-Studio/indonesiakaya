import React, { useCallback, useEffect, useRef } from "react";
import { getSelectedArtworkByIndex } from "./lib/firebase/artwork";
import { addImageScannedByUser } from "./lib/firebase/scannedImageServices";
import { useAuth } from "./context/AuthProvider";
const useARManager = (sceneRef) => {
    const arSystem = useRef();
    const [targetFound, setTargetFound] = React.useState(null);
    const [isReady, setIsReady] = React.useState(false);
    const { user } = useAuth();

    const startAR = useCallback(() => {
        if (!arSystem.current) return;

        const scannerOverlay = arSystem.current.ui.scanningMask;
        if (scannerOverlay) {
            scannerOverlay.classList.remove("hidden");
        }

        return arSystem.current.start();
    }, [arSystem.current]);
    const stopAR = useCallback(() => {
        if (!arSystem.current) return;

        const scannerOverlay = arSystem.current.ui.scanningMask;
        if (scannerOverlay) {
            scannerOverlay.classList.add("hidden");
        }

        return arSystem.current.stop();
    }, [arSystem.current]);

    useEffect(() => {
        if (!sceneRef.current) return;

        const handleLoaded = () => {
            if (!sceneRef.current) return;

            let arSystems = "mindar-image-system";
            arSystem.current = sceneRef.current.systems[arSystems];
            sceneRef.current.addEventListener("targetFound", async (e) => {
                setTargetFound(e);
                const selectedArtwork = await getSelectedArtworkByIndex(e.target.components["mindar-image-target"].attrValue.targetIndex);
                await addImageScannedByUser(user, selectedArtwork.id);
            });

            sceneRef.current.addEventListener("targetLost", (e) => {
                setTargetFound(null);
            });
        };

        sceneRef.current.addEventListener("loaded", handleLoaded);

        return () => {
            if (sceneRef.current) {
                sceneRef.current.removeEventListener("loaded", handleLoaded);
            }
            stopAR();
        };
    }, [sceneRef]);

    useEffect(() => {
        if (sceneRef.current) {
            sceneRef.current.addEventListener("arReady", () => {
                setIsReady(true);
            });
        }
    }, [sceneRef]);

    return {
        startAR,
        stopAR,
        arSystem: arSystem.current,
        targetFound,
        isReady
    };
};

export default useARManager;

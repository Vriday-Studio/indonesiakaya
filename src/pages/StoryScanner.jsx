import React, { useEffect, useRef, useState } from "react";
import "aframe";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import { useNavigate } from "react-router-dom";

const StoryScanner = () => {
    const sceneRef = useRef();
    const navigate = useNavigate();
    const [targetFound, setTargetFound] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState(null);
    const arSystem = useRef();

    // Start AR scanning
    const startAR = () => {
        if (!arSystem.current) return;
        
        try {
            const scannerOverlay = arSystem.current.ui.scanningMask;
            if (scannerOverlay) {
                scannerOverlay.classList.remove("hidden");
            }
            
            return arSystem.current.start();
        } catch (err) {
            console.error("Error starting AR:", err);
            setError("Failed to start AR scanner. Please try again.");
        }
    };

    // Stop AR scanning
    const stopAR = () => {
        if (!arSystem.current) return;
        
        try {
            const scannerOverlay = arSystem.current.ui.scanningMask;
            if (scannerOverlay) {
                scannerOverlay.classList.add("hidden");
            }
            
            return arSystem.current.stop();
        } catch (err) {
            console.error("Error stopping AR:", err);
        }
    };

    useEffect(() => {
        document.documentElement.classList.add("a-fullscreen");

        // Delay starting AR to ensure everything is properly loaded
        const timer = setTimeout(() => {
            startAR();
        }, 500);

        return () => {
            clearTimeout(timer);
            stopAR();
            document.documentElement.classList.remove("a-fullscreen");
        };
    }, []);

    useEffect(() => {
        if (!sceneRef.current) return;

        const handleLoaded = () => {
            if (!sceneRef.current) return;

            try {
                arSystem.current = sceneRef.current.systems["mindar-image-system"];
                
                // Handle target found event
                sceneRef.current.addEventListener("targetFound", (e) => {
                    setTargetFound(e);
                    
                    // Get the target index from the found target
                    const targetIndex = e.target.components["mindar-image-target"].attrValue.targetIndex;
                    
                    // Route to the appropriate story detail page based on target index
                    // Target index 0 = lutung, Target index 1 = empat-raja
                    setTimeout(() => {
                        if (targetIndex === 0) {
                            navigate("/story-detail/lutung");
                        } else if (targetIndex === 1) {
                            navigate("/story-detail/empat-raja");
                        }
                    }, 1500); // Delay navigation to show the "Target ditemukan" message
                });

                // Handle target lost event
                sceneRef.current.addEventListener("targetLost", () => {
                    setTargetFound(null);
                });
            } catch (err) {
                console.error("Error in AR setup:", err);
                setError("Failed to initialize AR scanner. Please refresh the page.");
            }
        };

        const handleError = (err) => {
            console.error("AR scene error:", err);
            setError("An error occurred with the AR scanner. Please refresh the page.");
        };

        sceneRef.current.addEventListener("loaded", handleLoaded);
        sceneRef.current.addEventListener("error", handleError);
        
        // Handle AR ready event
        sceneRef.current.addEventListener("arReady", () => {
            setIsReady(true);
        });

        return () => {
            if (sceneRef.current) {
                sceneRef.current.removeEventListener("loaded", handleLoaded);
                sceneRef.current.removeEventListener("error", handleError);
            }
            stopAR();
        };
    }, [navigate]);

    // Handle the case where there's an error
    if (error) {
        return (
            <div className="min-h-screen bg-primary-darker flex flex-col items-center justify-center p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Scanner Error</h2>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button 
                        onClick={() => navigate(-1)}
                        className="bg-primary-orange text-white px-6 py-2 rounded-lg font-semibold"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div style={{ height: "100vh" }}>
                <a-scene
                    ref={sceneRef}
                    mindar-image="imageTargetSrc: /targets.mind; filterMinCF:0.001; filterBeta: 1; missTolerance: 5; warmupTolerance: 5"
                    color-space="sRGB"
                    renderer="colorManagement: true, physicallyCorrectLights"
                    device-orientation-permission-ui="enabled: false"
                    vr-mode-ui="enabled: false"
                    loading-screen="enabled: false"
                >
                    <a-assets></a-assets>
                    <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

                    {/* Target for Lutung Kasarung */}
                    <a-entity mindar-image-target="targetIndex: 0">
                        <a-plane color="#22C55E" opacity="0.2" position="0 0 0" rotation="0 0 0" width="0.9" height="1.2"></a-plane>
                    </a-entity>

                    {/* Target for Empat Raja */}
                    <a-entity mindar-image-target="targetIndex: 1">
                        <a-plane color="#22C55E" opacity="0.2" position="0 0 0" rotation="0 0 0" width="0.9" height="1.2"></a-plane>
                    </a-entity>
                </a-scene>
            </div>
            
            {isReady && (
                <>
                    {/* Back button */}
                    <button 
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-4 z-20 bg-white/30 rounded-full p-2"
                    >
                        <img 
                            src="/images/back.png" 
                            alt="Back" 
                            className="w-6 h-6"
                        />
                    </button>
                    
                    {/* Status message */}
                    <div
                        className={`${
                            targetFound ? "border-transparent bg-green-500/20" : "border-gray bg-gray/20"
                        } font-playfair text-nowrap text-sm backdrop-blur-sm text-white absolute bottom-28 left-1/2 -translate-x-1/2 z-10 border px-8 py-4 rounded-xl flex gap-4 justify-center`}
                    >
                        {targetFound ? "Target ditemukan" : "Arahkan kamera pada QR Code"}
                    </div>
                </>
            )}
        </>
    );
};

export default StoryScanner;

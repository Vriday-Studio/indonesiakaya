import React, { useEffect, useRef } from "react";
import "aframe";
import "mind-ar/dist/mindar-image-aframe.prod.js";
import useARManager from "./useARManager";
import logoGaleri from "/images/logo-galeri-indonesia-kaya.png";
import IconCollection from "/icons/icon-collection.png";
import { Link, useNavigate } from "react-router-dom";

export default function MindARViewer({collectionCount }) {
    // There is a reason why we use localStorage here, see the comment in src/App.jsx
    const targetUrl = localStorage.getItem("targetUrl");
    const listAssets = JSON.parse(localStorage.getItem("listAssets"));

    const sceneRef = useRef();
    const navigate = useNavigate();

    const { startAR, stopAR, targetFound, isReady } = useARManager(sceneRef);

    useEffect(() => {
        startAR();
        document.documentElement.classList.add("a-fullscreen");

        return () => {
            stopAR();
            document.documentElement.classList.remove("a-fullscreen");
        };
    }, []);

    useEffect(() => {
        if (targetFound) {
            const timer = setTimeout(() => {
                navigate(`/collection/${targetFound.target.components["mindar-image-target"].attrValue.targetIndex}?from=scan`);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [targetFound, navigate]);

    return (
        <>
            {isReady && (
                <div className="relative">
                    <Link to="/" className="absolute top-3 left-3 z-20 bg-gray-black opacity-60 rounded-xl p-4">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M2.96195 1.18476H6.87681C7.90915 1.18476 8.75705 2.04197 8.75705 3.11313V7.11452C8.75705 8.18569 7.90915 9.04289 6.87681 9.04289H2.96195C1.92961 9.04289 1.08171 8.18569 1.08171 7.11452V3.11313C1.08171 2.04197 1.92961 1.18476 2.96195 1.18476Z"
                                fill="white"
                                stroke="white"
                                strokeWidth="0.594077"
                            />
                            <path
                                d="M16.8788 0.887726H12.9639C11.7614 0.887726 10.7866 1.88407 10.7866 3.11313V7.11452C10.7866 8.34358 11.7614 9.33993 12.9639 9.33993H16.8788C18.0812 9.33993 19.056 8.34358 19.056 7.11452V3.11313C19.056 1.88407 18.0812 0.887726 16.8788 0.887726Z"
                                fill="black"
                            />
                            <path
                                d="M6.87681 11.0027H2.96195C1.75947 11.0027 0.784668 11.9991 0.784668 13.2281V17.2295C0.784668 18.4586 1.75947 19.4549 2.96195 19.4549H6.87681C8.07929 19.4549 9.05409 18.4586 9.05409 17.2295V13.2281C9.05409 11.9991 8.07929 11.0027 6.87681 11.0027Z"
                                fill="black"
                            />
                            <path
                                d="M16.8788 11.0027H12.9639C11.7614 11.0027 10.7866 11.9991 10.7866 13.2281V17.2295C10.7866 18.4586 11.7614 19.4549 12.9639 19.4549H16.8788C18.0812 19.4549 19.056 18.4586 19.056 17.2295V13.2281C19.056 11.9991 18.0812 11.0027 16.8788 11.0027Z"
                                fill="black"
                            />
                        </svg>
                    </Link>
                    <img src={logoGaleri} alt="Galeri Indonesia Kaya" className="w-1/2 absolute top-5 left-1/2 -translate-x-1/2 z-20" />
                    <Link to="/guide" className="absolute top-3 right-3 z-20 bg-gray-black opacity-60 rounded-xl p-4">
                        <svg width="20" height="20" viewBox="0 0 10 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3.87402 10.4642L3.87832 10.4631L3.92963 10.3103C4.07279 9.88409 4.14539 9.50422 4.084 9.21155C4.05114 9.05489 3.97622 8.90654 3.83895 8.80105C3.70398 8.69731 3.54224 8.66084 3.38378 8.66084C2.98501 8.66084 2.64499 8.87146 2.36318 9.20312L2.3627 9.20369C2.32418 9.24926 2.28565 9.29878 2.2471 9.35217C2.5115 8.92425 2.82045 8.60628 3.16938 8.3879C3.78933 7.9999 4.49371 7.80422 5.28824 7.80422C6.09809 7.80422 6.64635 7.9974 6.95488 8.31603C7.29199 8.6642 7.48175 9.09049 7.52128 9.60937L7.52128 9.60943C7.56261 10.1506 7.49233 10.6955 7.31011 11.2434L7.30999 11.2438L4.52943 19.6394L4.52931 19.6394L4.52686 19.6476C4.4526 19.8954 4.40398 20.1165 4.38605 20.307C4.36862 20.4923 4.37716 20.678 4.44546 20.8357C4.50524 20.9738 4.59823 21.0928 4.7297 21.1747C4.8597 21.2557 5.00662 21.2877 5.15466 21.2877C5.46213 21.2877 5.76252 21.1058 6.0411 20.8557C6.12012 20.7847 6.19624 20.6977 6.26999 20.5969C5.97993 21.083 5.64584 21.4175 5.27591 21.618L5.27568 21.6182C4.62527 21.9716 3.98422 22.1428 3.35218 22.1428C2.61658 22.1428 2.08039 21.9784 1.70853 21.6869C1.34378 21.401 1.11621 20.9703 1.05233 20.3591C0.987905 19.7412 1.09936 18.9566 1.40994 17.9927C1.41001 17.9925 1.41009 17.9922 1.41017 17.992L3.87402 10.4642ZM5.42886 4.56161C5.15879 4.32918 5.0099 4.01184 5.00139 3.57573L5.00354 3.4665C5.0194 2.6612 5.28716 2.08778 5.77895 1.69664C6.29377 1.28754 6.92038 1.07731 7.6724 1.07731C8.35875 1.07731 8.81843 1.22999 9.10472 1.48225C9.38438 1.72868 9.53647 2.09384 9.5198 2.63117L9.51974 2.63368C9.50438 3.31586 9.24537 3.86483 8.73579 4.30165C8.22039 4.74345 7.59007 4.96883 6.82358 4.96883C6.1776 4.96883 5.72726 4.81963 5.42938 4.56206L5.42886 4.56161Z"
                                fill="white"
                                stroke="white"
                                strokeWidth="0.594077"
                            />
                        </svg>
                    </Link>
                </div>
            )}
            <div style={{ height: "100vh" }}>
                <a-scene
                    ref={sceneRef}
                    mindar-image={`imageTargetSrc: ${targetUrl}; filterMinCF:0.001; filterBeta: 1`}
                    color-space="sRGB"
                    renderer="colorManagement: true, physicallyCorrectLights"
                    device-orientation-permission-ui="enabled: false"
                >
                    <a-assets></a-assets>

                    <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

                    {listAssets.map((asset, index) => {
                        return (
                            <a-entity key={asset.id} mindar-image-target={`targetIndex: ${index}; targetName: ${asset.title}`}>
                                <a-plane color="#22C55E" opacity="0.2" position="0 0 0" rotation="0 0 0" width="0.9" height="1.2"></a-plane>
                            </a-entity>
                        );
                    })}
                </a-scene>
            </div>
            {isReady && (
                <>
                    <div
                        className={`${
                            targetFound ? "border-transparent bg-green-500/20" : "border-gray bg-gray/20"
                        } tw-class font-playfair text-nowrap text-sm backdrop-blur-sm text-white absolute bottom-28 left-1/2 -translate-x-1/2 z-10 border px-8 py-4 rounded-xl flex gap-4 justify-center`}
                    >
                        {targetFound ? "Target ditemukan" : "Arahkan kamera pada QR Code"}
                    </div>
                   
                </>
            )}
        </>
    );
}

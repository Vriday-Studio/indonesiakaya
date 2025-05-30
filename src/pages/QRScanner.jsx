import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';

const QRScanner = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const requestRef = useRef(null);

  useEffect(() => {
    // Start the camera
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraPermission(true);
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setError('Could not access the camera. Please ensure camera permissions are granted.');
        setCameraPermission(false);
      }
    };

    startCamera();

    // Clean up function
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Function to process video frames and detect QR codes
  const scanQRCode = () => {
    if (!scanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Check if video is ready
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      // Set canvas dimensions to match video
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data for QR code detection
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      
      // Detect QR code in the image
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      
      // If QR code is detected
      if (code) {
        console.log('QR code detected:', code.data);
        handleQRCodeResult(code.data);
        setScanning(false);
      }
    }
    
    // Continue scanning
    if (scanning) {
      requestRef.current = requestAnimationFrame(scanQRCode);
    }
  };

  // Start scanning when video is ready
  const handleVideoPlay = () => {
    requestRef.current = requestAnimationFrame(scanQRCode);
  };

  // Fungsi untuk mematikan kamera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
  };

  // Handle QR code result
  const handleQRCodeResult = (data) => {
    try {
      // Special routing for specific QR codes
      if (data === "lutung") {
        stopCamera(); // Matikan kamera sebelum navigate
        navigate("/story-detail/lutung");
        return;
      } else if (data === "4raja") {
        stopCamera(); // Matikan kamera sebelum navigate
        navigate("/story-detail/empat-raja");
        return;
      }else  if (data === "https://empatraja.netlify.app/story-detail/lutung") {
        stopCamera(); // Matikan kamera sebelum navigate
        navigate("/story-detail/lutung");
        return;
      }else if (data === "https://empatraja.netlify.app/story-detail/empat-raja") {
        stopCamera(); // Matikan kamera sebelum navigate
        navigate("/story-detail/empat-raja");
        return;
      }else{
        
      }

      let url;
      try {
        url = new URL(data);
      } catch {
        if (data.startsWith('/')) {
          stopCamera(); // Matikan kamera sebelum navigate
          navigate(data);
          return;
        } else {
          // Tambahkan logika untuk memeriksa apakah data adalah URL
          try {
            new URL(data); // Jika ini berhasil, data adalah URL
            stopCamera(); // Matikan kamera sebelum redirect
            window.location.href = data; // Redirect ke URL
            return;
          } catch {
            setResult(data);
            return;
          }
        }
      }

      if (url.hostname === window.location.hostname) {
        stopCamera(); // Matikan kamera sebelum navigate
        navigate(url.pathname + url.search);
      } else {
        stopCamera(); // Matikan kamera sebelum redirect
        window.location.href = data;
      }
    } catch (err) {
      console.error('Error processing QR code:', err);
      setError('Invalid QR code format');
    }
  };

  // Restart scanning
  const handleRescan = () => {
    setResult(null);
    setError(null);
    setScanning(true);
    requestRef.current = requestAnimationFrame(scanQRCode);
  };

  // Update tombol back dan go back
  const handleBack = () => {
    stopCamera();
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-primary-darker flex flex-col">
      {/* Header */}
      <div className="relative w-full h-16 bg-primary-orange flex items-center justify-center">
        <img 
          src="/images/logo-galeri-indonesia-kaya.png" 
          alt="Logo Galeri Indonesia Kaya" 
          className="h-10"
        />
        <button 
          onClick={handleBack}
          className="absolute left-4 top-1/2 transform -translate-y-1/2"
        >
          <img 
            src="/images/back.png" 
            alt="Back" 
            className="w-8 h-8"
          />
        </button>
      </div>

      {/* Subtitle */}
      <div className="bg-black text-white py-2 text-center">
        <h2 className="text-lg font-semibold">Scan Ceritamu</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {cameraPermission === false && (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">Camera Access Denied</h2>
            <p className="text-gray-700 mb-6">Please allow camera access to scan QR codes.</p>
            <button 
              onClick={() => navigate(-1)}
              className="bg-primary-orange text-white px-6 py-2 rounded-lg font-semibold"
            >
              Go Back
            </button>
          </div>
        )}

        {error && (
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center mb-4">
            <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button 
              onClick={handleRescan}
              className="bg-primary-orange text-white px-6 py-2 rounded-lg font-semibold mr-2"
            >
              Try Again
            </button>
            <button 
              onClick={handleBack}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Go Back
            </button>
          </div>
        )}

        {!error && (
          <>
            <div className="relative w-full max-w-md aspect-square mb-4 rounded-lg overflow-hidden">
              <video 
                ref={videoRef} 
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay 
                playsInline 
                muted 
                onPlay={handleVideoPlay}
              />
              <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full"
                style={{ display: 'none' }}
              />
              
              {/* Scanning overlay */}
              {scanning && !result && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-3/4 h-3/4 border-2 border-white rounded-lg"></div>
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-white bg-black bg-opacity-50 py-2 px-4 rounded-lg inline-block">
                      Position QR code within the frame
                    </p>
                  </div>
                </div>
              )}
              
              {/* Result overlay - only show for non-URL results */}
              {result && !result.startsWith('http') && !result.startsWith('/') && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                  <div className="bg-white p-4 rounded-lg max-w-xs w-full text-center">
                    <h3 className="font-bold text-lg mb-2">QR Code Detected!</h3>
                    <p className="text-gray-700 mb-4 truncate">{result}</p>
                    <button 
                      onClick={handleRescan}
                      className="bg-primary-orange text-white px-6 py-2 rounded-lg font-semibold"
                    >
                      Scan Again
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {!result && !scanning && (
              <button 
                onClick={handleRescan}
                className="bg-primary-orange text-white px-6 py-2 rounded-lg font-semibold mt-4"
              >
                Scan Again
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QRScanner;

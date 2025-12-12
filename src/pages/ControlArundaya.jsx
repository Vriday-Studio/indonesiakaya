import React, { useEffect, useState, useCallback, useRef } from "react";
import { Joystick } from "react-joystick-component";
import { useAuth } from "../context/AuthProvider";
import { ref, set, get } from "firebase/database";
import { database } from "../lib/firebase/firebase";
import { useNavigate } from "react-router-dom";
import {
  getJumlahUserTamu,
  setJumlahUserTamu,
  TamuTrue,
} from "../lib/firebase/movexy";
import {
  setFinishArundaya,
  getFinishArundaya,
  getgameLutungPoint,
  setgameLutungPoint,
  setSkorLutungPoint,
  setOnlineArundaya,
} from "../lib/firebase/users";

import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL?.trim() ||
  "https://arundaya-socket-server2-production.up.railway.app";

const ControlArundaya = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showoffline, setShowoffline] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingCharacter, setIsResettingCharacter] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  // Refs
  const hasShownPopupRef = useRef(false);
  const intervalRef = useRef(null);
  const offlineTimeoutRef = useRef(null);
  const socketRef = useRef(null);
  const lastMoveRef = useRef({ x: 0, y: 0 });
  const moveThrottleRef = useRef(null);

  // ===========================
  // INIT SOCKET.IO PER PLAYER
  // ===========================
  useEffect(() => {
    if (!user?.id) return;

  const socket = io(SOCKET_URL, {
  // biarkan Socket.IO nego sendiri: polling -> websocket
  transports: ["websocket", "polling"],
  secure: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});



    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      setSocketConnected(true);

      // Register controller
      socket.emit("join-controller", { userId: user.id });
      console.log("📤 Emitted join-controller for user:", user.id);

      socket.emit("controller-status", {
        userId: user.id,
        status: "online",
      });

      // Initialize position
      socket.emit("joystick-move", { userId: user.id, x: 0, y: 0 });
      console.log("📤 Initial position sent: x=0, y=0");
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
      setSocketConnected(false);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected. Reason:", reason);
      setSocketConnected(false);
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [user?.id]);

  // =====================
  // FINISH & SCORE LOGIC
  // =====================
  const checkFinishArundaya = useCallback(async () => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    try {
      const hasFinished = await getFinishArundaya(user.id);
      hasShownPopupRef.current = hasFinished;
      setHasShownPopup(hasFinished);
    } catch (error) {
      console.error("Error checking finish arundaya:", error);
    }
  }, [user?.id, navigate]);

  const resetGameScore = useCallback(async () => {
    if (!user?.id) return;

    try {
      await Promise.all([
        setSkorLutungPoint(user.id, 0),
        setgameLutungPoint(user.id, 0),
      ]);
      setScore(0);
    } catch (error) {
      console.error("Error resetting game score:", error);
    }
  }, [user?.id]);

  const getScore = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // Read both `skor` and `gameLutungPoints`. Prefer `skor` when present
      const skorRef = ref(database, `Users/${user.id}/skor`);
      const scoreRefG = ref(database, `Users/${user.id}/gameLutungPoints`);

      const [snapshotSkor, snapshotG] = await Promise.all([get(skorRef), get(scoreRefG)]);
      const skorVal = snapshotSkor.exists() ? snapshotSkor.val() : null;
      const gameLutungPoints = snapshotG.exists() ? snapshotG.val() : null;

      // If neither exists, initialize both to 0
      if (skorVal === null && gameLutungPoints === null) {
        await Promise.all([
          setSkorLutungPoint(user.id, 0),
          setgameLutungPoint(user.id, 0),
        ]);
        setScore(0);
        return;
      }

      // Prefer `skor` if present and numeric, otherwise use gameLutungPoints
      const sourceValue = typeof skorVal === "number" ? skorVal : gameLutungPoints;
      const currentScore = Math.min(Number(sourceValue) || 0, 60);

      // If underlying game points reach threshold, keep existing finish logic
      const thresholdSource = gameLutungPoints || 0;
      if (thresholdSource >= 60 && !hasShownPopupRef.current) {
        await setFinishArundaya(user.id, true);
        hasShownPopupRef.current = true;
        setHasShownPopup(true);
        setShowPopup(true);
      }

      // Keep gameLutungPoints in sync with capped value
      await setgameLutungPoint(user.id, currentScore);

      if (thresholdSource >= 60) {
        await setSkorLutungPoint(user.id, 60);
      }

      setScore(currentScore);
    } catch (error) {
      console.error("Error getting score:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    getScore();
    intervalRef.current = setInterval(() => {
      getScore();
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user?.id, getScore]);

  // ============================
  // MOVEMENT VIA SOCKET.IO
  // ============================
  const updateMoveUser = useCallback(
    (x, y) => {
      if (!user?.id || showoffline || !socketConnected) {
        console.warn(
          "❌ Cannot move. User:",
          user?.id,
          "Offline:",
          showoffline,
          "Connected:",
          socketConnected
        );
        return;
      }

      // Throttle movement to avoid spam
      if (moveThrottleRef.current) {
        clearTimeout(moveThrottleRef.current);
      }

      const socket = socketRef.current;
      if (!socket || !socket.connected) {
        console.warn("❌ Socket not connected");
        return;
      }

      // Only emit if position changed
      if (lastMoveRef.current.x !== x || lastMoveRef.current.y !== y) {
        lastMoveRef.current = { x, y };

        console.log("📤 Joystick move emitted:", { userId: user.id, x, y });
        socket.emit("joystick-move", {
          userId: user.id,
          x,
          y,
        });

        // Throttle to prevent excessive emissions
        moveThrottleRef.current = setTimeout(() => {
          moveThrottleRef.current = null;
        }, 50);
      }
    },
    [user?.id, showoffline, socketConnected]
  );

  const cancelOfflineTimeout = useCallback(() => {
    if (offlineTimeoutRef.current) {
      clearTimeout(offlineTimeoutRef.current);
      offlineTimeoutRef.current = null;
    }
  }, []);

  const updateIsMoveUser = useCallback(
    async (status) => {
      if (!user?.id) return;

      const socket = socketRef.current;
      if (socket && socket.connected) {
        console.log("📤 Controller status emitted:", { userId: user.id, status });
        socket.emit("controller-status", {
          userId: user.id,
          status,
        });

        if (status === "offline") {
          socket.emit("joystick-move", {
            userId: user.id,
            x: 0,
            y: 0,
          });
        }
      }

      try {
        if (status === "offline") {
          await Promise.all([
            set(ref(database, `Users/${user.id}/ismove`), status),
            set(ref(database, `Users/${user.id}/moveX`), 0),
            set(ref(database, `Users/${user.id}/moveY`), 0),
          ]);
        } else {
          await set(ref(database, `Users/${user.id}/ismove`), status);
        }
      } catch (error) {
        console.error("Error updating user move status:", error);
      }
    },
    [user?.id]
  );

  const handleOfflineUser = useCallback(async () => {
    if (!user?.id) return;

    try {
      const jumlahTamu = await getJumlahUserTamu();
      await setJumlahUserTamu(jumlahTamu - 1);

      await updateIsMoveUser("offline");
      setShowoffline(true);
      console.log("⚠️ User marked as offline");
    } catch (error) {
      console.error("Error handling offline user:", error);
    }
  }, [user?.id, updateIsMoveUser]);

  // ============================
  // JOYSTICK EVENT HANDLERS
  // ============================
  const handleMove = useCallback(
    (event) => {
      console.log("🎮 Joystick moved:", event);
      cancelOfflineTimeout();
      updateMoveUser(event.x, event.y);
    },
    [updateMoveUser, cancelOfflineTimeout]
  );

  const handleStop = useCallback(() => {
    console.log("🛑 Joystick stopped");
    cancelOfflineTimeout();
    updateMoveUser(0, 0);
  }, [updateMoveUser, cancelOfflineTimeout]);

  const handleHome = useCallback(() => {
    cancelOfflineTimeout();
    updateMoveUser(0, 0);
    updateIsMoveUser("offline");
    navigate("/arundaya");
  }, [updateMoveUser, updateIsMoveUser, navigate, cancelOfflineTimeout]);

  const handleContinuePlaying = useCallback(() => {
    setShowPopup(false);
    resetGameScore();
  }, [resetGameScore]);

  const handleResetCharacter = useCallback(async () => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    cancelOfflineTimeout();
    const cachedDataString = sessionStorage.getItem("arundayaDataString");

    if (!cachedDataString) {
      console.warn("Tidak ada data karakter tersimpan untuk direset.");
      return;
    }

    setIsResettingCharacter(true);
    try {
      await TamuTrue(cachedDataString);
      await setOnlineArundaya(user.id, true);
      console.log("✅ Karakter berhasil direset:", cachedDataString);
    } catch (error) {
      console.error("Error resetting character:", error);
    } finally {
      setIsResettingCharacter(false);
    }
  }, [user?.id, navigate, cancelOfflineTimeout]);

  const sendMessage = useCallback(
    async (message) => {
      if (!user?.id) return;

      cancelOfflineTimeout();

      const socket = socketRef.current;
      if (socket && socket.connected) {
        console.log("💬 Message emitted:", { userId: user.id, message });
        socket.emit("controller-chat", {
          userId: user.id,
          message,
        });
      }

      try {
        await Promise.all([
          set(ref(database, `Users/${user.id}/message`), message),
          set(ref(database, `Users/${user.id}/ismessage`), true),
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [user?.id, cancelOfflineTimeout]
  );

  // ============================
  // EFFECTS
  // ============================
  useEffect(() => {
    const handleUnhandledRejection = (event) => {
      const message = event?.reason?.message;
      if (
        typeof message === "string" &&
        message.includes("Receiving end does not exist")
      ) {
        console.warn("Chrome extension error ignored");
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () =>
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        console.log("👁️ Tab hidden - setting offline timeout");
        cancelOfflineTimeout();
        offlineTimeoutRef.current = setTimeout(() => {
          handleOfflineUser();
          offlineTimeoutRef.current = null;
        }, 5000);
      } else if (document.visibilityState === "visible") {
        console.log("👁️ Tab visible - canceling offline");
        cancelOfflineTimeout();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelOfflineTimeout();
    };
  }, [handleOfflineUser, cancelOfflineTimeout]);

  useEffect(() => {
    checkFinishArundaya();
  }, [checkFinishArundaya]);

  // Reset `skor` to 0 when loading the controller page
  useEffect(() => {
    const resetSkorOnLoad = async () => {
      if (!user?.id) return;
      try {
        await setSkorLutungPoint(user.id, 0);
        setScore(0);
      } catch (error) {
        console.error("Error resetting skor on load:", error);
      }
    };

    resetSkorOnLoad();
  }, [user?.id]);

  useEffect(() => {
    const initializeUserStatus = async () => {
      if (!user?.id || showoffline) return;

      try {
        const ismoveRef = ref(database, `Users/${user.id}/ismove`);
        const ismoveSnapshot = await get(ismoveRef);
        const ismoveValue = ismoveSnapshot.val();

        if (ismoveValue === "offline") {
          await Promise.all([
            set(ref(database, `Users/${user.id}/moveX`), 0),
            set(ref(database, `Users/${user.id}/moveY`), 0),
          ]);
        } else if (ismoveValue === null || ismoveValue === undefined) {
          await Promise.all([
            set(ref(database, `Users/${user.id}/ismove`), "online"),
            set(ref(database, `Users/${user.id}/moveX`), 0),
            set(ref(database, `Users/${user.id}/moveY`), 0),
          ]);
        }
      } catch (error) {
        console.error("Error initializing user status:", error);
      }
    };

    initializeUserStatus();
  }, [user?.id, showoffline]);

  // ============================
  // RENDER UI
  // ============================
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-primary-darker p-4 pb-8 space-y-4">
      {/* Debug info - remove in production */}
      {/* debug panel removed */}

      {showoffline ? (
        <div className="h-full w-full flex flex-col items-center justify-center bg-primary-darker">
          <h1 className="text-2xl font-bold text-white mb-4 text-center">
            Anda telah <br /> meninggalkan permainan
          </h1>
          <br />
          <button
            onClick={handleHome}
            className="bg-red-500 text-white px-6 py-3 rounded"
          >
            Keluar
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center w-full max-w-sm gap-4">
            <div className="relative w-full">
              <button
                id="homebutton"
                onClick={handleHome}
                className="absolute -top-3 -left-3 z-30 w-12 h-12 bg-transparent border-none"
              >
                <img
                  src="/images/back.png"
                  alt="Back"
                  className="w-full h-full object-contain"
                />
              </button>
              <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
                <img
                  src="/images/banner4.png"
                  alt="Banner"
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black/30">
                  <h1 className="text-2xl font-bold text-white mb-1 drop-shadow">
                    Tamu Istana
                  </h1>
                  <p className="text-white text-base drop-shadow">Skor</p>
                  <p
                    id="score"
                    className="text-white text-lg font-semibold drop-shadow"
                  >
                    {`${score}/60`}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center w-full relative z-10">
              <button
                onClick={handleResetCharacter}
                disabled={isResettingCharacter}
                className="bg-blue-500 disabled:bg-blue-300 text-white px-4 py-2 rounded shadow w-full text-sm font-semibold"
              >
                {isResettingCharacter ? "Resetting..." : "Reset Character"}
              </button>
            </div>
          </div>

          <div className="w-full max-w-sm">
            <h3 className="text-white text-lg mb-2">Chat:</h3>
            <div className="relative w-full rounded-lg bg-black/30 p-2">
              <div
                className="max-h-32 overflow-y-auto space-y-3"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
                  maskImage:
                    "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
                }}
              >
                {[
                  "Hai!",
                  "Kesana yuk!",
                  "Terima kasih!",
                  "Aku dapat!",
                  "Ayo cari bersama!",
                  "Mana lagi ya?",
                  "Selamat datang!",
                  "Semangat terus!",
                  "Aku duluan!",
                  "Sampai jumpa!",
                ].map((message, index) => (
                  <button
                    key={index}
                    className="w-full chat-button bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors duration-200 text-sm"
                    onClick={() => sendMessage(message)}
                  >
                    {message}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center w-full mt-4">
            <Joystick
              size={160}
              sticky={false}
              baseColor="white"
              stickColor="grey"
              move={handleMove}
              stop={handleStop}
            />
          </div>

          {showPopup && (
            <div className="fixed inset-0 flex justify-center bg-black bg-opacity-90 z-50">
              <div className="bg-black p-5 rounded-lg text-center w-full h-full flex flex-col justify-center">
                <div className="relative w-full">
                  <img
                    src="/images/banner4.png"
                    alt="Banner"
                    className="w-full h-auto object-cover"
                  />
                  <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-white drop-shadow-lg">
                    Selesai!
                  </h2>
                </div>
                <p className="text-white mt-6">
                  Anda sudah mendapatkan cukup item.
                </p>
                <p className="text-white">
                  Apakah Anda masih ingin bermain lagi?
                </p>
                <div className="mt-4 flex flex-col space-y-5">
                  <button
                    onClick={handleContinuePlaying}
                    className="bg-green-500 text-white px-6 py-3 rounded w-full"
                  >
                    Ya
                  </button>
                  <button
                    onClick={handleHome}
                    className="bg-red-500 text-white px-6 py-3 rounded w-full"
                  >
                    Tidak
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ControlArundaya;

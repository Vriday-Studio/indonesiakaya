import React, { useEffect, useState, useCallback, useRef } from "react";
import { Joystick } from "react-joystick-component";
import { useAuth } from "../context/AuthProvider";
import { ref, set, get, remove, update } from "firebase/database";
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

const ControlArundaya = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showoffline, setShowoffline] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingCharacter, setIsResettingCharacter] = useState(false);

  // Refs
  const hasShownPopupRef = useRef(false);
  const intervalRef = useRef(null);
  const offlineTimeoutRef = useRef(null);

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
  // MOVEMENT VIA FIREBASE
  // ============================
  const updateMoveUser = useCallback(
    (x, y) => {
      if (!user?.id || showoffline) {
        console.warn(
          "❌ Cannot move. User:",
          user?.id,
          "Offline:",
          showoffline
        );
        return;
      }

      try {
        const dbUserRef = ref(database, `Users/${user.id}`);
        update(dbUserRef, {
          ismove: "true",
          moveX: -x,
          moveY: -y,
          isMessage: "false",
        });
        console.log("📤 Joystick move updated:", { userId: user.id, x: -x, y: -y });
      } catch (error) {
        console.error("Error updating user movement:", error);
      }
    },
    [user?.id, showoffline]
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

      try {
        const dbUserRef = ref(database, `Users/${user.id}`);
        if (status === "offline") {
          await update(dbUserRef, {
            ismove: status,
            moveX: 0,
            moveY: 0,
          });
        } else {
          await update(dbUserRef, {
            ismove: status,
          });
        }
        console.log("📤 User move status updated:", { userId: user.id, status });
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
    if (!user?.id) return;
    
    try {
      const dbUserRef = ref(database, `Users/${user.id}`);
      update(dbUserRef, {
        ismove: "false",
        moveX: 0,
        moveY: 0,
      });
      console.log("📤 Joystick stopped - position reset");
    } catch (error) {
      console.error("Error stopping joystick:", error);
    }
  }, [user?.id, cancelOfflineTimeout]);

  const handleHome = useCallback(() => {
    cancelOfflineTimeout();
    updateMoveUser(0, 0);
    updateIsMoveUser("offline");
    navigate("/");
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

      try {
        const dbUserRef = ref(database, `Users/${user.id}`);
        const messageWithPrefix = "chat_" + message;
        await update(dbUserRef, {
          message: messageWithPrefix,
          ismessage: true,
        });
        console.log("💬 Message sent:", { userId: user.id, message: messageWithPrefix });
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

  // Register this user into Antrian on first load, remove on unmount
  useEffect(() => {
    if (!user?.id) return;

    const registerAntrian = async () => {
      try {
        const antrianRef = ref(database, `Antrian`);
        const display = user.displayName || user.name || user.id;
        await set(antrianRef, "nonewplayer "+display);
        console.log("✅ Registered in Antrian:", user.id, display);
      } catch (error) {
        console.error("Error registering Antrian:", error);
      }
    };

    registerAntrian();

    
  }, [user?.id]);

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
                    Arundaya
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
